import * as actionType from './actionTypes';
import axios from 'axios';

// Loading
export const loading = (loading) => {
    return {
        type: actionType.LOADING,
        loading: loading
    }
}

export const registerAction = (register, errors) => {
    return {
        type: actionType.REGISTER,
        register: register,
        errors: errors
    }
}

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
                confirm_password: confirm_password 
            },
        };

        axios(options)
        .then((response) => {
            dispatch(loading(false));
            if (response.data.errors) {
                console.log(response.data.errors)
                dispatch(registerAction(response.data, response.data.errors));
            } else {
                dispatch(registerAction(response.data));
            }
            console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
          dispatch(loading(false));
        });
    }
}

// Login
export const loginAction = (login, errors) => {
    return {
        type: actionType.LOGIN,
        login: login,
        errors: errors
    }
}

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
          console.log(response);
          const token = response.data.access_token;
          if (token && token != null) {
            localStorage.setItem("token", response.data.access_token);
          }

          if (response.data.errors) {
            console.log(response.data.errors)
            dispatch(loginAction(response.data, response.data.errors));
          } else {
            dispatch(loginAction(response.data));
          }
            
          console.log(response);
        //   dispatch(loginAction(response, response.errors));
          dispatch(loading(false));
        })
        .catch((error) => {
          console.log(error);
          dispatch(loading(false));
        });

    }
}

export const meAction = (me) => {
    return {
        type: actionType.ME,
        me: me,
    }
}

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
                console.log(data);
                dispatch(meAction(data));
                dispatch(loading(false));
            })
            .catch((err) => {
                console.log(err);
                dispatch(loading(false));
            });
    }
}


// Login
// export const fetchLogin = (data, errors) => {
//     return {
//       type: actionTypes.LOGIN,
//       payload: data,
//       errors: errors,
//     };
//   };
  
//   export const login = (number, password) => {
//     return (dispatch) => {
//       dispatch(loader(true));
//       const options = {
//         url: window.baseURL + "/login",
//         method: "POST",
//         data: {
//           number_phone: number,
//           password: password,
//         },
//       };
//       axios(options)
//         .then((response) => {
//           console.log(response);
//           const token = response.data.access_token;
//           const res = response.data;
//           if (token && token != null) {
//             localStorage.setItem("token", response.data.access_token);
//           }
//           dispatch(fetchLogin(res, res.errors));
//           dispatch(loader(false));
//         })
//         .catch((error) => {
//           console.log(error);
//           dispatch(loader(false));
//         });
//     };
//   };
  
//   export const fetchRegister = (data, errors, success) => {
//     return {
//       type: actionTypes.REGISTER,
//       payload: data,
//       errors: errors,
//       success: success,
//     };
//   };
  
//   export const register = (name, number, password, confirmPassword) => {
//     return (dispatch) => {
//       dispatch(loader(true));
//       const options = {
//         url: window.baseURL + "/register",
//         method: "POST",
//         data: {
//           name: name,
//           number_phone: number,
//           password: password,
//           confirm_password: confirmPassword,
//         },
//       };
//       axios(options)
//         .then((response) => {
//           console.log(response);
//           const res = response.data;
//           dispatch(fetchRegister(res, res.errors, res.success));
//           dispatch(loader(false));
//         })
//         .catch((error) => {
//           console.log(error);
//           dispatch(loader(false));
//         });
//     };
//   };