import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { handleResponse, headerConfig } from "../../Common/functions/comman";
import { URL } from "../../Constant copy/Constant";

export const userListAPI = createApi({
  reducerPath: "userList",
  baseQuery: fetchBaseQuery({
    baseUrl: URL.API_URL,
    prepareHeaders: (headers, { getState }) => {
      console.log("LETS CHECK HEADERS ==>", headers);
      console.log("DEBUGG 2 ==>", localStorage.getItem('jwtToken'));
      headers.set('Access-Control-Allow-Origin', '*')
      headers.set('Authorization', localStorage.getItem("jwtToken"))
      return headerConfig(headers, getState);
    },
  }),
  endpoints: (builder) => ({
    getUserCount: builder.query({
      query: (time) => ({
        url: `users/count?timeLine=${time}`,
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
    getNews: builder.query({
      query: (time) => ({
        url: `dashboard/latest_news?symbol=${time}`,
        method: "GET",
      }),
      async onQueryStarted({ }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data, "ytyut");
          handleResponse(false, data, dispatch);
        } catch (error) {
          console.log(error, "error::")
          handleResponse(true, error, dispatch);
        }
      },
    }),
    getUserList: builder.mutation({
      // onclick and hit api
      query: (data) => ({
        url: `auth/users/list`,
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
    getUser2FAVerify: builder.mutation({
      // onclick and hit api
      query: (data) => ({
        url: "auth/google_2fa_verify",
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

    //admin/auth/google_2fa_verify

    // http://localhost:3000/api/v1/admin/auth//users/list


  }),

});

export const { useLazyGetUserCountQuery, useLazyGetNewsQuery, useGetUserListMutation, useGetUser2FAVerifyMutation } = userListAPI;
