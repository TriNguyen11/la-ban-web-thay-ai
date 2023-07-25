
function get(key){
  const globalState = require('@floorplan/system/globalState').default
  // console.log(globalState.getState().system)
  if (globalState.getState().system[key]!=null) {
    return globalState.getState().system[key]
  }
}

export default {
  get
};
