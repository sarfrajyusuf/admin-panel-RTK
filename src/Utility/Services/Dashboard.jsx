// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { URL } from "../../Common/Constant/Constant";
// import { handleResponse, headerConfig } from "../../Common/functions/comman";

// export const DashboardAPI = createApi({
//     reducerPath: "dashboard",
//     baseQuery: fetchBaseQuery({
//         baseUrl: URL.WALLET_API_URL,
//         prepareHeaders: (headers, { getState }) => {
//             return headerConfig(headers, getState);
//         },
//     }),
//     endpoints: (builder) => ({
//         //     getWallet: builder.query({
//         //       query: () => ({
//         //         url: "requestRouter/getWallet",
//         //         method: "GET",
//         //       }),
//         //       async onQueryStarted({}, { dispatch, queryFulfilled }) {
//         //         try {
//         //           const { data } = await queryFulfilled;
//         //           const resp = data?.response;
//         //           handleResponse(false, resp, dispatch);
//         //         } catch (error) {
//         //           handleResponse(false, error.error, dispatch);
//         //           console.log("ERROR WHILE getWallet::", error);
//         //         }
//         //       },
//         //     }),
//         getTransactionCounts: builder.query({
//             query: (payload) => ({
//                 url: "dashboard/transaction_graph",
//                 method: "GET",
//             }),
//             transformResponse: (result) => {
//                 // console.log('result::', result);
//                 return result.data;
//             },
//         }),
//     });
// }),

// export const {useGetRegisterUserCountsQuery } = DashboardAPI;
