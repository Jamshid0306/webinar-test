import { createBrowserRouter } from "react-router-dom";

import Login from "../pages/LoginPage";
import TestPage from "../pages/TestPage";
import Register from "../pages/RegisterPage";
import HomePage from "../pages/HomePage";
import AdminPage from "../pages/AdminPage";
import React from "react";

export const router = createBrowserRouter([
  // {
  //   path: "/register",
  //   element: <Register />,
  // },
  {
    path: "/auth",
    element: <Login />,
  },
  {
    path: "/test",
    element: <TestPage />,
  },
  {
    path: "/admin",
    element: <AdminPage />,
  },
  {
    path: "/",
    element: <HomePage />,
  },
]);
