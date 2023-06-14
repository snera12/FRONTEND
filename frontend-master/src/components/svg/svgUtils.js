export const escapingSVG = svg => svg
  .replaceAll('<', '%3C').replaceAll('>', '%3E').replaceAll(`"`, `'`);
export const getSVGToCSS = svg => `"data:image/svg+xml,` + escapingSVG(svg) + `"`;
export const getStringToSetSVGAsBGURL = svg => `url(` + getSVGToCSS(svg) + `) no-repeat`;