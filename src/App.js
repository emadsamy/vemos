import { useEffect, useState } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import classes from "./App.module.css";
import axios from "axios";
import { Home } from "./views/Home/Home";
import { Error404 } from "./views/Error404/Error404";
import { Login } from "./views/Auth/Login";
import { Register } from "./views/Auth/Register";
import { Newsfeed } from "./views/Newsfeed/Newsfeed";
import { Logout } from "./views/Logout/Logout";
import { Profile } from "./views/Profile/Profile";
import { Persons } from "./views/Persons/Persons";
import { NavbarComponent } from "./components/Navbar/Navbar";
import { GetJwt } from "./helpers/index";

function App() {
  const navigate = useNavigate();
  async function checkUser() {
    const token = localStorage.getItem("token");
    const options = {
      url: window.baseURL + "/check_authenticate",
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
    };
    await axios(options)
      .then((response) => {
        console.log(response.data.user);
      })
      .catch((err) => {
        console.log(err.response.status);
        if (err.response.status == 401) {
          localStorage.removeItem("token");
          // navigate("/login");
        }
      });
  }
  useEffect(() => {
    checkUser();
  }, []);
  return (
    <div className={classes.wrapper}>
      {/* <NavbarComponent /> */}
      <Routes>
        {/* <Route exact path="/" element={<Home title={"Title Props"} />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route exact path="/" element={<Newsfeed />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/Persons" element={<Persons />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </div>
  );
}

export default App;
