import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { GetJwt } from "../../helpers/index";
import axios from "axios";

const Logout = () => {
  let redirect = "";
  const navigate = useNavigate();

  const logoutHandler = () => {
    const token = localStorage.getItem("token");
    const options = {
      url: process.env.BASE_API_URL + "/logout",
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
    };
    axios(options)
      .then((response) => {
        console.log(response);
        localStorage.removeItem("token");
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
        localStorage.removeItem("token");
        navigate("/login");
        // localStorage.removeItem("token");
        // history.push("/login");
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
