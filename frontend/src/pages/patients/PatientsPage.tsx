import {
  AgGridSortDirection,
  PatientIdsTriplet,
  PatientsListQuery,
  useDashboardPatientsLazyQuery,
  useGetPatientIdsTripletsLazyQuery,
} from "../../generated/graphql";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Form } from "react-bootstrap";
import { AlertModal } from "../../components/AlertModal";
import { Tooltip } from "@material-ui/core";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import { parseUserSearchVal } from "../../utils/parseSearchQueries";
import {
  PatientsListColumns,
  SampleMetadataDetailsColumns,
} from "../../shared/helpers";
import { getUserEmail } from "../../utils/getUserEmail";
import { openLoginPopup } from "../../utils/openLoginPopup";
import NewRecordsList from "../../components/NewRecordsList";

function addCDashToCMOId(cmoId: string): string {
  return cmoId.length === 6 ? `C-${cmoId}` : cmoId;
}

const MAX_ROWS_EXPORT = 10000;

const MAX_ROWS_EXPORT_WARNING = {
  title: "Warning",
  content:
    "You can only download up to 10,000 rows of data at a time. Please refine your search and try again. If you need the full dataset, contact the SMILE team at cmosmile@mskcc.org.",
};

const PHI_WARNING = {
  title: "Warning",
  content:
    "The information contained in this transmission from Memorial Sloan-Kettering Cancer Center is privileged, confidential and protected health information (PHI) and it is protected from disclosure under applicable law, including the Health Insurance Portability and Accountability Act of 1996, as amended (HIPAA). This transmission is intended for the sole use of approved individuals with permission and training to access this information and PHI. You are notified that your access to this transmission is logged. If you have received this transmission in error, please immediately delete this information and any attachments from any computer.",
};

const UNAUTHORIZED_WARNING = {
  title: "Access unauthorized",
  content:
    "You are not authorized to access PHI data. If you would like to request access, please reach out to the administrator.",
};

const NO_PHI_SEARCH_RESULTS = {
  title: "No PHI results found",
  content:
    "No PHI results were found for your search. No patient IDs in your search exist in either the SMILE or CRDB databases.",
};

interface IPatientsPageProps {
  userEmail: string | null;
  setUserEmail: Dispatch<SetStateAction<string | null>>;
}

export default function PatientsPage({
  userEmail,
  setUserEmail,
}: IPatientsPageProps) {
  const params = useParams();

  const [userSearchVal, setUserSearchVal] = useState<string>("");
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [phiEnabled, setPhiEnabled] = useState(false);
  const [patientIdsTriplets, setPatientIdsTriplets] = useState<
    PatientIdsTriplet[]
  >([]);
  const [alertModal, setAlertModal] = useState<{
    show: boolean;
    title: string;
    content: string;
  }>({ show: false, title: "", content: "" });

  const [getPatientIdsTriplets] = useGetPatientIdsTripletsLazyQuery();

  async function fetchPatientIdsTriplets(
    parsedSearchVals: string[]
  ): Promise<PatientIdsTriplet[]> {
    // Remove C- from CMO IDs because they are stored without it in the CRDB
    const patientIds = parsedSearchVals.map((query) =>
      query.startsWith("C-") ? query.slice(2) : query
    );

    const { data, error } = await getPatientIdsTriplets({
      variables: {
        patientIds: patientIds,
      },
    });

    if (error) {
      if (error.message === "401") {
        openLoginPopup();
      }

      if (error.message === "403") {
        setAlertModal({
          show: true,
          ...UNAUTHORIZED_WARNING,
        });
      }

      return [];
    }

    return (
      data?.patientIdsTriplets?.filter(
        (triplet): triplet is PatientIdsTriplet => triplet !== null
      ) ?? []
    );
  }

  async function getExtraCmoIdsFromMrnInputs(userSearchVal: string) {
    let extraCmoIds: string[] = [];
    if (phiEnabled && userSearchVal !== "") {
      const parsedSearchVals = parseUserSearchVal(userSearchVal);

      const patientIdsTriplets = await fetchPatientIdsTriplets(
        parsedSearchVals
      );
      setPatientIdsTriplets(patientIdsTriplets);

      if (patientIdsTriplets.length > 0) {
        patientIdsTriplets.forEach((triplet) => {
          // Add back C- to CMO IDs because they are stored without it in the CRDB
          const cmoIdWithCDash = addCDashToCMOId(triplet.CMO_ID);
          if (
            !parsedSearchVals.includes(cmoIdWithCDash) &&
            !parsedSearchVals.includes(triplet.DMP_ID ?? "")
          ) {
            extraCmoIds.push(cmoIdWithCDash);
          }
        });
      } else if (userEmail) {
        setAlertModal({
          show: true,
          ...NO_PHI_SEARCH_RESULTS,
        });
      }
    }
    return extraCmoIds;
  }

  useEffect(() => {
    async function handleLogin(event: MessageEvent) {
      if (event.data !== "success") return;

      const userEmail = await getUserEmail();
      setUserEmail(userEmail);

      setAlertModal({
        show: true,
        ...PHI_WARNING,
      });
    }

    if (phiEnabled) {
      window.addEventListener("message", handleLogin);
      if (!userEmail) openLoginPopup();
      return () => {
        window.removeEventListener("message", handleLogin);
      };
    }
    // eslint-disable-next-line
  }, [phiEnabled]);

  const ActivePatientsListColumns = useMemo(() => {
    return PatientsListColumns.map((column) => {
      if (
        column.headerName === "Patient MRN" &&
        phiEnabled &&
        patientIdsTriplets.length > 0 &&
        userEmail
      ) {
        return {
          ...column,
          hide: false,
          valueGetter: ({
            data,
          }: {
            data: PatientsListQuery["patients"][number];
          }) => {
            const cmoId = data.cmoPatientId;

            const patientIdsTriplet = patientIdsTriplets.find(
              (triplet) => addCDashToCMOId(triplet.CMO_ID) === cmoId
            );

            if (patientIdsTriplet) {
              return patientIdsTriplet.PT_MRN;
            } else {
              return "";
            }
          },
        };
      } else {
        return column;
      }
    });
  }, [phiEnabled, patientIdsTriplets, userEmail]);

  const dataName = "patients";
  const sampleQueryParamFieldName = "patientId";
  const sampleQueryParamValue = params[sampleQueryParamFieldName];
  const defaultSort = {
    colId: "dmpPatientId",
    sort: AgGridSortDirection.Desc,
  };

  return (
    <>
      <NewRecordsList
        columnDefs={ActivePatientsListColumns}
        dataName={dataName}
        defaultSort={defaultSort}
        lazyRecordsQuery={useDashboardPatientsLazyQuery}
        userSearchVal={userSearchVal}
        setUserSearchVal={setUserSearchVal}
        setCustomSearchStates={setPatientIdsTriplets}
        searchInterceptor={(userSearchVal) =>
          getExtraCmoIdsFromMrnInputs(userSearchVal)
        }
        showDownloadModal={showDownloadModal}
        setShowDownloadModal={setShowDownloadModal}
        handleDownload={(recordCount: number) => {
          if (recordCount && recordCount > MAX_ROWS_EXPORT) {
            setAlertModal({
              show: true,
              ...MAX_ROWS_EXPORT_WARNING,
            });
          } else {
            if (phiEnabled) {
              setAlertModal({
                show: true,
                ...PHI_WARNING,
              });
            }
            setShowDownloadModal(true);
          }
        }}
        samplesColDefs={SampleMetadataDetailsColumns}
        sampleContext={
          sampleQueryParamValue
            ? {
                fieldName: sampleQueryParamFieldName,
                values: [sampleQueryParamValue],
              }
            : undefined
        }
        customToolbarUI={
          <>
            <Col md="auto" className="mt-1">
              <div className="vr"></div>
            </Col>

            <Col md="auto" className="mt-1">
              <Form>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  label="PHI-enabled"
                  checked={phiEnabled}
                  onChange={(e) => {
                    setPhiEnabled(e.target.checked);
                  }}
                />
              </Form>
            </Col>

            <Col md="auto" style={{ marginLeft: -15 }}>
              <Tooltip
                title={
                  <span style={{ fontSize: 12 }}>
                    When enabled, you can search for patients by either their
                    MRN, CMO Patient ID, or DMP Patient ID. The results will
                    include an additional column with the patient's MRN.
                  </span>
                }
              >
                <InfoIcon style={{ fontSize: 18, color: "grey" }} />
              </Tooltip>
            </Col>
          </>
        }
      />

      <AlertModal
        show={alertModal.show}
        onHide={() => {
          setAlertModal({ ...alertModal, show: false });
        }}
        title={alertModal.title}
        content={alertModal.content}
      />
    </>
  );
}
