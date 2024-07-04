import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { loginUserState, logoutState } from "../Slices/user.slice";
import { handleResponse, headerConfig } from "../../Common/functions/comman";
import { URL } from "../../Constant copy/Constant";
import { toast } from "react-toastify";

export const loginAPI = createApi({
  reducerPath: "login",
  baseQuery: fetchBaseQuery({
    baseUrl: URL.API_URL,
    prepareHeaders: (headers, { getState }) => {
      return headerConfig(headers, getState);
    },
  }),
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (payload) => ({
        url: "auth/login",
        method: "POST",
        body: payload,
      }),
      async onQueryStarted({ }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const resp = data?.data;
          console.log("CHECKING resp ==>", resp);
          // handleResponse(true, data, dispatch);
          if (resp.google2fa_status == 0) {
            toast.success("Logged in successfully")

            dispatch(loginUserState(resp));
            handleResponse(false, data, dispatch);
          }
        } catch (error) {
          handleResponse(true, error.error, dispatch);
        }
      },
    }),

    forgotPassword: builder.mutation({
      query: (payload) => ({
        url: "auth/forgot_password",
        method: "POST",
        body: payload,
      }),
      async onQueryStarted({ }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const resp = data?.data;
          dispatch(logoutState(resp));

          handleResponse(true, data, dispatch);
        } catch (error) {
          handleResponse(true, error.error, dispatch);
        }
      },
    }),

    changePassword: builder.mutation({
      // onclick and hit api
      query: (data) => ({
        url: "auth/change_password",
        method: "POST",
        body: data,
      }),
      async onQueryStarted({ }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const resp = data?.data;
          dispatch(loginUserState(resp));

          handleResponse(true, data, dispatch);
        } catch (error) {
          handleResponse(true, error.error, dispatch);
        }
      },
    }),

    update2faGoogleAuth: builder.mutation({
      // onclick and hit api
      query: (data) => ({
        url: "auth/google_auth_enabledisable",
        method: "POST",
        body: data,
      }),
      transformResponse: (result) => result,
      async onQueryStarted(args, { dispatch, queryFulfilled }) {

      },
      async onCacheEntryAdded(arg, { dispatch }) { },
    }),

    getUserVerify: builder.query({
      query: () => ({
        url: `auth/google_auth_status`,
        method: "GET",
      }),
      async onQueryStarted({ }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          handleResponse(false, data, dispatch);
        } catch (error) {
          handleResponse(true, error, dispatch);
        }
      },
    }),

    getAuthImage: builder.query({
      query: () => ({
        url: `auth/google_auth_secretkey`,
        method: "GET",
      }),
      async onQueryStarted({ }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          handleResponse(false, data, dispatch);
        } catch (error) {
          handleResponse(true, error, dispatch);
        }
      },
    }),

    getAnnoucement: builder.mutation({
      // onclick and hit api
      query: (data) => ({
        url: "auth/announcements",
        method: "POST",
        body: data,
      }),
      async onQueryStarted({ }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          handleResponse(false, data, dispatch);
        } catch (error) {
          handleResponse(true, error, dispatch);
        }
      },
    }),

    getHistory: builder.mutation({
      // onclick and hit api
      query: (data) => ({
        url: `auth/announcement_history`,
        method: "POST",
        body: data,
      }),
      async onQueryStarted({ }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          handleResponse(false, data, dispatch);
        } catch (error) {
          handleResponse(true, error, dispatch);
        }
      },
    }),

    updateServerMaintenance: builder.query({
      query: () => ({
        url: `auth/maintenance_mode`,
        method: "PUT",
      }),
      async onQueryStarted({ }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          handleResponse(false, data, dispatch);
        } catch (error) {
          handleResponse(true, error, dispatch);
        }
      },
      transformResponse: (result) => {
        return result?.data;
      },
    }),

    getServerStatus: builder.query({
      query: () => ({
        url: `auth/maintenance_mode_status`,
        method: "GET",
      }),
      transformResponse: (result) => {
        return result;
      },
    }),

    getlogout: builder.query({
      query: () => ({
        url: `auth/logout`,
        method: "GET",
      }),
      transformResponse: (result) => {
        return result?.data;
      },
    }),

    // getUser2FAVerify: builder.mutation({
    //   // onclick and hit api
    //   query: (data) => ({
    //     url: "auth/google_2fa_verify",
    //     method: "POST",
    //     body: data,
    //   }),
    //   async onQueryStarted({ }, { dispatch, queryFulfilled }) {
    //     try {
    //       const { data } = await queryFulfilled;
    //       handleResponse(false, data, dispatch);
    //     } catch (error) {
    //       handleResponse(true, error, dispatch);
    //     }
    //   },
    // }),


    //auth/logout
    // get

    //auth/maintenance_mode


    //http://localhost:3000/api/v1/admin/auth/announcements
    ///auth/forgot_password
  }),



});

export const { useLoginUserMutation, useChangePasswordMutation, useLazyGetAuthImageQuery, useUpdate2faGoogleAuthMutation, useLazyGetUserVerifyQuery, useGetAnnoucementMutation, useForgotPasswordMutation, useGetHistoryMutation, useLazyUpdateServerMaintenanceQuery, useLazyGetlogoutQuery, useLazyGetServerStatusQuery } = loginAPI;
//auth/google_auth_secretkey