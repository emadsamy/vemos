import React, { useEffect, useState, useRef } from "react";
import { Route, Switch, NavLink, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import classes from "./Profile.module.css";
import { GetJwt } from "../../helpers/index";
import Button from "react-bootstrap/Button";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import * as actions from "../../store/index";
import toast from "react-hot-toast";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup
  .object({
    fullname: yup.string().min(2, "Too many characters").required("Fullname is required"),
    email: yup.string().email("Email must be a valid email").min(6, "Too Many Characters").required("Email address is required"),
  })
  .required();

const Information = ({ updateData }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  useState(() => {
    if (GetJwt()) {
      dispatch(actions.me());
    }
  }, [dispatch]);
  const rows = useSelector((state) => state.me);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    reset({
      fullname: rows.name,
      email: rows.email,
    });
  }, [rows]);

  const onSubmit = (data) => {
    // setSuccessTransfer(true)
    setLoading(true);
    const token = localStorage.getItem("token");
    const options = {
      url: window.baseURL + `/edit_user_data/${rows.id}`,
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
      data: {
        name: data.fullname,
        email: data.email,
      },
    };
    axios(options)
      .then((res) => {
        setLoading(false);
        const data = res.data;
        if (data.success) {
          updateData(data.data.name, data.data.email);
        }
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  return (
    <>
      <h2 className={`mb-5`}>Information</h2>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row md={4}>
          <Col lg={6} md={6}>
            <div className={classes.formGroup}>
              <label className={classes.formLabel}>Full Name</label>
              <InputGroup className="mb-1">
                <Controller
                  className={classes.authInput}
                  control={control}
                  {...register("fullname")}
                  aria-invalid={errors.fullname ? true : false}
                  render={({ field }) => (
                    <Form.Control
                      name="fullname"
                      disabled={loading}
                      className={errors.fullname ? classes.inputError : ""}
                      {...field}
                      placeholder="Fullname"
                    />
                  )}
                />
              </InputGroup>
              {errors.fullname && (
                <p className={classes.pError} role="alert">
                  {errors.fullname?.message}
                </p>
              )}
            </div>

            <div className={classes.formGroup}>
              <label className={classes.formLabel}>Email Address</label>
              <InputGroup className="mb-1">
                <Controller
                  className={classes.authInput}
                  control={control}
                  {...register("email")}
                  aria-invalid={errors.email ? true : false}
                  render={({ field }) => (
                    <Form.Control
                      name="email"
                      disabled={loading}
                      className={errors.email ? classes.inputError : ""}
                      {...field}
                      placeholder="example@example.com"
                    />
                  )}
                />
              </InputGroup>
              {errors.email && (
                <p className={classes.pError} role="alert">
                  {errors.email?.message}
                </p>
              )}
            </div>

            <Button disabled={loading} variant="primary" type="submit">
              Edit Now
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export { Information };
