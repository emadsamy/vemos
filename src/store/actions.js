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
      .then((res) => {
        dispatch(loading(false));
        if (res.data.errors) {
          dispatch(registerAction(res.data, res.data.errors));
        } else {
          dispatch(registerAction(res.data));
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
      headers: { Accept: "application/json" },
      data: {
        email: email,
        password: password,
      },
    };

    axios(options)
      .then((res) => {
        const token = res.data.access_token;
        if (token && token != null) {
          localStorage.setItem("token", res.data.access_token);
        }

        if (res.data.errors) {
          dispatch(loginAction(res.data, res.data.errors));
        } else {
          dispatch(loginAction(res.data));
        }

        //   dispatch(loginAction(res, res.errors));
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

export const personsAction = (persons) => {
  return {
    type: actionType.PERSONS,
    persons: persons,
  };
};

export const persons = (id) => {
  return (dispatch) => {
    const token = localStorage.getItem("token");
    const options = {
      url: window.baseURL + "/get_persons/" + id,
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
    };
    axios(options)
      .then((res) => {
        if (res.data.success) {
          dispatch(personsAction(res.data.data));
        }
      })
      .catch((err) => {
        // dispatch(personsAction());
      });
  };
};

export const unfollowAction = (unfollow) => {
  return {
    type: actionType.UNFOLLOW,
    unfollow: unfollow,
  };
};

export const unfollow = (sender_id, receiver_id) => {
  return (dispatch) => {
    const token = localStorage.getItem("token");
    const options = {
      url: window.baseURL + "/unfollow",
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
      data: {
        sender_id: sender_id,
        receiver_id: receiver_id,
      },
    };
    axios(options)
      .then((res) => {
        dispatch(unfollowAction(res.data.success));
        console.log(res);
      })
      .catch((err) => {
        // dispatch(personsAction());
      });
  };
};
