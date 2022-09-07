import * as React from "react";
import { ArrowDownward } from "@material-ui/icons";
import DataTable from "react-data-table-component";
import { Request } from "../../generated/graphql";
const sortIcon = <ArrowDownward />;

const RecentDeliveriesColumns = [
  {
    priority: 1,
    selector: (d: RequestWithDate) => d.smileRequest.igoRequestId,
    dataField: "igoRequestId",
    name: "IGO Request ID",
    sortable: true,
    filterable: true
  },
  {
    priority: 2,
    selector: (d: RequestWithDate) => d.smileRequest.igoProjectId,
    dataField: "igoProjectId",
    name: "IGO Project ID",
    sortable: true,
    filterable: true
  },
  {
    priority: 3,
    selector: (d: RequestWithDate) => d.totalSamples,
    dataField: "totalSamples",
    name: "# Samples",
    sortable: true,
    filterable: true
  },
  {
    priority: 4,
    selector: (d: RequestWithDate) => d.firstDelivered,
    dataField: "firstDelivered",
    name: "First Delivery to SMILE",
    sortable: true,
    filterable: true
  },
  {
    priority: 5,
    selector: (d: RequestWithDate) => d.lastDateUpdated,
    dataField: "lastDateUpdated",
    name: "Last Update",
    sortable: true,
    filterable: true
  },
  {
    priority: 6,
    selector: (d: RequestWithDate) => d.smileRequest.investigatorName,
    dataField: "investigatorName",
    name: "Investigator Name",
    sortable: true,
    filterable: true
  },
  {
    priority: 7,
    selector: (d: RequestWithDate) => d.smileRequest.investigatorEmail,
    dataField: "investigatorEmail",
    name: "Investigator Email",
    sortable: true,
    filterable: true
  },
  {
    priority: 8,
    selector: (d: RequestWithDate) => d.smileRequest.dataAnalystName,
    dataField: "dataAnalystName",
    name: "Data Analyst Name",
    sortable: true,
    filterable: true
  },
  {
    priority: 9,
    selector: (d: RequestWithDate) => d.smileRequest.dataAnalystEmail,
    dataField: "dataAnalystEmail",
    name: "Data Analyst Email",
    sortable: true,
    filterable: true
  },
  {
    priority: 10,
    selector: (d: RequestWithDate) => d.smileRequest.genePanel,
    dataField: "genePanel",
    name: "Gene Panel",
    sortable: true,
    filterable: true
  },
  {
    priority: 11,
    selector: (d: RequestWithDate) => d.smileRequest.projectManagerName,
    dataField: "projectManagerName",
    name: "Project Manager Name",
    sortable: true,
    filterable: true
  }
];

type RecentDeliveriesTableProps = {
  data: RequestWithDate[];
};

const RecentDeliveriesTable: React.FunctionComponent<RecentDeliveriesTableProps> = props => {
  return (
    // <div>Recent deliveries</div>
    <DataTable
      striped
      responsive
      sortIcon={sortIcon}
      columns={RecentDeliveriesColumns}
      data={props.data}
    />
  );
};

export default RecentDeliveriesTable;

function resolveAndSortDeliveryDates(request: Request) {
  var smDataList: string[] = [];
  for (var i = 0; i < request.hasSampleSamples.length; i++) {
    var s = request.hasSampleSamples[i];
    for (var j = 0; j < s.hasMetadataSampleMetadata.length; j++) {
      var sm = s.hasMetadataSampleMetadata[j];
      smDataList.push(sm.importDate);
    }
  }
  smDataList.sort();
  return [smDataList[0], smDataList[smDataList.length - 1]];
}

export class RequestWithDate {
  smileRequest: Request;
  totalSamples: number;
  firstDelivered: string;
  lastDateUpdated: string;
  constructor(smileRequest: Request) {
    this.smileRequest = smileRequest;
    this.totalSamples = smileRequest.hasSampleSamples.length;
    let deliveryDates = resolveAndSortDeliveryDates(smileRequest);
    this.firstDelivered = deliveryDates[0];
    this.lastDateUpdated = deliveryDates[1];
  }
}
