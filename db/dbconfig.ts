import { createConnection } from 'typeorm';

export const connectToDb = async (options?: { [key: string]: any }) => {
  return await createConnection({
    type: 'mssql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '1433'),
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    synchronize: false, 
    logging: true,
    options: {
      encrypt: true,
      trustServerCertificate: true,
    },
    entities: [__dirname + '/../entities/*.ts'],
    ...options,
  });
};
