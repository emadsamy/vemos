import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { GetJwt } from "../../helpers/index";
import axios from "axios";
import { Helmet } from "react-helmet";

const Logout = () => {
  let redirect = "";
  const navigate = useNavigate();

  const logoutHandler = () => {
    const token = localStorage.getItem("token");
    const options = {
      url: window.baseURL + "/logout",
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
    };
    axios(options)
      .then((response) => {
        localStorage.removeItem("token");
        navigate("/login");
      })
      .catch((error) => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  };

  useEffect(() => {
    logoutHandler();
  }, []);

  // localStorage.removeItem("token");
  // if (!GetJwt()) {
  //   redirect = <Redirect to="/login" />;
  // }

  return redirect;
};

export { Logout };
