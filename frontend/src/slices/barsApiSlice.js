import { apiSlice } from './apiSlice';

const BARS_URL = '/api/bars';

export const barsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBars: builder.query({
      query: () => BARS_URL,
      providesTags: ['Bar'],
    }),
    getAllBars: builder.query({
      query: () => `${BARS_URL}/all`,
      providesTags: ['Bar'],
    }),
    getBarById: builder.query({
      query: (id) => `${BARS_URL}/${id}`,
      providesTags: (result, error, id) => [{ type: 'Bar', id }],
    }),
    createBar: builder.mutation({
      query: (data) => ({ url: BARS_URL, method: 'POST', body: data }),
      invalidatesTags: ['Bar'],
    }),
    updateBar: builder.mutation({
      query: ({ id, ...data }) => ({ url: `${BARS_URL}/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['Bar'],
    }),
    deleteBar: builder.mutation({
      query: (id) => ({ url: `${BARS_URL}/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Bar'],
    }),
  }),
});

export const {
  useGetBarsQuery,
  useGetAllBarsQuery,
  useGetBarByIdQuery,
  useCreateBarMutation,
  useUpdateBarMutation,
  useDeleteBarMutation,
} = barsApiSlice;
