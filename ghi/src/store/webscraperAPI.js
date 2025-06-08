// webscraperAPI.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const webscraperAPI = createApi({
    reducerPath: 'webscraper',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_API_HOST
    }),
    tagTypes: ['ai'],
    endpoints: (builder) => ({
        tailorResume: builder.mutation({
            query: (data) => {
                const formData = new FormData();
                for (const key in data) {
                    console.log(data[key])
                    formData.append(key, data[key]);
                }
                return {
                    url: '/job_application',
                    method: 'POST',
                    body: formData
                };
            },
            invalidatesTags: ['ai']
        })
    })
});

export const { useTailorResumeMutation } = webscraperAPI;
