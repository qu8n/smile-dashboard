import { chain } from "lodash";

export function parseUserSearchVal(userSearchVal: string): string[] {
  return chain(userSearchVal)
    .split(/[\s,]+/) // split on whitespaces and commas
    .compact()
    .uniq()
    .map((val) => {
      val = val.trim();
      // Add back leading 0s to queries that were copied from Excel, where leading 0s
      // of number cells are removed by default (e.g. `01234` becomes `1234`).
      const isNumber = /^\d*$/.test(val);
      if (isNumber) {
        return val.padStart(5, "0");
      }
      return val;
    })
    .value();
}
