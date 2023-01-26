import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import classes from "./App.module.css";
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
  return (
    <div className={classes.wrapper}>
      {/* <NavbarComponent /> */}
      <Routes>
        {/* <Route exact path="/" element={<Home title={"Title Props"} />} /> */}
        <Route exact path="/" element={<Newsfeed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/Persons" element={<Persons />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </div>
  );
}

export default App;
