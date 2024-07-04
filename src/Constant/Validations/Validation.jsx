import * as yup from "yup";
import { LENGTH, MESSAGE } from "../Messages";

export const loginSchema = yup
  .object({
    email: yup
      .string()
      .required(MESSAGE.EMAIL_REQUIRED)
      .email(MESSAGE.INVALID_EMAIL)
      .min(LENGTH.MIN_EMAIL, MESSAGE.EMAIL_LENGTH_MIN)
      .max(LENGTH.MAX_EMAIL, MESSAGE.EMAIL_LENGTH_MAX),
    password: yup
      .string()
      .required(MESSAGE.PASSWORD_REQUIRED)
      .min(LENGTH.MIN_PASSWORD, MESSAGE.PASSWORD_LENGTH)
      .max(LENGTH.MAX_PASSWORD, MESSAGE.PASSWORD_LENGTH_MAX),
    // .matches(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    //   MESSAGE.PASSWORD_REST
    // ),
  })
  .required();

export const forgetPasswordSchema = yup
  .object({
    email: yup
      .string()
      .required(MESSAGE.EMAIL_REQUIRED)
      .email(MESSAGE.INVALID_EMAIL)
      .min(LENGTH.MIN_EMAIL, MESSAGE.EMAIL_LENGTH_MIN)
      .max(LENGTH.MAX_EMAIL, MESSAGE.EMAIL_LENGTH_MAX),

    name: yup
      .string()
      .required(MESSAGE.NAME_REQ)
      .min(LENGTH.NAME_MIN, MESSAGE.NAME_MIN)
      .max(LENGTH.NAME_MAX, MESSAGE.NAME_MAX),
  })
  .required();
