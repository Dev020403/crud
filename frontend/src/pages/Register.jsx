import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      const res = await axios.post(
        "http://localhost:3000/api/register",
        values
      );
      console.log(res);
      handleResponse(res.status, res.data.message);
    } catch (e) {
      console.log(e);
      handleResponse(e.response.status, e.response.data.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResponse = (status, message) => {
    if (status === 201) {
      toast.success(message);
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } else if (status >= 400 && status < 500) {
      toast.error(message);
    } else {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>
        <Formik
          initialValues={{
            email: "",
            name: "",
            password: "",
            contact: "",
          }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email("Invalid email address")
              .required("Required"),
            name: Yup.string()
              .max(50, "Must be 50 characters or less")
              .required("Required"),
            password: Yup.string()
              .required("Required"),
            contact: Yup.string()
              .matches(/^[0-9]+$/, "Must be only digits")
              .min(10, "Must be exactly 10 digits")
              .max(10, "Must be exactly 10 digits")
              .required("Required"),
          })}
          onSubmit={handleSubmit}
        >
          <Form className="space-y-6">
            <div className="flex flex-col">
              <label htmlFor="email" className="font-semibold">
                Email Address
              </label>
              <Field
                type="email"
                name="email"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                placeholder="example@example.com"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="name" className="font-semibold">
                Name
              </label>
              <Field
                type="text"
                name="name"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Your Name"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="password" className="font-semibold">
                Password
              </label>
              <Field
                type="password"
                name="password"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                placeholder="********"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="contact" className="font-semibold">
                Contact Number
              </label>
              <Field
                type="text"
                name="contact"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                placeholder="1234567890"
              />
              <ErrorMessage
                name="contact"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors w-full"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </Form>
        </Formik>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
