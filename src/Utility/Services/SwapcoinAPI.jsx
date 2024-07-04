import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { handleResponse, headerConfig } from "../../Common/functions/comman";
import { URL } from "../../Constant copy/Constant";

export const swapcoinsAPI = createApi({
    reducerPath: "swap",
    baseQuery: fetchBaseQuery({
        baseUrl: URL.API_URL,
        prepareHeaders: (headers, { getState }) => {
            return headerConfig(headers, getState);
        },
    }),
    endpoints: (builder) => ({
        getSwapCoins: builder.mutation({
            query: (payload) => (
                {
                    url: "transaction/swap_coins",
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

export const { useGetSwapCoinsMutation } = swapcoinsAPI;
