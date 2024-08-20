interface IShopApiDataItem {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  currency: string;
  count: number;
  img: string;
}

/* interface IShopApiCartItem extends IShopApiDataItem{
  mockid: string;
} */

interface IShopApiUser {
  mockid: string;
  uid: string;
  cart: IShopApiDataItem[];
  orders: IOrder[];
}

interface IShopApiDataQuery {
  data: IShopApiDataItem[];
  isLoading?: boolean;
  isError?: boolean;
}

interface IRegisterUserState {
  user: {
    uid: string;
    cart: [];
    orders: [];
  };
}

interface IOrder {
  fullСreationDate: string;
  order: IShopApiDataItem[];
  orderPrice: number;
}

/* interface IOrders {
  ordersData: IOrder[]
}
 */
