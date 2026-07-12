import { prisma } from '../../config/prisma.client';
import { CreateOrderInput } from './orders.types';

export const ordersRepository = {
  async create(data: CreateOrderInput) {
    return prisma.order.create({
      data: {
        product: data.product,
        quantity: data.quantity,
      },
    });
  },

  async findAll() {
    return prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });
  },

  async findById(id: number) {
    return prisma.order.findUnique({
      where: { id },
    });
  },
};