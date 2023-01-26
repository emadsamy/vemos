import React, { useEffect, useState, useRef } from "react";
import { Route, Switch, NavLink, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import classes from "./Profile.module.css";
import { NavbarComponent } from "../../components/Navbar/Navbar";
import { GetJwt } from "../../helpers/index";
import { Avatar } from "../../components/Avatar/Avatar";
import Button from "react-bootstrap/Button";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import * as actions from "../../store/index";
import Alert from "react-bootstrap/Alert";
import AvatarPost from "../../assets/img/default.png";
import moment from "moment";
import toast from "react-hot-toast";
import { ColorRing, RotatingLines } from "react-loader-spinner";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Cleave from "cleave.js/react";
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { SuccessTransfer } from "./SuccessTransfer";
import { Information } from "./Information";
import { Edit } from "react-feather";

const Profile = ({}) => {
  const {
    register,
    reset,
    setValue,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm();
  const [price, setPrice] = useState(0);
  const [amountBool, setAmountBool] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [formStatus, setFormStatus] = useState(false);
  const [successTransfer, setSuccessTransfer] = useState(false);
  const [avatarUpdated, setAvatarUpdated] = useState("");
  const dispatch = useDispatch();
  useState(() => {
    if (GetJwt()) {
      dispatch(actions.me());
    }
  }, [dispatch]);
  const rows = useSelector((state) => state.me);
  const [fullName, setFullName] = useState("");

  let redirect = "";
  if (!GetJwt()) {
    redirect = <Navigate to="/login" />;
  }

  function priceHandler(e) {
    const amount = parseInt(e.target.rawValue);
    setPrice(e.target.rawValue);
    if (amount >= rows.balance) {
      setAmountBool(true);
      setFormStatus(true);
    } else {
      setAmountBool(false);
      setFormStatus(false);
    }
  }

  useEffect(() => {
    if (watch().email === "" || price >= rows.balance) {
      setFormStatus(true);
    } else {
      setFormStatus(false);
    }
  }, [watch()]);

  const onSubmit = (data) => {
    // setSuccessTransfer(true)
    setLoading(true);
    const token = localStorage.getItem("token");
    const options = {
      url: window.baseURL + "/transfer-money",
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
      data: {
        email: data.email,
        balance: price,
      },
    };
    axios(options)
      .then((res) => {
        const data = res;
        console.log(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const updateData = (name, email) => {
    setFullName(name);
  };

  const changeAvatar = (event) => {
    setLoadingAvatar(true);
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", event.target.files[0]);
    const token = localStorage.getItem("token");
    const options = {
      url: window.baseURL + `/edit_user_avatar/${rows.id}`,
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
      data: {
        avatar: event.target.files[0],
      },
    };

    axios(options)
      .then((response) => {
        setLoadingAvatar(false);
        if (response.data.success) {
          toast.success(response.data.message);
          setAvatarUpdated(response.data.data.avatar);
        }

        if (response.data.errors) {
          toast.error(response.data.errors[0]);
        }
      })
      .catch((error) => {
        setLoadingAvatar(false);
      });
  };

  return (
    <>
      <SuccessTransfer show={successTransfer} onHide={() => setSuccessTransfer(false)} />
      {redirect}
      <NavbarComponent avatarUpdated={avatarUpdated} fullName={fullName} />
      <div className={classes.profile}>
        <div className={`container`}>
          <div className={classes.welcomeMsg}>
            Welcome Back, <span className={`text-capitalize`}>{fullName ? fullName : rows.name} 🎉</span>
          </div>
          <Tabs selectedTabClassName={classes.activeTab}>
            <div className={classes.profileFlexable}>
              <div className={classes.profileLeft}>
                <div className={classes.profileAvatar}>
                  <Avatar avatarUpdated={avatarUpdated} />
                  {loadingAvatar ? (
                    <div className={classes.backdrop}>
                      <RotatingLines strokeColor="#fff" strokeWidth="5" animationDuration="0.75" width="26" visible={true} />
                    </div>
                  ) : (
                    <button disabled={loading} className={classes.changeAvatarBtn}>
                      <Edit className={classes.avatarIcon} size={18} />
                      <input onChange={changeAvatar} className={classes.changeAvatarInput} type="file" accept="image/*" />
                    </button>
                  )}
                </div>
                <div className={`${classes.userData} text-center`}>
                  <div>
                    Name: <span className={`text-capitalize`}>{fullName ? fullName : rows.name}</span>
                  </div>
                  <div>Balance: {rows.balance} $</div>
                </div>
                <TabList className={classes.tabList}>
                  <Tab className={classes.tabBtn}>Profile Information</Tab>
                  <Tab className={classes.tabBtn}>Transfer Money</Tab>
                </TabList>
              </div>
              <div className={classes.profileRight}>
                <TabPanel>
                  <Information updateData={updateData} />
                </TabPanel>
                <TabPanel>
                  <h2 className={`mb-5`}>💸 Send Money</h2>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={classes.formGroup}>
                      <div className={classes.fgFlexable}>
                        <div className={classes.formTitle}>Price</div>
                        <div>
                          <Cleave
                            placeholder="Enter Price"
                            options={{ numeral: true, numericOnly: true, blocks: [3] }}
                            onChange={(e) => priceHandler(e)}
                            className={`${classes.formInput} ${amountBool ? classes.formInvalid : ""}`}
                            required
                          />{" "}
                          $
                        </div>
                      </div>
                      <p>{}</p>
                    </div>

                    <div className={classes.formGroup}>
                      <div className={classes.fgFlexable}>
                        <div className={classes.formTitle}>Email</div>
                        <div>
                          <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                {...register("email", { required: "Email is required to complete your transiction" })}
                                placeholder="example@example.com"
                                className={`${classes.formInput} ${errors.email ? classes.formInvalid : ""}`}
                              />
                            )}
                          />
                        </div>
                      </div>
                      <p>{errors.email?.message}</p>
                    </div>
                    <Button disabled={formStatus} variant="success" type="submit">
                      Transfer Now
                    </Button>
                  </form>
                </TabPanel>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export { Profile };
