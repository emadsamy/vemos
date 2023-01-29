import React, { useEffect, useState } from "react";
import { Route, Switch, NavLink, useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import classes from "./Auth.module.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import * as actions from "../../store/index";
import Alert from "react-bootstrap/Alert";
import { GetJwt } from "../../helpers/index";
import Logo from "../../assets/img/logo.png";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Helmet } from "react-helmet";

const schema = yup
  .object({
    fullname: yup.string().min(2, "Too many characters").required("Full Name is required"),
    email: yup.string().email("Email must be a valid email").min(6, "Too many characters").required("Email address is required"),
    password: yup
      .string()
      .min(6, "Too Many Characters")
      .required("Password is required")
      .matches(RegExp("(.*[a-z].*)"), "1 Lowercase letter")
      .matches(RegExp("(.*[A-Z].*)"), "1 Uppercase letter")
      .matches(RegExp("(.*\\d.*)"), "1 Number"),
    confirmPassword: yup
      .string()
      .min(6, "Too Many Characters")
      .required("Confirm Password is required")
      .oneOf([yup.ref("password")], "Passwords does not match")
      .matches(RegExp("(.*[a-z].*)"), "1 Lowercase letter")
      .matches(RegExp("(.*[A-Z].*)"), "1 Uppercase letter")
      .matches(RegExp("(.*\\d.*)"), "1 Number"),
  })
  .required();

const Register = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    authActionHandler(data.fullname, data.email, data.password, data.confirmPassword);
  };

  const authActionHandler = (fullname, email, password, confirmPassword) => {
    dispatch(actions.register(fullname, email, password, confirmPassword));
  };

  const { authErrors, registerData, loading } = useSelector(
    (state) => ({
      authErrors: state.authErrors,
      registerData: state.registerData,
      loading: state.loading,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (registerData.success) {
      setValue("fullname", "");
      setValue("email", "");
      setValue("password", "");
      setValue("confirmPassword", "");
    }
  }, [registerData]);

  let redirect = "";
  if (GetJwt()) {
    redirect = <Navigate to="/newsfeed" />;
  }

  return (
    <>
      <Helmet>
        <title>Register</title>
      </Helmet>
      {redirect}
      <div className={classes.authContainer}>
        <div>
          <div className={`${classes.logo} d-flex justify-content-center mb-3`}>
            <img src={Logo} className={`img-fluid`} alt={"Vemos"} />
          </div>

          <div className={`${classes.authParent}`}>
            <h1 className="text-center">Register</h1>
            {authErrors ? (
              <div className={classes.alertContainer}>
                {authErrors.map((err, index) => {
                  return (
                    <Alert key={index} variant={"danger"}>
                      {err}
                    </Alert>
                  );
                })}
              </div>
            ) : (
              ""
            )}

            {registerData.success ? (
              <div className={classes.alertContainer}>
                <Alert className={`text-capitalize`} variant={"success"}>
                  {registerData.message}{" "}
                  <NavLink className={classes.authLink} to="/login">
                    Login Now
                  </NavLink>{" "}
                </Alert>
              </div>
            ) : (
              ""
            )}
            <div className={classes.authForm}>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3" controlId="formFullname">
                  <Form.Label>Full Name</Form.Label>
                  <Controller
                    className={classes.authInput}
                    name="text"
                    control={control}
                    {...register("fullname")}
                    aria-invalid={errors.fullname ? true : false}
                    render={({ field }) => (
                      <Form.Control
                        disabled={loading}
                        className={errors.fullname ? classes.inputError : ""}
                        {...field}
                        placeholder="Enter fullname"
                      />
                    )}
                  />
                  {errors.fullname && (
                    <p className={classes.pError} role="alert">
                      {errors.fullname?.message}
                    </p>
                  )}
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email address</Form.Label>
                  <Controller
                    className={classes.authInput}
                    name="email"
                    control={control}
                    {...register("email")}
                    aria-invalid={errors.email ? true : false}
                    render={({ field }) => (
                      <Form.Control
                        disabled={loading}
                        className={errors.email ? classes.inputError : ""}
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
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Controller
                    className={classes.authInput}
                    name="password"
                    control={control}
                    {...register("password")}
                    aria-invalid={errors.password ? true : false}
                    render={({ field }) => (
                      <Form.Control
                        disabled={loading}
                        className={errors.password ? classes.inputError : ""}
                        {...field}
                        type="password"
                        placeholder="Enter a password"
                      />
                    )}
                  />
                  {errors.password && (
                    <p className={classes.pError} role="alert">
                      {errors.password?.message}
                    </p>
                  )}
                </Form.Group>

                <Form.Group className="mb-3" controlId="formConfirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Controller
                    className={classes.authInput}
                    name="confirmPassword"
                    control={control}
                    {...register("confirmPassword")}
                    aria-invalid={errors.confirmPassword ? true : false}
                    render={({ field }) => (
                      <Form.Control
                        disabled={loading}
                        className={errors.confirmPassword ? classes.inputError : ""}
                        {...field}
                        type="password"
                        placeholder="Confirm Password"
                      />
                    )}
                  />
                  {errors.confirmPassword && (
                    <p className={classes.pError} role="alert">
                      {errors.confirmPassword?.message}
                    </p>
                  )}
                </Form.Group>

                <Button disabled={loading} className={"w-100"} variant="primary" type="submit">
                  {loading ? "Loading..." : "Signup"}
                </Button>

                <div className={`${classes.guest} text-center`}>
                  Already have an account on Vemos? <NavLink to="/login">Login Now</NavLink>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { Register };
