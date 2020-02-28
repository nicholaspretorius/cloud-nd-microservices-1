import { Sequelize } from 'sequelize-typescript';
import { config } from './config/config';


const c = config.dev;
console.log("NODE ENV: ", process.env.NODE_ENV);
console.log("Feed config: ", config.dev);

// Instantiate new Sequelize instance!
export const sequelize = new Sequelize({
  "username": c.username,
  "password": c.password,
  "database": c.database,
  "host": c.host,

  dialect: 'postgres',
  storage: ':memory:',
});

