import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { handleResponse, headerConfig } from "../../Common/functions/comman";
import { URL } from "../../Constant copy/Constant";

export const userDataList = createApi({
  reducerPath: "userData",
  baseQuery: fetchBaseQuery({
    baseUrl: URL.API_URL,
    prepareHeaders: (headers, { getState }) => {
      return headerConfig(headers, getState);
    },
  }),
  endpoints: (builder) => ({
    getUserDataList: builder.mutation({
      query: (payload) => ({
        url: "users/list",
        method: "POST",
        body: payload,
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
    getUserData: builder.query({
      query: (user_id) => ({
        url: `users/userBalance/${user_id}`,
        method: "GET",
      }),
      async onQueryStarted({ }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Handle response if needed
          handleResponse(false, data, dispatch);
        } catch (error) {
          // Handle error if needed
          handleResponse(true, error, dispatch);
        }
      },
    }),

    getUserTransaction: builder.mutation({
      query: (payload) => ({
        url: "users/sendReceiveTransactions",
        method: "POST",
        body: payload,
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
    getSwapTransaction: builder.mutation({
      query: (payload) => ({
        url: "users/swapTransaction",
        method: "POST",
        body: payload,
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
    deleteUser: builder.query({
      query: (id) => ({
        url: `users/delete/${id}`,
        method: "PUT",
      }),
      transformResponse: (result) => {
        return result?.data;
      },
    }),
    
    deleteMultiUser: builder.query({
      query: (id) => ({
        url: `users/deleteMultipleUser`,
        method: "PUT",
        body: id,
      }),
      transformResponse: (result) => {
        return result?.data;
      },
    }),

    // //delete Multiple users
    // deleteMultipleUser: builder.query({
    //   query: (id) => ({
    //     url: `users/deleteMultipleUser/${id}`,
    //     method: "PUT",
    //     body: { user_ids: id }
    //   }),
    //   transformResponse: (result) => {
    //     return result?.data;
    //   },
    // }),
  }),
});

export const {
  useGetUserDataListMutation,
  useLazyGetUserDataQuery,
  useGetUserTransactionMutation,
  useGetSwapTransactionMutation,
  useLazyDeleteUserQuery,
  useLazyDeleteMultiUserQuery
} = userDataList;
