import { apiSlice } from './apiSlice';

const CAROUSEL_URL = '/api/carousel';

export const carouselApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCarouselImages: builder.query({
      query: () => CAROUSEL_URL,
      providesTags: ['Carousel'],
    }),
    getAllCarouselImages: builder.query({
      query: () => `${CAROUSEL_URL}/all`,
      providesTags: ['Carousel'],
    }),
    addCarouselImage: builder.mutation({
      query: (data) => ({ url: CAROUSEL_URL, method: 'POST', body: data }),
      invalidatesTags: ['Carousel'],
    }),
    updateCarouselImage: builder.mutation({
      query: ({ id, ...data }) => ({ url: `${CAROUSEL_URL}/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['Carousel'],
    }),
    deleteCarouselImage: builder.mutation({
      query: (id) => ({ url: `${CAROUSEL_URL}/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Carousel'],
    }),
  }),
});

export const {
  useGetCarouselImagesQuery,
  useGetAllCarouselImagesQuery,
  useAddCarouselImageMutation,
  useUpdateCarouselImageMutation,
  useDeleteCarouselImageMutation,
} = carouselApiSlice;
