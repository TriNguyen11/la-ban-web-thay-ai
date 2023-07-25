

var _bgLoading;
var _overlayLoading;

function initBgLoading(bgLoading) {
  _bgLoading = bgLoading;
}

function bgLoading(bool){
  _bgLoading(bool)
}

function initOverlayLoading(overlayLoading) {
  _overlayLoading = overlayLoading;
}

function overlayLoading(bool){
  _overlayLoading(bool)
}

export default {
  initBgLoading,
  bgLoading,
  initOverlayLoading,
  overlayLoading,
};
