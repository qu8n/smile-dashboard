import React from "react";
import { useParams } from "react-router-dom";
import {
  Request,
  RequestWhere,
  RequestSummaryQueryDocument,
  Sample,
  SampleMetadata
} from "../../generated/graphql";
import { useQuery } from "@apollo/client";

function resolveLastUpdateDate(s: Sample) {
  if (s.hasMetadataSampleMetadata.length == 1) {
    return s.hasMetadataSampleMetadata[0];
  }

  var smDataList: string[] = [];
  for (var j = 0; j < s.hasMetadataSampleMetadata.length; j++) {
    var sm = s.hasMetadataSampleMetadata[j];
    smDataList.push(sm.importDate);
  }
  smDataList.sort();
  var lastUpdate = smDataList[smDataList.length - 1];
  for (var j = 0; j < s.hasMetadataSampleMetadata.length; j++) {
    if (s.hasMetadataSampleMetadata[j].importDate == lastUpdate) {
      return s.hasMetadataSampleMetadata[j];
    }
  }
  return s.hasMetadataSampleMetadata[s.hasMetadataSampleMetadata.length - 1];
}

export interface IRequestSampleProps {
  key?: string;
  sample: Sample;
}

export class RequestSampleTableRecord extends React.Component<
  IRequestSampleProps,
  {}
> {
  latestSampleMetadata: SampleMetadata;
  constructor(props: IRequestSampleProps) {
    super(props);
    this.latestSampleMetadata = resolveLastUpdateDate(props.sample);
  }

  public render() {
    return (
      <tr key={this.props.sample.smileSampleId}>
        <td className="text-left text-nowrap">
          {this.latestSampleMetadata.cmoSampleName}
        </td>
        <td className="text-left text-nowrap">
          {this.latestSampleMetadata.investigatorSampleId}
        </td>
        <td className="text-left text-nowrap">
          {this.latestSampleMetadata.cmoPatientId}
        </td>
        <td className="text-left text-nowrap">
          {this.latestSampleMetadata.primaryId}
        </td>
        <td className="text-left text-nowrap">
          {this.latestSampleMetadata.sampleName}
        </td>
        <td className="text-left text-nowrap">
          {this.latestSampleMetadata.preservation}
        </td>
        <td className="text-left text-nowrap">
          {this.latestSampleMetadata.tumorOrNormal}
        </td>
        <td className="text-left text-nowrap">
          {this.latestSampleMetadata.sampleClass}
        </td>
        <td className="text-left text-nowrap">
          {this.latestSampleMetadata.oncotreeCode}
        </td>
        <td className="text-left text-nowrap">
          {this.latestSampleMetadata.collectionYear}
        </td>
        <td className="text-left text-nowrap">
          {this.latestSampleMetadata.sampleOrigin}
        </td>
        <td className="text-left text-nowrap">
          {this.latestSampleMetadata.tissueLocation}
        </td>
        <td className="text-left text-nowrap">
          {this.latestSampleMetadata.sex}
        </td>
      </tr>
    );
  }
}

function RequestSummary() {
  let params = useParams();
  console.log("igoRequestId");
  console.log(params.igoRequestId);
  const { loading, error, data } = useQuery(RequestSummaryQueryDocument, {
    variables: {
      where: {
        igoRequestId: params.igoRequestId
      }
    }
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : (</p>;
  var requestSamples: Sample[] = data.requests[0].hasSampleSamples;
  console.log(data);
  return (
    <div className="container-fluid w-75">
      <div className="table-responsive">
        <h1 className="h2">
          Request summary page: {params.igoRequestId} (# samples ={" "}
          {data.requests[0].hasSampleSamples.length})
        </h1>
        <br />
        <table className="table table-striped table-fit">
          <thead>
            <tr>
              <th scope="col">CMO Sample Name</th>
              <th scope="col">Investigator Sample ID</th>
              <th scope="col">CMO Patient ID</th>
              <th scope="col">Primary ID (IGO ID)</th>
              <th scope="col">Sample Name</th>
              <th scope="col">Preservation</th>
              <th scope="col">Tumor or Normal</th>
              <th scope="col">Sample Class</th>
              <th scope="col">Oncotree Code</th>
              <th scope="col">Collection Year</th>
              <th scope="col">Sample Origin</th>
              <th scope="col">Tissue Location</th>
              <th scope="col">Sex</th>
            </tr>
          </thead>
          <tbody>
            {requestSamples.map((s: Sample) => (
              <RequestSampleTableRecord key={s.smileSampleId} sample={s} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RequestSummary;
