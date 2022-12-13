import {
  useRequestWithSamplesQuery,
  SortDirection,
  RequestWithSamplesQuery
} from "../../generated/graphql";
import AutoSizer from "react-virtualized-auto-sizer";
import { Button, Col, Form, Row } from "react-bootstrap";
import _, { sample } from "lodash";
import classNames from "classnames";
import { FunctionComponent } from "react";
import { DownloadModal } from "../../components/DownloadModal";
import { CSVFormulate } from "../../lib/CSVExport";
import { SampleDetailsColumns } from "./helpers";
import { Params } from "react-router-dom";
import Spinner from "react-spinkit";
import { AgGridReact } from "ag-grid-react";
import { useState } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";

interface IRequestSummaryProps {
  params: Readonly<Params<string>>;
  height: number;
}

function sampleFilterWhereVariables(value: string) {
  return [
    { cmoSampleName_CONTAINS: value },
    { importDate_CONTAINS: value },
    { investigatorSampleId_CONTAINS: value },
    { primaryId_CONTAINS: value },
    { sampleClass_CONTAINS: value },
    { cmoPatientId_CONTAINS: value },
    { cmoSampleIdFields_CONTAINS: value },
    { sampleName_CONTAINS: value },
    { preservation_CONTAINS: value },
    { tumorOrNormal_CONTAINS: value },
    { oncotreeCode_CONTAINS: value },
    { collectionYear_CONTAINS: value },
    { sampleOrigin_CONTAINS: value },
    { tissueLocation_CONTAINS: value },
    { sex_CONTAINS: value },
    { libraries_CONTAINS: value },
    { sampleType_CONTAINS: value },
    { species_CONTAINS: value },
    { genePanel_CONTAINS: value }
  ];
}

function getSampleMetadata(data: RequestWithSamplesQuery) {
  return data!.requests[0].hasSampleSamples.map((s: any) => {
    return s.hasMetadataSampleMetadata[0];
  });
}

export const RequestSamples: FunctionComponent<IRequestSummaryProps> = ({
  params,
  height
}) => {
  const { loading, error, data, refetch } = useRequestWithSamplesQuery({
    variables: {
      where: {
        igoRequestId: params.requestId
      },
      options: {
        offset: 0,
        limit: undefined
      },
      hasMetadataSampleMetadataOptions2: {
        sort: [{ importDate: SortDirection.Desc }],
        limit: 1
      }
    },
    fetchPolicy: "no-cache"
  });

  const [val, setVal] = useState("");
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<any>(null);
  const [prom, setProm] = useState<any>(Promise.resolve());

  if (loading)
    return (
      <div className={"centralSpinner"}>
        <Spinner fadeIn={"none"} color={"lightblue"} name="ball-grid-pulse" />
      </div>
    );

  if (error) return <Row>Error loading request details / request samples</Row>;

  const remoteCount = data!.requests[0].hasSampleSamples.length;

  return (
    <>
      {showDownloadModal && (
        <DownloadModal
          loader={() => {
            return Promise.resolve(
              CSVFormulate(getSampleMetadata(data!), SampleDetailsColumns)
            );
          }}
          onComplete={() => {
            setShowDownloadModal(false);
          }}
          exportFilename={"request_" + data?.requests[0].igoRequestId + ".tsv"}
        />
      )}
      <Row
        className={classNames(
          "d-flex justify-content-between align-items-center tableControlsRow"
        )}
      >
        <Col></Col>
        <Col className={"text-end"}>
          <Form.Control
            className={"d-inline-block"}
            style={{ width: "300px" }}
            type="search"
            placeholder="Search Samples"
            aria-label="Search"
            value={val}
            onInput={event => {
              const value = event.currentTarget.value;

              if (value !== null) {
                setVal(value);
              }

              if (typingTimeout) {
                clearTimeout(typingTimeout);
              }

              prom.then(() => {
                const to = setTimeout(() => {
                  const rf = refetch({
                    hasSampleSamplesWhere2: {
                      hasMetadataSampleMetadata_SOME: {
                        OR: sampleFilterWhereVariables(value)
                      }
                    },
                    hasSampleSamplesConnectionWhere2: {
                      node: {
                        hasMetadataSampleMetadata_SOME: {
                          OR: sampleFilterWhereVariables(value)
                        }
                      }
                    }
                  });
                  setProm(rf);
                }, 500);
                setTypingTimeout(to);
              });
            }}
          />
        </Col>

        <Col className={"text-start"}>{remoteCount} matching samples</Col>

        <Col className={"text-end"}>
          <Button
            onClick={() => {
              setShowDownloadModal(true);
            }}
            size={"sm"}
          >
            Generate Sample Report
          </Button>
        </Col>
      </Row>
      <AutoSizer>
        {({ width }) => (
          <div
            className="ag-theme-alpine"
            style={{ height: height, width: width }}
          >
            <AgGridReact
              columnDefs={SampleDetailsColumns}
              rowData={getSampleMetadata(data!)}
            />
          </div>
        )}
      </AutoSizer>
    </>
  );
};
