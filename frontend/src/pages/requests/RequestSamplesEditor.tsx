import React, { Dispatch, FunctionComponent, SetStateAction } from "react";
import {
  SortDirection,
  useRequestWithSamplesQuery,
} from "../../generated/graphql";
import { RequestSamples } from "./RequestSamples";
import Spinner from "react-spinkit";

export const RequestSamplesEditor: FunctionComponent<{
  igoRequestId: string;
  height: number;
  setUnsavedChanges: Dispatch<SetStateAction<boolean>>;
}> = ({ igoRequestId, height, setUnsavedChanges }) => {
  const { loading, error, data, refetch } = useRequestWithSamplesQuery({
    variables: {
      where: {
        igoRequestId: igoRequestId,
      },
      options: {
        offset: 0,
        limit: undefined,
      },
      hasMetadataSampleMetadataOptions2: {
        sort: [{ importDate: SortDirection.Desc }],
        limit: 1,
      },
    },
    //fetchPolicy: "cache-only",
  });

  if (loading) {
    return (
      <div className={"centralSpinner"}>
        <Spinner fadeIn={"none"} color={"lightblue"} name="ball-grid-pulse" />
      </div>
    );
  } else if (data) {
    const sampleIds = data.requests[0].hasSampleSamples.map(
      (s) => s.smileSampleId
    );
    return (
      <RequestSamples
        height={height * 4 - 50}
        sampleIds={sampleIds}
        setUnsavedChanges={setUnsavedChanges}
        exportFileName={`request_${igoRequestId}.tsv`}
      />
    );
  } else {
    return null;
  }
};
