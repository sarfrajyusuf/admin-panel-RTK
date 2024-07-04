// import { toastState } from "../../Utility/Slices/toast.slice";
import { toast } from "react-toastify";
import { logoutState } from "../../Utility/Slices/user.slice";
import Toaster from "../Toast/Toast";
import { REACT_APP_DOMAIN_KEY } from "../comman_fun";

export const headerConfig = (headers, getState) => {
  const token = getState().user?.users?.jwt_token;

  if (token) {
    headers.set("authorization", token);
  }
  headers.set("Content-Type", "application/json");
  return headers;
};

export const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
  return true;
};

export function throttle(mainFunction, delay) {
  let timerFlag = null;

  return (...args) => {
    if (timerFlag === null) {
      mainFunction(...args);
      timerFlag = setTimeout(() => {
        timerFlag = null;
      }, delay);
    }
  };
}

export const calculatePasswordStrength = (password) => {
  var regex = [
    "[A-Z]", // Uppercase Alphabet.
    "[a-z]", // Lowercase Alphabet.
    "[0-9]", // Digit.
    "[$@$!%*#?&]", // Special Character.
  ];

  var passed = 0;

  for (var i = 0; i < regex.length; i++) {
    if (new RegExp(regex[i]).test(password)) {
      passed++;
    }
  }

  return (passed / regex.length) * 100;
};

export const handleResponse = async (show, res, dispatch) => {
  let isError = false;
  console.log("Common RESPONSE 1 ==>", show, res); 
  let message = "";
  console.log("EEE", dispatch)
  if (res?.error?.data?.code == 401) {
    toast.error('Your session has expired.')
    dispatch(logoutState())
    // localStorage.setItem("Logout", true)
    // window.location.assign(`/${REACT_APP_DOMAIN_KEY}/login`)
  }
  else if (res?.code == 200 || res?.success) {
    isError = !res?.error;
    message = res?.message;
  } else if (res?.data?.code == 400 || res?.data?.code == 401) {
    console.log("Common RESPONSE 2 ==>");
    message = res?.data?.message;
    isError = !res?.data?.status;
  } else {
    message = "Something went wrong";
    isError = false;
  }
  let payload = {
    show: show && res?.status != 401,
    status: isError,
    message: message,
    statusCode: res?.status,
  };
  console.log("Common RESPONSE 3 ==>",payload);

  if (show && payload.show) {
    console.log("Common RESPONSE 4", payload)
    Toaster(payload.status, payload.message);
  }
  // show && Toaster(payload?.status, payload?.message);
  // dispatch(toastState(payload));
  return true
};



export function toFixedVal(number, decimals) {
  const x = Math.pow(10, decimals);
  return (Math.floor(number * x) / x).toFixed(decimals);
}


export const formatNumber = (value, place) => {
  const numValue = parseFloat(value);
  if (isNaN(numValue)) {
    return "0.00";
  }
  const hasDecimal = numValue % 1 !== 0;
  if (hasDecimal) {
    return numValue.toFixed(place);
  } else {
    return numValue.toString();
  }
};

export const converToQueryParams = (obj) => {
  return Object.entries(obj)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
};