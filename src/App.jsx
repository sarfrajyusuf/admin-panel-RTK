import React, { useEffect } from "react";
import { RouterProvider, createBrowserRouter, useLocation, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.scss";
import routes from "./Routing/Routes.jsx";
import { REACT_APP_DOMAIN_KEY } from "./Common/comman_fun";
import { useDispatch } from "react-redux";
import { logoutState } from "./Utility/Slices/user.slice";
import useSessionTimeout from './Common/comman_fun/sessionLogout' // Adjust the path as needed

function App() {
  const dispatch = useDispatch()
  const handleTimeout = () => {
    // toast.info('Session timed out. Logging out...')
    dispatch(logoutState())
  }

  const handleWarning = () => {
    toast.info('Your session is about to expire.')
    // Show warning to the user
  }

  useSessionTimeout(handleTimeout, 300000, 60000, handleWarning)

  const loc = useParams()
  const router = createBrowserRouter([
    {
      path: "/",
      children: routes,
    },
  ], { basename: `/${REACT_APP_DOMAIN_KEY}` });


  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
