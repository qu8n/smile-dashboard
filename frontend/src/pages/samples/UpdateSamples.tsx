import { gql, useMutation } from "@apollo/client";
import { FunctionComponent } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { Params, useParams } from "react-router-dom";
import {
  UpdateSamplesDocument,
  useUpdateSamplesMutation,
} from "../../generated/graphql";

// const UPDATE_SAMPLE = gql`
//   mutation UpdateSamples($smileSampleId: String) {
//     updateSamplesMutation(smileSampleId: $smileSampleId) @client
//   }
// `

export const UpdateSamples: FunctionComponent = ({}) => {
  const params = useParams();
  // const [updateSamplesMutation] = useMutation(UpdateSamplesDocument, { variables: {where: {
  //   smileSampleId: params.smileSampleId}}})
  const [updateSamplesMutation, { data, loading, error }] =
    useUpdateSamplesMutation({
      variables: {
        where: {
          smileSampleId: params.smileSampleId,
        },
      },
    });
  var sdata = undefined;

  function showTable() {
    return (
      <Table>
        <thead>
          <tr>
            <th>smile sample id</th>
            <th>is revisable</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{data?.updateSamples.samples[0]?.smileSampleId}</td>
            <td>
              {data?.updateSamples.samples[0]?.revisable ? "true" : "false"}
            </td>
          </tr>
        </tbody>
      </Table>
    );
  }

  return (
    <Container fluid>
      {params.smileSampleId}
      <Button
        onClick={() => {
          let curValue = data?.updateSamples.samples[0].revisable;
          updateSamplesMutation({
            variables: {
              update: { revisable: !curValue },
            },
          }).then((r) => {
            console.log(
              "revisable value is now ",
              r.data?.updateSamples.samples[0].revisable
            );
          });
        }}
      >
        update
      </Button>
      <br />
      {showTable()}
    </Container>
  );
};
