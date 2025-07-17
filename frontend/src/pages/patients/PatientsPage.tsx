import {
  AgGridSortDirection,
  useDashboardPatientsLazyQuery,
} from "../../generated/graphql";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Form } from "react-bootstrap";
import { AlertModal } from "../../components/AlertModal";
import { Tooltip } from "@material-ui/core";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import {
  MAX_ROWS_EXPORT,
  MAX_ROWS_EXPORT_WARNING,
  patientColDefs,
  sampleColDefs,
} from "../../shared/helpers";
import { getUserEmail } from "../../utils/getUserEmail";
import { openLoginPopup } from "../../utils/openLoginPopup";
import RecordsList from "../../components/RecordsList";

const PHI_WARNING = {
  title: "Warning",
  content:
    "The information contained in this transmission from Memorial Sloan-Kettering Cancer Center is privileged, confidential and protected health information (PHI) and it is protected from disclosure under applicable law, including the Health Insurance Portability and Accountability Act of 1996, as amended (HIPAA). This transmission is intended for the sole use of approved individuals with permission and training to access this information and PHI. You are notified that your access to this transmission is logged. If you have received this transmission in error, please immediately delete this information and any attachments from any computer.",
};

const PHI_FIELDS = new Set(["mrn", "anchorSequencingDate"]);

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

  const activePatientsListColumns = useMemo(() => {
    return patientColDefs.map((column) => {
      if (column.field && PHI_FIELDS.has(column.field) && phiEnabled) {
        return { ...column, hide: false };
      }
      return column;
    });
  }, [phiEnabled]);

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
        columnDefs={activePatientsListColumns}
        dataName={dataName}
        defaultSort={defaultSort}
        useRecordsLazyQuery={useDashboardPatientsLazyQuery}
        phiEnabled={phiEnabled}
        userSearchVal={userSearchVal}
        setUserSearchVal={setUserSearchVal}
        showDownloadModal={showDownloadModal}
        setShowDownloadModal={setShowDownloadModal}
        handleDownload={(recordCount: number) => {
          if (recordCount && recordCount > MAX_ROWS_EXPORT) {
            setAlertModal({ show: true, ...MAX_ROWS_EXPORT_WARNING });
          } else {
            if (phiEnabled) setAlertModal({ show: true, ...PHI_WARNING });
            setShowDownloadModal(true);
          }
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
                    setPhiEnabled(e.target.checked);
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
