import {
  PatientAliasWhere,
  SampleWhere,
  useGetPatientIdsTripletsLazyQuery,
  usePatientsListLazyQuery,
} from "../../generated/graphql";
import { useEffect, useMemo, useState } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import RecordsList from "../../components/RecordsList";
import { useParams } from "react-router-dom";
import PageHeader from "../../shared/components/PageHeader";
import { Col, Form } from "react-bootstrap";
import { AlertModal } from "../../components/AlertModal";
import { Tooltip } from "@material-ui/core";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import { parseSearchQueries } from "../../lib/parseSearchQueries";
import { REACT_APP_EXPRESS_SERVER_ORIGIN } from "../../shared/constants";
import { PatientsListColumns } from "../../shared/helpers";

// This type mirrors the fields types in the CRDB. CMO_ID is stored without the "C-" prefix
export type PatientIdsTriplet = {
  DMP_ID: string;
  CMO_ID: string;
  PT_MRN: string;
};

function patientAliasFilterWhereVariables(
  uniqueQueries: string[]
): PatientAliasWhere[] {
  if (uniqueQueries.length > 1) {
    return [
      { value_IN: uniqueQueries },
      { namespace_IN: uniqueQueries },
      {
        isAliasPatients_SOME: {
          hasSampleSamples_SOME: {
            hasMetadataSampleMetadata_SOME: {
              cmoSampleName_IN: uniqueQueries,
            },
          },
        },
      },
      {
        isAliasPatients_SOME: {
          hasSampleSamples_SOME: {
            hasMetadataSampleMetadata_SOME: {
              primaryId_IN: uniqueQueries,
            },
          },
        },
      },
    ];
  } else {
    return [
      { value_CONTAINS: uniqueQueries[0] },
      { namespace_CONTAINS: uniqueQueries[0] },
      {
        isAliasPatients_SOME: {
          hasSampleSamples_SOME: {
            hasMetadataSampleMetadata_SOME: {
              cmoSampleName_CONTAINS: uniqueQueries[0],
            },
          },
        },
      },
      {
        isAliasPatients_SOME: {
          hasSampleSamples_SOME: {
            hasMetadataSampleMetadata_SOME: {
              primaryId_CONTAINS: uniqueQueries[0],
            },
          },
        },
      },
    ];
  }
}

function addCDashToCMOId(cmoId: string): string {
  return cmoId.length === 6 ? `C-${cmoId}` : cmoId;
}

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
  title: "No results found",
  content:
    "No results were found for your search. No patient IDs in your search exist in either the SMILE or CRDB databases.",
};

export default function PatientsPage({
  userEmail,
  setUserEmail,
}: {
  userEmail: string | null;
  setUserEmail: (userEmail: string | null) => void;
}) {
  const params = useParams();

  const [searchVal, setSearchVal] = useState<string[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const [phiEnabled, setPhiEnabled] = useState(false);
  const [patientIdsTriplets, setPatientIdsTriplets] = useState<any>([]); // using `any` temporarily instead of `PatientIdsTriplet[]`
  const [alertModal, setAlertModal] = useState<{
    show: boolean;
    title: string;
    content: string;
  }>({ show: false, title: "", content: "" });

  const [getPatientIdsTriplets, { error }] =
    useGetPatientIdsTripletsLazyQuery();

  async function fetchPatientIdsTriplets(
    patientIds: string[]
  ): Promise<string[]> {
    const response = await getPatientIdsTriplets({
      variables: {
        patientIds: patientIds,
      },
    });

    if (error) {
      if (error.message === "401") {
        const width = 800;
        const height = 800;
        const left = (window.screen.width - width) / 2;
        const top = (window.screen.height - height) / 2;

        window.open(
          `${REACT_APP_EXPRESS_SERVER_ORIGIN}/login`,
          "_blank",
          `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
        );
      }

      if (error.message === "403") {
        setAlertModal({
          show: true,
          ...UNAUTHORIZED_WARNING,
        });
      }

      return [];
    }

    const data = response.data?.patientIdsTriplets;
    const validData = data?.filter((d) => Boolean(d));

    if (validData && validData.length > 0) {
      setPatientIdsTriplets(validData);
      return validData.map((d) => addCDashToCMOId(d?.CMO_ID as string));
    } else {
      return [];
    }
  }

  const handleSearch = async () => {
    let uniqueQueries = parseSearchQueries(inputVal);
    if (phiEnabled) {
      uniqueQueries = uniqueQueries.map((query) =>
        query.startsWith("C-") ? query.slice(2) : query
      );
      const newQueries = await fetchPatientIdsTriplets(uniqueQueries);
      if (newQueries.length > 0) {
        setSearchVal(newQueries);
      } else if (userEmail) {
        setAlertModal({
          show: true,
          ...NO_PHI_SEARCH_RESULTS,
        });
        setSearchVal([]);
      }
    } else {
      setSearchVal(uniqueQueries);
    }
  };

  useEffect(() => {
    window.addEventListener("message", handleLogin);

    function handleLogin(event: any) {
      if (event.origin !== `${REACT_APP_EXPRESS_SERVER_ORIGIN}`) return;
      setUserEmail(event.data);
      setAlertModal({
        show: true,
        ...PHI_WARNING,
      });
      handleSearch();
    }

    return () => {
      window.removeEventListener("message", handleLogin);
    };
    // eslint-disable-next-line
  }, [phiEnabled]);

  let ActiveColumns = useMemo(() => {
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
          valueGetter: (params: any) => {
            const cmoId = params.data.value;
            const patientIdsTriplet = patientIdsTriplets.find(
              (triplet: any) => addCDashToCMOId(triplet.CMO_ID) === cmoId
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

  const pageRoute = "/patients";
  const sampleQueryParamFieldName = "cmoPatientId";

  return (
    <>
      <PageHeader pageTitle={"patients"} pageRoute={pageRoute} />

      <RecordsList
        lazyRecordsQuery={usePatientsListLazyQuery}
        nodeName="patientAliases"
        totalCountNodeName="patientAliasesConnection"
        pageRoute={pageRoute}
        searchTerm="patients"
        colDefs={ActiveColumns}
        conditionBuilder={patientAliasFilterWhereVariables}
        sampleQueryParamFieldName={sampleQueryParamFieldName}
        sampleQueryParamValue={params[sampleQueryParamFieldName]}
        searchVariables={
          {
            OR: [
              {
                patientsHasSampleConnection_SOME: {
                  node: {
                    patientAliasesIsAlias_SOME: {
                      value: params[sampleQueryParamFieldName],
                    },
                  },
                },
              },
            ],
          } as SampleWhere
        }
        customFilterUI={
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
        setCustomFilterVals={setPatientIdsTriplets}
        handleSearch={handleSearch}
        searchVal={searchVal}
        setSearchVal={setSearchVal}
        inputVal={inputVal}
        setInputVal={setInputVal}
        showDownloadModal={showDownloadModal}
        setShowDownloadModal={setShowDownloadModal}
        handleDownload={() => {
          setAlertModal({
            show: true,
            ...PHI_WARNING,
          });
          setShowDownloadModal(true);
        }}
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
