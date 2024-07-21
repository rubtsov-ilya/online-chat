import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const shopApi = createApi({
  reducerPath: 'shopApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://6623b27c3e17a3ac846fe8ef.mockapi.io/' }),
  tagTypes: ['Products', 'Cart'],
  endpoints: (build) => ({
    /* QUERY */
    /* Products */
    getProducts: build.query<IShopApiDataItem[], {sortBy: 'title' | 'price', order: 'asc' | 'desc', title: string}>({
      query: ({sortBy, order, title = ''}) => ({
        url: `products`,
        params: {
          sortBy: sortBy,
          order: order,
          title: title,
        }
      }),
      providesTags: (result): any =>
        result
          ? [
              { type: 'Products', id: 'LIST' },
              ...result.map(({ id }) => ({ type: 'Products', id })),
            ]
          : [{ type: 'Products', id: 'LIST' }],
    }),
    /* get users to get the mockid of the user */
    getUsers: build.query<IShopApiUser[], void>({
      query: () => `users`,
      providesTags: (result): any =>
        result
          ? [
              { type: 'Cart', id: 'LIST' },
              ...result.map(({ id }: any) => ({ type: 'Cart', id })),
            ]
          : [{ type: 'Cart', id: 'LIST' }],
    }),
    /* get userState */
    getUserState: build.query<IShopApiUser, {uMockid: string}>({
      query: ({uMockid}) => ({
        url: `users/${uMockid}`,
      }),
      providesTags: (result): any =>
        result
          ? [
              { type: 'Cart', id: 'LIST' },
              { type: 'Cart', id: result.mockid },
            ]
          : [{ type: 'Cart', id: 'LIST' }],
    }),

    /* MUTATIONS */
    putCart: build.mutation<IShopApiDataItem, { newCartArray: IShopApiDataItem[], uMockid: string }>({
      query: ({newCartArray, uMockid}) => ({
        url: `users/${uMockid}`,
        method: 'PUT',
        body: {
          cart: newCartArray,
        },
      }),
      invalidatesTags: [{ type: 'Cart', id: 'LIST' }],
    }),

    putOrders: build.mutation<IShopApiDataItem, { newOrdersArray: IOrder[], uMockid: string }>({
      query: ({newOrdersArray, uMockid}) => ({
        url: `users/${uMockid}`,
        method: 'PUT',
        body: {
          orders: newOrdersArray,
        },
      }),
      invalidatesTags: [{ type: 'Cart', id: 'LIST' }],
    }),

    addUserToDataBase: build.mutation<IRegisterUserState, { uid: string }>({
      query: ({uid}) => ({
        url: `users`,
        method: 'POST',
        body: {
          uid: uid,
          cart: [],
          orders: [],
        },
      }),
      invalidatesTags: [{ type: 'Cart', id: 'LIST' }],
    }),
  }),
});

export const { useGetProductsQuery, useGetUsersQuery, useGetUserStateQuery, usePutCartMutation, useAddUserToDataBaseMutation, usePutOrdersMutation } = shopApi;
