import React from "react";
import { useRequestWithSamplesQuery } from "../../../generated/graphql";
import { AutoSizer, Column, InfiniteLoader, Table } from "react-virtualized";
import { Row } from "react-bootstrap";
import { observer } from "mobx-react";
import "react-virtualized/styles.css";
import _ from "lodash";

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

  if (loading) return <Row />;
  if (error) return <Row>Error loading request details / request samples</Row>;

  const request = data!.requests[0];
  const samples = request.hasSampleSamples;

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
      {/*<table className={"table table-striped"}>*/}
      {/*  <tbody>*/}
      {/*{*/}
      {/*    stringFields*/}
      {/*}*/}
      {/*  </tbody>*/}
      {/*</table>*/}

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
