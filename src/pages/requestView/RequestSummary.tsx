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
import {InfiniteLoader, List} from "react-virtualized";

// function resolveLastUpdateDate(s: Sample) {
//   if (s.hasMetadataSampleMetadata.length == 1) {
//     return s.hasMetadataSampleMetadata[0];
//   }
//
//   var smDataList: string[] = [];
//   for (var j = 0; j < s.hasMetadataSampleMetadata.length; j++) {
//     var sm = s.hasMetadataSampleMetadata[j];
//     smDataList.push(sm.importDate);
//   }
//   smDataList.sort();
//   var lastUpdate = smDataList[smDataList.length - 1];
//   for (var j = 0; j < s.hasMetadataSampleMetadata.length; j++) {
//     if (s.hasMetadataSampleMetadata[j].importDate == lastUpdate) {
//       return s.hasMetadataSampleMetadata[j];
//     }
//   }
//   return s.hasMetadataSampleMetadata[s.hasMetadataSampleMetadata.length - 1];
// }

// export interface IRequestSampleProps {
//   key?: string;
//   sample: Sample;
// }
//
// export class RequestSampleTableRecord extends React.Component<
//   IRequestSampleProps,
//   {}
// > {
//   latestSampleMetadata: SampleMetadata;
//   constructor(props: IRequestSampleProps) {
//     super(props);
//     this.latestSampleMetadata = resolveLastUpdateDate(props.sample);
//   }
//
//   public render() {
//     return (
//       <tr key={this.props.sample.smileSampleId}>
//         <td className="text-left text-nowrap">
//           {this.latestSampleMetadata.cmoSampleName}
//         </td>
//         <td className="text-left text-nowrap">
//           {this.latestSampleMetadata.investigatorSampleId}
//         </td>
//         <td className="text-left text-nowrap">
//           {this.latestSampleMetadata.cmoPatientId}
//         </td>
//         <td className="text-left text-nowrap">
//           {this.latestSampleMetadata.primaryId}
//         </td>
//         <td className="text-left text-nowrap">
//           {this.latestSampleMetadata.sampleName}
//         </td>
//         <td className="text-left text-nowrap">
//           {this.latestSampleMetadata.preservation}
//         </td>
//         <td className="text-left text-nowrap">
//           {this.latestSampleMetadata.tumorOrNormal}
//         </td>
//         <td className="text-left text-nowrap">
//           {this.latestSampleMetadata.sampleClass}
//         </td>
//         <td className="text-left text-nowrap">
//           {this.latestSampleMetadata.oncotreeCode}
//         </td>
//         <td className="text-left text-nowrap">
//           {this.latestSampleMetadata.collectionYear}
//         </td>
//         <td className="text-left text-nowrap">
//           {this.latestSampleMetadata.sampleOrigin}
//         </td>
//         <td className="text-left text-nowrap">
//           {this.latestSampleMetadata.tissueLocation}
//         </td>
//         <td className="text-left text-nowrap">
//           {this.latestSampleMetadata.sex}
//         </td>
//       </tr>
//     );
//   }
// }


const remoteRowCount = 1000;

const list: any[] = [];

for (let i=0; i<200; i++) {
    list.push(i);
}

console.log("list", list)

function isRowLoaded ({ index }) {
    console.log("isRowLoaded", index);
    const ret = !!list[index];
    console.log(ret);
    return ret;
}

function loadMoreRows ({ startIndex, stopIndex }) {
    return new Promise<void>((resolve)=>{
        console.log("promise firing");
        setTimeout(()=>{

            for (let i=0; i<10; i++) {
                list.push(i);
            }

            console.log("promise resolvng");
            return resolve();
        },100);
    })
}

function rowRenderer ({ key, index, style}) {
    return (
        <div
            key={key}
            style={style}
        >
            {list[index]}
        </div>
    )
}

function RequestSummary() {
  let params = useParams();
  //console.log(params.igoRequestId);
  const { loading, error, data, fetchMore } = useQuery(RequestSummaryQueryDocument, {
        variables: {
            where: {
                igoRequestId_CONTAINS: "00"
            },
            offset:0,
            limit:10
        }
  });
  if (loading) return <p>Loading...</p>;
  //if (error) return <p>Error : (</p>;
  //var requestSamples: Sample[] = data.requests[0].hasSampleSamples;
  console.log(data);
  return (
    <div className="container-fluid w-75">

        <InfiniteLoader
            isRowLoaded={isRowLoaded}
            loadMoreRows={(params)=>{
                console.log(params);
                return loadMoreRows(params)
            }}
            rowCount={1000}
        >
            {({ onRowsRendered, registerChild }) => (
                <List

                    height={200}
                    onRowsRendered={onRowsRendered}
                    ref={registerChild}
                    rowCount={remoteRowCount}
                    rowHeight={20}
                    rowRenderer={rowRenderer}
                    width={300}
                />
            )}
        </InfiniteLoader>


      {/*<div className="table-responsive">*/}
      {/*  <h1 className="h2">*/}
      {/*    Request summary page: {params.igoRequestId} (# samples ={" "}*/}
      {/*    {data.requests[0].hasSampleSamples.length})*/}
      {/*  </h1>*/}
      {/*  <br />*/}
      {/*  <table className="table table-striped table-fit">*/}
      {/*    <thead>*/}
      {/*      <tr>*/}
      {/*        <th scope="col">CMO Sample Name</th>*/}
      {/*        <th scope="col">Investigator Sample ID</th>*/}
      {/*        <th scope="col">CMO Patient ID</th>*/}
      {/*        <th scope="col">Primary ID (IGO ID)</th>*/}
      {/*        <th scope="col">Sample Name</th>*/}
      {/*        <th scope="col">Preservation</th>*/}
      {/*        <th scope="col">Tumor or Normal</th>*/}
      {/*        <th scope="col">Sample Class</th>*/}
      {/*        <th scope="col">Oncotree Code</th>*/}
      {/*        <th scope="col">Collection Year</th>*/}
      {/*        <th scope="col">Sample Origin</th>*/}
      {/*        <th scope="col">Tissue Location</th>*/}
      {/*        <th scope="col">Sex</th>*/}
      {/*      </tr>*/}
      {/*    </thead>*/}
      {/*    <tbody>*/}
      {/*      {requestSamples.map((s: Sample) => (*/}
      {/*        <RequestSampleTableRecord key={s.smileSampleId} sample={s} />*/}
      {/*      ))}*/}
      {/*    </tbody>*/}
      {/*  </table>*/}
      {/*</div>*/}
    </div>
  );
}

export default RequestSummary;
