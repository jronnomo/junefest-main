import { apiSlice } from './apiSlice';

const EVENTS_URL = '/api/events';

export const eventsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEvents: builder.query({
      query: () => EVENTS_URL,
      providesTags: ['Event'],
    }),
    getAllEvents: builder.query({
      query: () => `${EVENTS_URL}/all`,
      providesTags: ['Event'],
    }),
    getEventById: builder.query({
      query: (id) => `${EVENTS_URL}/${id}`,
      providesTags: (result, error, id) => [{ type: 'Event', id }],
    }),
    createEvent: builder.mutation({
      query: (data) => ({ url: EVENTS_URL, method: 'POST', body: data }),
      invalidatesTags: ['Event'],
    }),
    updateEvent: builder.mutation({
      query: ({ id, ...data }) => ({ url: `${EVENTS_URL}/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['Event'],
    }),
    deleteEvent: builder.mutation({
      query: (id) => ({ url: `${EVENTS_URL}/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Event'],
    }),
    addEventPhoto: builder.mutation({
      query: ({ id, ...data }) => ({ url: `${EVENTS_URL}/${id}/photos`, method: 'POST', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Event', id }],
    }),
    removeEventPhoto: builder.mutation({
      query: ({ eventId, photoId }) => ({
        url: `${EVENTS_URL}/${eventId}/photos/${photoId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Event'],
    }),
    rsvpEvent: builder.mutation({
      query: (id) => ({ url: `${EVENTS_URL}/${id}/rsvp`, method: 'POST' }),
      invalidatesTags: ['Event'],
    }),
    cancelRsvp: builder.mutation({
      query: (id) => ({ url: `${EVENTS_URL}/${id}/rsvp`, method: 'DELETE' }),
      invalidatesTags: ['Event'],
    }),
    getEventRsvps: builder.query({
      query: (id) => `${EVENTS_URL}/${id}/rsvps`,
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetAllEventsQuery,
  useGetEventByIdQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useAddEventPhotoMutation,
  useRemoveEventPhotoMutation,
  useRsvpEventMutation,
  useCancelRsvpMutation,
  useGetEventRsvpsQuery,
} = eventsApiSlice;
