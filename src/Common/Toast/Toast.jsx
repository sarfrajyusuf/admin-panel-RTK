import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const Toaster = (status, message) => {
  if (status) {
    return toast.success(message);
  } else {
    // return toast.error(message);
  }
};

export default Toaster;
