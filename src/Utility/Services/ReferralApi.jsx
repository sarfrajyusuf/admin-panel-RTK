import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { handleResponse, headerConfig } from "../../Common/functions/comman";
import { URL } from "../../Constant copy/Constant";

export const referralListAPI = createApi({
  reducerPath: "referralApi",
  baseQuery: fetchBaseQuery({
    baseUrl: URL.API_URL,
    prepareHeaders: (headers, { getState }) => {
      return headerConfig(headers, getState);
    },
  }),
  endpoints: (builder) => ({
    getRewards: builder.mutation({
      query: (payload) => ({
        url: "reward/referralList",
        method: "POST",
        body: payload,
      }),
      async onQueryStarted({}, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          handleResponse(false, data, dispatch);
        } catch (error) {
          handleResponse(true, error, dispatch);
        }
      },
    }),
    updateRewards: builder.mutation({
      query: (payload) => ({
        url: "reward/updateReward",
        method: "POST",
        body: payload,
      }),
      async onQueryStarted({}, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          handleResponse(false, data, dispatch);
        } catch (error) {
          handleResponse(true, error, dispatch);
        }
      },
    }),

    getAllRewards: builder.query({
      query: () => ({
        url: "reward/getAllRewards",
        method: "GET",
      }),
      async onQueryStarted({}, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          handleResponse(false, data, dispatch);
        } catch (error) {
          handleResponse(true, error, dispatch);
        }
      },
    }),
    //users/userReferrals/1

    getReferral: builder.query({
      query: (userId) => ({
        url: `users/userReferrals/${userId}`,
        method: "GET",
      }),
      async onQueryStarted({}, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          handleResponse(false, data, dispatch);
        } catch (error) {
          handleResponse(true, error, dispatch);
        }
      },
    }),
  }),
});

export const {
  useGetRewardsMutation,
  useLazyGetAllRewardsQuery,
  useUpdateRewardsMutation,
  useLazyGetReferralQuery

} = referralListAPI;
