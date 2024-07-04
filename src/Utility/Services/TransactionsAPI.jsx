import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { handleResponse, headerConfig } from "../../Common/functions/comman";
import { URL } from "../../Constant copy/Constant";

export const transactionsAPI = createApi({
  reducerPath: "transactions",
  baseQuery: fetchBaseQuery({
    baseUrl: URL.API_URL,
    prepareHeaders: (headers, { getState }) => {
      return headerConfig(headers, getState);
    },
  }),
  endpoints: (builder) => ({
    getLatestTransaction: builder.mutation({
      query: (payload) => ({
        url: "transaction/list",
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
  }),
});

export const { useGetLatestTransactionMutation } = transactionsAPI;