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

const schema = yup
  .object({
    email: yup.string().email().min(6, "Too Many Characters").required("Email address is required"),
    password: yup.string().min(6, "Too Many Characters").required("Password is required"),
  })
  .required();

const Login = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const authActionHandler = (email, password) => {
    dispatch(actions.login(email, password));
  };

  const onSubmit = (data) => {
    authActionHandler(data.email, data.password);
  };
  const { loading, authErrors } = useSelector(
    (state) => ({
      loading: state.loading,
      authErrors: state.authErrors,
    }),
    shallowEqual
  );

  let redirect = "";
  if (GetJwt()) {
    redirect = <Navigate to="/newsfeed" />;
  }

  return (
    <>
      {redirect}
      <div className={classes.authContainer}>
        <div>
          <div className={`${classes.logo} d-flex justify-content-center mb-3`}>
            <img src={Logo} className={`img-fluid`} alt={"Vemos"} />
          </div>

          <div className={`${classes.authParent}`}>
            <h1 className="text-center">Login</h1>
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
            <div className={classes.authForm}>
              <Form onSubmit={handleSubmit(onSubmit)}>
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

                <Button disabled={loading} className={"w-100"} variant="primary" type="submit">
                  {loading ? "Loading..." : "Login"}
                </Button>

                <div className={`${classes.guest} text-center`}>
                  New to Vemos? <NavLink to="/register">Register Now</NavLink>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { Login };
