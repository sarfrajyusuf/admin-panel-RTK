import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { handleResponse, headerConfig } from "../../Common/functions/comman";
import { URL } from "../../Constant copy/Constant";

export const tokenManagementAPI = createApi({
    reducerPath: "tokenManagement",
    baseQuery: fetchBaseQuery({
        baseUrl: URL.API_URL,
        prepareHeaders: (headers, { getState }) => {
            return headerConfig(headers, getState);
        },
    }),
    endpoints: (builder) => ({
        getTokenList: builder.query({
            query: (params) => ({
                url: `token/tokenList?` + params,
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

        tokenSearch: builder.mutation({
            query: (data) => ({
                url: "/token/searchToken",
                method: "POST",
                body: data,
            }),
            transformResponse: (result) => result,
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    let { data } = await queryFulfilled;
                    handleResponse(false, data, dispatch);
                } catch (error) {
                    // message.error(error?.error?.data?.message);
                    handleResponse(true, error, dispatch);

                }
            },
            async onCacheEntryAdded(arg, { dispatch }) { },
        }),

        addNewToken: builder.mutation({
            query: (data) => ({
                url: "/token/addToken",
                method: "POST",
                body: data,
            }),
            transformResponse: (result) => result,
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    let { data } = await queryFulfilled;
                    handleResponse(false, data, dispatch);
                } catch (error) {
                    handleResponse(true, error, dispatch);

                }
            },
            async onCacheEntryAdded(arg, { dispatch }) { },
        }),
        deleteToken: builder.query({
            query: (id) => ({
                url: `token/deleteToken/${id}`,
                method: "PUT",
            }),
            transformResponse: (result) => {
                return result?.data;
            },
        }),
    }),

});

export const {
    useLazyGetTokenListQuery,
    useTokenSearchMutation,
    useAddNewTokenMutation,
    useLazyDeleteTokenQuery
} = tokenManagementAPI;
