const Types = [
  'primary','secondary','success',
  'danger', 'warning', 'info',
  'light', 'dark'
];
var _setType;
var _setMessageTitle;
var _setMessage;
var _showNotify;


function initShowMessageType(setType) {
  _setType = setType;
}

function initShowMessageTitle(setMessageTitle) {
  _setMessageTitle = setMessageTitle;
}

function initShowMessage(setMessage) {
  _setMessage = setMessage;
}

function initShowNotify(showNotify) {
  _showNotify = showNotify;
}

function notify(data) {
  let type = Types.includes(data.type) ? data.type : 'danger';
  _setType(type)
  _setMessageTitle(data.title)
  _setMessage(data.message)
  _showNotify(true)
}

export default {
  initShowMessageType,
  initShowMessageTitle,
  initShowMessage,
  initShowNotify,
  notify
};
