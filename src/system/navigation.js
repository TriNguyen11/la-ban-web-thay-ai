

var _function; // eslint-disable-line

function setFunction(func) {
  _function = func;
}

function navigate(route,params) {
  return _function(route,params)
}

export default {
  setFunction,
  navigate
};
