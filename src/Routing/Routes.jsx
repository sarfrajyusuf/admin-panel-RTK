import React from "react";
import PublicRoute from "./Public/Public.jsx";
import PrivateRoute from "./Private/Private.jsx";
import { PAGES } from "./Pages.jsx";

const routes = [
  {
    path: "/",
    element: <PublicRoute />,
    children: PAGES.PUBLIC_PAGES,
  },
  {
    path: "/",
    element: <PrivateRoute />, 
    children: PAGES.PRIVATE_PAGES,
  },
];

export default routes;
