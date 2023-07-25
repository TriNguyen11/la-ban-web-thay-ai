

var _state; // eslint-disable-line
var _dispatch;

function getBearerToken(){
  return localStorage.getItem('accessToken')
}

function initState(state) {
  _state = state;
}

function initDispatch(dispatch) {
  _dispatch = dispatch;
}

function getState() {
  return _state;
}

function dispatch(data) {
  _dispatch(data)
}

export default {
  initState,
  initDispatch,
  getState,
  dispatch,
  getBearerToken
};
