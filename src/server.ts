import 'dotenv/config';
import app from './app';
import './config/redis.client'; 

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});