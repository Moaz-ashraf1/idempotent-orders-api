import { ordersRepository } from './orders.repository';
import { CreateOrderInput, OrderOutput } from './orders.types';

export const ordersService = {
  async createOrder(input: CreateOrderInput): Promise<OrderOutput> {
    const order = await ordersRepository.create(input);
    return order;
  },

  async getAllOrders(): Promise<OrderOutput[]> {
    return ordersRepository.findAll();
  },
};