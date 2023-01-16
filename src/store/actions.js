import * as actionType from "./actionTypes";
import axios from "axios";

// Loading
export const loading = (loading) => {
  return {
    type: actionType.LOADING,
    loading: loading,
  };
};

export const registerAction = (registerData, authErrors) => {
  return {
    type: actionType.REGISTER,
    registerData: registerData,
    authErrors: authErrors,
  };
};

export const register = (name, email, password, confirm_password) => {
  return (dispatch) => {
    dispatch(loading(true));
    const options = {
      url: window.baseURL + "/register",
      method: "POST",
      data: {
        name: name,
        email: email,
        password: password,
        confirm_password: confirm_password,
      },
    };

    axios(options)
      .then((response) => {
        dispatch(loading(false));
        if (response.data.errors) {
          dispatch(registerAction(response.data, response.data.errors));
        } else {
          dispatch(registerAction(response.data));
        }
      })
      .catch((error) => {
        dispatch(loading(false));
      });
  };
};

// Login
export const loginAction = (login, authErrors) => {
  return {
    type: actionType.LOGIN,
    login: login,
    authErrors: authErrors,
  };
};

export const login = (email, password) => {
  return (dispatch) => {
    dispatch(loading(true));
    const options = {
      url: window.baseURL + "/login",
      method: "POST",
      data: {
        email: email,
        password: password,
      },
    };

    axios(options)
      .then((response) => {
        const token = response.data.access_token;
        if (token && token != null) {
          localStorage.setItem("token", response.data.access_token);
        }

        if (response.data.errors) {
          dispatch(loginAction(response.data, response.data.errors));
        } else {
          dispatch(loginAction(response.data));
        }

        //   dispatch(loginAction(response, response.errors));
        dispatch(loading(false));
      })
      .catch((error) => {
        dispatch(loading(false));
      });
  };
};

export const meAction = (me) => {
  return {
    type: actionType.ME,
    me: me,
  };
};

export const me = () => {
  return (dispatch) => {
    dispatch(loading(true));
    const token = localStorage.getItem("token");
    const options = {
      url: window.baseURL + "/me",
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
    };
    axios(options)
      .then((res) => {
        const data = res.data.data;
        dispatch(meAction(data));
        dispatch(loading(false));
      })
      .catch((err) => {
        dispatch(loading(false));
      });
  };
};
