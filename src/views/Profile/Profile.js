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
import { ErrorMessage } from "@hookform/error-message";
import { SuccessTransfer } from "./SuccessTransfer";
import { Information } from "./Information";
import { Edit } from "react-feather";
import { Helmet } from "react-helmet";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup
  .object({
    email: yup.string().email("Email must be a valid email").min(6, "Too many characters").required("Email address is required"),
    price: yup.number().min(1, "Too Many Numbers").required("Price is required"),
  })
  .required();

const Profile = ({}) => {
  const {
    register,
    setValue,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [totalPrice, setTotalPrice] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [emailReceiver, setEmailReceiver] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [transferLoading, setTransferLoading] = useState(false);
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

  const onSubmit = (data) => {
    setTransferLoading(true);
    if (totalPrice) {
      const token = localStorage.getItem("token");
      const options = {
        url: window.baseURL + "/transfer_money",
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json",
        },
        data: {
          email_authd: rows.email,
          email_receiver: data.email,
          balance: Math.floor(data.price),
        },
      };
      axios(options)
        .then((res) => {
          if (res.data.success) {
            setCurrentPrice(res.data.balance);
            setEmailReceiver(data.email);
            setSuccessTransfer(true);
            reset({
              email: "",
              price: "",
            });
          }
          setTransferLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setTransferLoading(false);
        });
    } else {
      alert(`${data.price}$ greater than your balance ${rows.balance}$`);
    }
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
      <Helmet>
        <title>{rows.name}</title>
      </Helmet>
      <SuccessTransfer
        email={emailReceiver}
        balance={currentPrice}
        show={successTransfer}
        onHide={() => setSuccessTransfer(false)}
      />
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
                  <div>Balance: {currentPrice ? currentPrice : rows.balance} $</div>
                </div>
                <TabList className={classes.tabList}>
                  <Tab className={classes.tabBtn}>Profile Information</Tab>
                  <Tab className={classes.tabBtn}>Transfer Money</Tab>
                </TabList>
              </div>
              <div className={classes.profileRight}>
                {/* Information */}
                <TabPanel>
                  <Information updateData={updateData} />
                </TabPanel>

                {/* Transfer Money */}
                <TabPanel>
                  <h2 className={`mb-5`}>💸 Send Money</h2>
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    {/* <div className={classes.formGroup}>
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
                    </div> */}

                    <Form.Group className={`${classes.formGroup} mb-3`} controlId="formEmail">
                      <div>
                        <Form.Label className={classes.formTitle}>Email</Form.Label>
                        <Controller
                          className={classes.authInput}
                          name="email"
                          control={control}
                          {...register("email")}
                          aria-invalid={errors.email ? true : false}
                          render={({ field }) => (
                            <Form.Control
                              disabled={loading}
                              className={`${classes.formInput} ${errors.email ? classes.formInvalid : ""}`}
                              {...field}
                              placeholder="example@example.com"
                            />
                          )}
                        />
                        {errors.email && (
                          <p className={classes.pError} role="alert">
                            {errors.email?.message}
                          </p>
                        )}
                      </div>
                    </Form.Group>

                    <Form.Group className={`${classes.formGroup} mb-3`} controlId="formEmail">
                      <div>
                        <Form.Label className={classes.formTitle}>Price</Form.Label>
                        <Controller
                          className={classes.authInput}
                          name="price"
                          control={control}
                          {...register("price", {
                            onChange: (e) => {
                              if (e.target.value > rows.balance) {
                                setTotalPrice(false);
                              } else {
                                setTotalPrice(true);
                              }
                            },
                          })}
                          aria-invalid={errors.price ? true : false}
                          render={({ field }) => (
                            <Form.Control
                              disabled={loading}
                              className={`${classes.formInput} ${errors.price ? classes.formInvalid : ""}`}
                              {...field}
                              placeholder="1234"
                            />
                          )}
                        />
                        {errors.price && (
                          <p className={classes.pError} role="alert">
                            {errors.price?.message}
                          </p>
                        )}
                      </div>
                    </Form.Group>
                    <Button className={classes.transferBtn} disabled={transferLoading} variant="success" type="submit">
                      {transferLoading ? "Loading..." : "Transfer Now"}
                    </Button>
                  </Form>
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
