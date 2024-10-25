import express from 'express';
import cors from 'cors';
import customerRoutes from './routes/customerRoutes';
import 'dotenv/config';
import { connectToDb } from './db/dbconfig';
import path from 'path';

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));  
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.use('/', customerRoutes);

const main = async () => {
  try {
    await connectToDb();
    app.listen(3000, () => {
      console.log('Server started on http://localhost:3000');
    });
  } catch (error) {
    console.error('Database connection failed:', error.message); 
  }
};

main();
