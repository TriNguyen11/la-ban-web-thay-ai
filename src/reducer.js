
export const reducer = (state, action) => {
  switch (action.type) {
    case 'root':
      if (action.data != null) {
        var keys = Object.keys(action.data);
        for (var i = 0; i < keys.length; i++) {
          state[keys[i]]=action.data[keys[i]];
        }
      }
      return state;
      break;
    case 'setAuthInfo':
      state.auth_info = action.data
      return state;
      break;
    default:
      return state;
  }
  return state;
}

export const initialState = {
  system: {},
  auth_info: {},
};
