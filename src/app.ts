import express from 'express';
import ordersRoutes from './modules/orders/orders.routes';

const app = express();

app.use(express.json());
app.use('/api', ordersRoutes);

export default app;