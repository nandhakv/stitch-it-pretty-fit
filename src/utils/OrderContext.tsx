
import React, { createContext, useContext, useState } from "react";
import { OrderDetails } from "./types";

interface OrderContextType {
  order: OrderDetails;
  updateOrder: (newData: Partial<OrderDetails>) => void;
  resetOrder: () => void;
}

const OrderContext = createContext<OrderContextType>({
  order: {},
  updateOrder: () => {},
  resetOrder: () => {},
});

export const useOrder = () => useContext(OrderContext);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [order, setOrder] = useState<OrderDetails>({});

  const updateOrder = (newData: Partial<OrderDetails>) => {
    setOrder((prev) => ({ ...prev, ...newData }));
  };

  const resetOrder = () => {
    setOrder({});
  };

  return (
    <OrderContext.Provider value={{ order, updateOrder, resetOrder }}>
      {children}
    </OrderContext.Provider>
  );
};
