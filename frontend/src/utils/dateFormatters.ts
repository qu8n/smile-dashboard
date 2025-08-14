import moment from "moment";

export function formatDate(date: moment.MomentInput) {
  return date ? moment(date).format("YYYY-MM-DD") : null;
}
