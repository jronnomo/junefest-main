import { apiSlice } from './apiSlice';
import { SETTINGS_URL } from '../constants';

export const settingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query({
      query: () => SETTINGS_URL,
      providesTags: ['Settings'],
    }),
    updateSettings: builder.mutation({
      query: (data) => ({
        url: SETTINGS_URL,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Settings'],
    }),
  }),
});

export const { useGetSettingsQuery, useUpdateSettingsMutation } = settingsApiSlice;
