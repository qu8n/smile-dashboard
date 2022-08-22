import React from "react";
import {useParams} from "react-router-dom";
import {
    Request,
    RequestWhere,
    RequestSummaryQueryDocument,
    Sample,
    SampleMetadata
} from "../../generated/graphql";
import {useQuery} from "@apollo/client";
import {InfiniteLoader, List} from "react-virtualized";

import {observable} from "mobx"
import {observer} from "mobx-react-lite";

function createStore() {
    return observable({
        filter: ""
    })
};

const store = createStore();


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



function loadMoreRows({startIndex, stopIndex}, fetchMore: any) {

    return fetchMore({
        variables: {
            // where: {
            //     igoRequestId_CONTAINS: "00"
            // },
            options: {
                offset: startIndex,
                limit: stopIndex
            }
        }
    });

    // return new Promise<void>((resolve)=>{
    //     setTimeout(()=>{
    //
    //         for (let i=0; i<10; i++) {
    //             list.push(i);
    //         }
    //
    //         console.log("promise resolvng");
    //         return resolve();
    //     },100);
    // })
}


const RequestSummary = function() {
    let params = useParams();
    const {loading, error, data, fetchMore, client, refetch } = useQuery(RequestSummaryQueryDocument, {
        variables: {
            where: {
                igoRequestId_CONTAINS: store.filter
            },
            requestsConnectionWhere2: {
                igoRequestId_CONTAINS: store.filter
            },
            options: {
                offset: 0,
                limit: 50
            }
        }
    });

    console.log(data);

    function isRowLoaded({index}) {
        return index < data.requests.length;
    }

    function rowRenderer({key, index, style}) {

        if (!data.requests[index]) {
            if (index < remoteRowCount) {
                return <div key={key} style={style}>{index} loading</div>;
            } else {
                return null;
            }

        }

        return (
            <div
                key={key}
                style={style}
            >
                {index} - {data.requests[index].igoRequestId}
            </div>
        )
    }

    if (loading) return <p>Loading...</p>;
    //if (error) return <p>Error : (</p>;
    //var requestSamples: Sample[] = data.requests[0].hasSampleSamples;

    const remoteRowCount = data.requestsConnection.totalCount;


    function getCacheRequests() {
        const ret = client.readQuery({
            query: RequestSummaryQueryDocument
        })
        return ret || []
    }

    return (
        <div className="container-fluid w-75">

            <input
                onInput={(inp) => {
                    store.filter = inp.currentTarget.value;
                    refetch({
                        where: {
                            igoRequestId_CONTAINS: inp.currentTarget.value
                        },
                        requestsConnectionWhere2: {
                            igoRequestId_CONTAINS: inp.currentTarget.value
                        },
                        options: { limit: 20, offset: 0 }
                    })

                }}
                value={store.filter}
            ></input>

            <div>{store.filter}</div>
            <div>Results: {remoteRowCount}</div>
            <InfiniteLoader
                isRowLoaded={isRowLoaded}
                loadMoreRows={(params) => {
                    return loadMoreRows(params, fetchMore)
                }}
                rowCount={remoteRowCount}
            >
                {({onRowsRendered, registerChild}) => (
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
};

export default RequestSummary;
