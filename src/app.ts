import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import productRoutes from './routes/productRoutes';

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api', (req, res, next) => {
  console.log(`Requisição recebida na rota: ${req.url}`);
  next();
}, productRoutes);

app.get('/', (req, res) => {
  console.log('Rota raiz acessada');
  res.send('API is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
