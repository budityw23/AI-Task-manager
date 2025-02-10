import express from 'express';
import dotenv from 'dotenv';
import testRoutes from './routes/test.routes';

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
dotenv.config({ path: envFile });

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Mount test routes
app.use('/api/test', testRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port} in ${process.env.NODE_ENV} mode`);
});