export function CSVFormulate(requests, columnDefinitions) {
  const csvString = [
    columnDefinitions.map(item => item.label).join("\t"),
    ...requests
      .map(req => columnDefinitions.map(col => req[col.dataKey!]))
      .map(e => e.join("\t"))
  ].join("\n");

  console.log(csvString);

  return csvString;
}
