import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { handleResponse, headerConfig } from "../../Common/functions/comman";
import { URL } from "../../Constant copy/Constant";

export const swapTransactionAPI = createApi({
    reducerPath: "swaptransaction",
    baseQuery: fetchBaseQuery({
        baseUrl: URL.API_URL,
        prepareHeaders: (headers, { getState }) => {
            return headerConfig(headers, getState);
        },
    }),
    endpoints: (builder) => ({
        getSwapTransaction: builder.mutation({
            query: (payload) => (
                {
                    url: "transaction/swap_transaction",
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

        getTransactionCounts: builder.query({
            query: (params) => ({
                url: `dashboard/transaction_graph?timeLine=${params}`,
                method: "GET",
            }),
            async onQueryStarted({ }, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    handleResponse(false, data, dispatch);
                } catch (error) {
                    console.log(error, "error::")
                    handleResponse(true, error, dispatch);
                }
            },
        }),
        //     transformResponse: (result) => {
        //         console.log('result::', result);
        //         return result;
        //     },
        // }),
    }),
});

export const { useGetSwapTransactionMutation, useLazyGetTransactionCountsQuery } = swapTransactionAPI;
