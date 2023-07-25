let _translateFunction; // eslint-disable-line
let _i18n;

function setTranslationFunction(func) {
  _translateFunction = func;
}

function setI18n(i18n) {
  _i18n = i18n;
}

function t(text) {
  return _translateFunction(text)
}

function getLanguages(){
  return _i18n.languages
}

function changeLanguage(lang){
  _i18n.changeLanguage(lang);
}

function getLanguage() {
  return _i18n.language
}

export default {
  setTranslationFunction,
  setI18n,
  getLanguage,
  t,
  changeLanguage
};
