import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { handleResponse, headerConfig } from "../../Common/functions/comman";
import { URL } from "../../Constant copy/Constant";

export const addTokenAPI = createApi({
    reducerPath: "addToken",
    baseQuery: fetchBaseQuery({
        baseUrl: URL.API_URL,
        prepareHeaders: (headers, { getState }) => {
            return headerConfig(headers, getState);
        },
    }),
    endpoints: (builder) => ({
        addToken: builder.mutation({
            query: (payload) => ({
                url: "token/addToken",
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

// Export the API function
export const { useAddTokenMutation } = addTokenAPI;
