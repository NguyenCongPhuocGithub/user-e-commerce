import { create } from 'zustand';

const useCustomer = create((set) => ({
  customer: {},
  setCustomer: (customer) => set({ customer }),
}));

export default useCustomer;