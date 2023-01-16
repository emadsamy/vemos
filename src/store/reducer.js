import * as actionType from "./actionTypes"; // Import all action types as name (actionTypes) or any name

const initalState = {
  login: {},
  registerData: {},
  authErrors: [],
  loading: "",
  me: {},
};

const reducer = (state = initalState, action) => {
  switch (action.type) {
    case actionType.LOADING:
      return {
        ...state,
        loading: action.loading,
      };

    case actionType.REGISTER:
      return {
        ...state,
        registerData: action.registerData,
        authErrors: action.authErrors,
      };

    case actionType.LOGIN:
      return {
        ...state,
        login: action.login,
        authErrors: action.authErrors,
      };

    case actionType.ME:
      return {
        ...state,
        me: action.me,
      };

    default:
      return state;
  }
};

export { reducer };
