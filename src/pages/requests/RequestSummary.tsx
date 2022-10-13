import { useRequestWithSamplesQuery } from "../../generated/graphql";
import { AutoSizer, Column, InfiniteLoader, Table } from "react-virtualized";
import { Button, Col, Row } from "react-bootstrap";
import { observer } from "mobx-react";
import "react-virtualized/styles.css";
import _ from "lodash";
import { useState } from "react";
import { DownloadModal } from "../../components/DownloadModal";
import { CSVFormulate } from "../../lib/CSVExport";

const RequestSummary = observer(({ props }) => {
  const { loading, error, data, fetchMore } = useRequestWithSamplesQuery({
    variables: {
      where: {
        igoRequestId: props.requestId
      },
      options: {
        offset: 0,
        limit: undefined
      }
    }
  });

  const [showDownloadModal, setShowDownloadModal] = useState(false);

  if (loading) return <Row />;
  if (error) return <Row>Error loading request details / request samples</Row>;

  const request = data!.requests[0];
  const samples = request.hasSampleSamples;
  const metadataList = samples.map(item => item.hasMetadataSampleMetadata[0]);

  console.log(metadataList);

  function rowGetter({ index }) {
    return request.hasSampleSamples[index].hasMetadataSampleMetadata[0];
  }

  const sampleTable = (
    <AutoSizer>
      {({ width }) => (
        <Table
          className="table"
          width={width}
          height={450}
          headerHeight={50}
          rowHeight={40}
          rowCount={request.hasSampleSamples.length}
          rowGetter={rowGetter}
        >
          {SampleDetailsColumns.map(col => {
            return (
              <Column
                label={col.label}
                dataKey={`${col.dataKey}`}
                width={width / SampleDetailsColumns.length}
              />
            );
          })}
        </Table>
      )}
    </AutoSizer>
  );

  const stringFields: any[] = [];

  function loadAllRows(fetchMore: any, filter: string) {
    return () => {
      return fetchMore({
        variables: {
          where: {},
          options: {
            offset: 0,
            limit: undefined
          }
        }
      });
    };
  }

  _.forEach(request, (val, key) => {
    if (typeof val === "string") {
      stringFields.push(
        <tr>
          <td>{key}</td>
          <td>{val}</td>
        </tr>
      );
    }
  });

  return (
    <>
      {showDownloadModal && (
        <DownloadModal
          loader={() => {
            return loadAllRows(fetchMore, "")().then(({ data }) => {
              return CSVFormulate(metadataList, SampleDetailsColumns);
            });
          }}
          onComplete={() => {
            setShowDownloadModal(false);
          }}
        />
      )}

      <Col className={"text-end"}>
        <Button
          onClick={() => {
            setShowDownloadModal(true);
          }}
        >
          Generate Sample Report
        </Button>
      </Col>

      <div style={{ height: 540 }}>{sampleTable}</div>
    </>
  );
});

export { RequestSummary };

const SampleDetailsColumns = [
  {
    dataKey: "cmoSampleName",
    label: "CMO Sample Label"
  },
  {
    dataKey: "investigatorSampleId",
    label: "Investigator Sample ID"
  },
  {
    dataKey: "cmoPatientId",
    label: "CMO Patient ID"
  },
  {
    dataKey: "primaryId",
    label: "Primary ID"
  },
  {
    dataKey: "cmoSampleName",
    label: "CMO Sample Name"
  },
  {
    dataKey: "preservation",
    label: "Preservation"
  },
  {
    dataKey: "tumorOrNormal",
    label: "Tumor Or Normal"
  },
  {
    dataKey: "sampleClass",
    label: "Sample Class"
  },
  {
    dataKey: "oncotreeCode",
    label: "Oncotree Code"
  },
  {
    dataKey: "collectionYear",
    label: "Collection Year"
  },
  {
    dataKey: "sampleOrigin",
    label: "Sample Origin"
  },
  {
    dataKey: "tissueLocation",
    label: "Tissue Location"
  },
  {
    dataKey: "sex",
    label: "Sex"
  }
];
