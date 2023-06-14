let pageStyle;
const pageRules = {};

const pageHasRules = () => !!Object.keys(pageRules).length;

const addCustomCssStylesheet = async () => {
  pageStyle = document.createElement('style');
  document.head.appendChild(pageStyle);
};

export const cleanPageRules = () => pageStyle.innerHTML = `@page {}`;

const writePageRules = async () => {
  if (!pageStyle) await addCustomCssStylesheet();
  if (!pageHasRules) {
    cleanPageRules();
    return;
  }
  let styleTxt = '@media print { @page {';
  Object.keys(pageRules).forEach(ruleName => {
    const ruleTxt = pageRules[ruleName];
    styleTxt += `${ruleName}: ${ruleTxt} !important; `;
  });
  styleTxt += '} } ';
  pageStyle.innerHTML = styleTxt;
};

const addPageRule = ({ruleName, ruleValue}) => pageRules[ruleName] = ruleValue;

const asyncAddPageRule = async rule => {
  addPageRule(rule);
  await writePageRules();
};

const addPageRules = async rules => {
  rules.forEach(rule => addPageRule(rule));
  await writePageRules();
};

const delPageRule = ruleName => pageRules[ruleName] = null;

const asyncDelPageRule = async ruleName => {
  delPageRule(ruleName);
  await writePageRules();
};

const delPageRules = async ruleNames => {
  ruleNames.forEach(ruleName => delPageRule(ruleName));
  pageHasRules ? await writePageRules() : cleanPageRules();
};

export const setPageRules = {
  add: asyncAddPageRule,
  adds: addPageRules,
  del: asyncDelPageRule,
  dels: delPageRules,
  clean: cleanPageRules
};