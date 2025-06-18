import { chain } from "lodash";

export function parseUserSearchVal(userSearchVal: string): string[] {
  return (
    chain(userSearchVal)
      // Split on space and comma delimiters, but ignore them inside single/double quotes. Breakdown:
      // [\s,]+ matches >= 1 whitespace/comma characters
      // (?=...) is a positive lookahead, "match the previous pattern only if it's followed by ..."
      // (?:...) is a non-capturing group that groups the pattern inside it without capturing it
      // [^'"] matches any non-quote character
      // '[^']*' and "[^"]*" match single and double quoted strings, respectively
      // *$ asserts that the lookahead pattern occurs >= 0 times until the end of the string
      .split(/[\s,]+(?=(?:[^'"]|'[^']*'|"[^"]*")*$)/)
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
      .value()
  );
}
