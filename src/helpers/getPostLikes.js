import React, { useState } from "react";
import axios from "axios";

export const getPostLikes = (id) => {
  const token = localStorage.getItem("token");
  let data = "";
  const options = {
    url: window.baseURL + "/get_likes/" + id,
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      Accept: "application/json",
    },
  };
  axios(options)
    .then((response) => {
      data = response;
    })
    .catch((error) => {
      data = error;
    });

  return data;
};
