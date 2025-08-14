import {
  AgGridSortDirection,
  useAllAnchorSeqDateByPatientIdLazyQuery,
  useDashboardPatientsLazyQuery,
} from "../../generated/graphql";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Form } from "react-bootstrap";
import { AlertModal } from "../../components/AlertModal";
import { Tooltip } from "@material-ui/core";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import {
  allAnchorSeqDateColDefs,
  patientColDefs,
  sampleColDefs,
} from "../../shared/helpers";
import { getUserEmail } from "../../utils/getUserEmail";
import { openLoginPopup } from "../../utils/openLoginPopup";
import RecordsList from "../../components/RecordsList";
import { useUserEmail } from "../../contexts/UserEmailContext";

export const PHI_WARNING = {
  title: "Warning",
  content:
    "The information contained in this transmission from Memorial Sloan-Kettering Cancer Center is privileged," +
    " confidential and protected health information (PHI) and it is protected from disclosure under applicable law," +
    " including the Health Insurance Portability and Accountability Act of 1996, as amended (HIPAA). This" +
    " transmission is intended for the sole use of approved individuals with permission and training to access this" +
    " information and PHI. You are notified that your access to this transmission is logged. If you have received" +
    " this transmission in error, please immediately delete this information and any attachments from any computer.",
};

const PHI_FIELDS = new Set(["mrn", "anchorSequencingDate"]);

const patientColDefsWithPhiCols = patientColDefs.map((col) => {
  if (col.field && PHI_FIELDS.has(col.field)) {
    return { ...col, hide: false };
  }
  return col;
});

export default function PatientsPage() {
  const { userEmail, setUserEmail } = useUserEmail();

  const params = useParams();
  const [queryAllSeqDates] = useAllAnchorSeqDateByPatientIdLazyQuery();

  const [columnDefs, setColumnDefs] = useState(patientColDefs);
  const [userSearchVal, setUserSearchVal] = useState<string>("");
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [phiEnabled, setPhiEnabled] = useState(false);
  const [alertModal, setAlertModal] = useState<{
    show: boolean;
    title: string;
    content: string;
  }>({ show: false, title: "", content: "" });

  useEffect(() => {
    async function handleLogin(event: MessageEvent) {
      if (event.data !== "success") return;
      setUserEmail(await getUserEmail());
      setAlertModal({ show: true, ...PHI_WARNING });
    }
    if (phiEnabled) {
      window.addEventListener("message", handleLogin);
      if (!userEmail) openLoginPopup();
      return () => {
        window.removeEventListener("message", handleLogin);
      };
    }
  }, [phiEnabled, userEmail, setUserEmail]);

  const dataName = "patients";
  const sampleQueryParamFieldName = "patientId";
  const sampleQueryParamValue = params[sampleQueryParamFieldName];
  const defaultSort = {
    colId: "importDate",
    sort: AgGridSortDirection.Desc,
  };

  return (
    <>
      <RecordsList
        columnDefs={columnDefs}
        dataName={dataName}
        defaultSort={defaultSort}
        useRecordsLazyQuery={useDashboardPatientsLazyQuery}
        phiEnabled={phiEnabled}
        userSearchVal={userSearchVal}
        setUserSearchVal={setUserSearchVal}
        showDownloadModal={showDownloadModal}
        setShowDownloadModal={setShowDownloadModal}
        handleDownload={() => {
          if (phiEnabled) setAlertModal({ show: true, ...PHI_WARNING });
          setShowDownloadModal(true);
        }}
        samplesColDefs={sampleColDefs}
        sampleContexts={
          sampleQueryParamValue
            ? [
                {
                  fieldName: sampleQueryParamFieldName,
                  values: [sampleQueryParamValue],
                },
              ]
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
                    const isPhiEnabled = e.target.checked;
                    setPhiEnabled(isPhiEnabled);
                    if (isPhiEnabled) {
                      setColumnDefs(patientColDefsWithPhiCols);
                    } else {
                      setColumnDefs(patientColDefs);
                    }
                  }}
                />
              </Form>
            </Col>

            <Col md="auto" style={{ marginLeft: -15 }}>
              <Tooltip
                title={
                  <span style={{ fontSize: 12 }}>
                    Turn on this switch to return each patient's MRN and anchor
                    sequencing date in the results. Note that this mode only
                    returns the PHI matching specific MRN, CMO, or DMP Patient
                    IDs entered in the search bar. When turning on this switch
                    for the first time, you will be prompted to log in.
                  </span>
                }
              >
                <InfoIcon style={{ fontSize: 18, color: "grey" }} />
              </Tooltip>
            </Col>
          </>
        }
        addlExportDropdownItems={[
          {
            label: "Export all anchor dates for clinical cohort",
            columnDefs: allAnchorSeqDateColDefs,
            customLoader: async () => {
              const result = await queryAllSeqDates({
                variables: { phiEnabled: phiEnabled },
              });
              return result.data?.allAnchorSeqDateByPatientId;
            },
            disabled: !phiEnabled || !userEmail,
            tooltip:
              "You must enable PHI and log in to export anchor sequencing dates",
          },
        ]}
        userEmail={userEmail}
        setUserEmail={setUserEmail}
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
