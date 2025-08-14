export function createCustomHeader(icons: string) {
  return {
    template: `
    <div class="ag-cell-label-container" role="presentation">
      <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button" aria-hidden="true"></span>
      ${icons}
      <div ref="eLabel" class="ag-header-cell-label" role="presentation">
        <span ref="eText" class="ag-header-cell-text"></span>
        <span ref="eFilter" class="ag-header-icon ag-header-label-icon ag-filter-icon" aria-hidden="true"></span>
        <span ref="eSortOrder" class="ag-header-icon ag-header-label-icon ag-sort-order" aria-hidden="true"></span>
        <span ref="eSortAsc" class="ag-header-icon ag-header-label-icon ag-sort-ascending-icon" aria-hidden="true"></span>
        <span ref="eSortDesc" class="ag-header-icon ag-header-label-icon ag-sort-descending-icon" aria-hidden="true"></span>
        <span ref="eSortNone" class="ag-header-icon ag-header-label-icon ag-sort-none-icon" aria-hidden="true"></span>
      </div>
    </div>
    `,
  };
}

export const lockIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" fill="none" viewBox="0 -4 30 30" stroke="gray" ' +
  'stroke-width="2"> <path stroke-linecap="round" stroke-linejoin="round" ' +
  'd="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>';

export const toolTipIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" viewBox="0 -1 25 25"> <path fill="#9c9c9c" ' +
  'd="M11 17h2v-6h-2zm1-8q.425 0 .713-.288T13 8t-.288-.712T12 7t-.712.288T11 8t.288.713T12 9m0 13q-2.075 ' +
  "0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 " +
  "8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 " +
  '6.325T4 12t2.325 5.675T12 20m0-8" /></svg>';

export function LoadingIcon() {
  return (
    <div className="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}
