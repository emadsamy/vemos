import React, {useState} from "react";
import axios from "axios";

export const User = () => {
  var userId = "";
  
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
      console.log(res.data.data);
      const data = res.data.data
      return data;
    })
    .catch((err) => {
      console.log(err);
      //   return err;
    });
};
