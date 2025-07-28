import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import * as schema from './schema';

dotenv.config();

const connection = mysql.createPool({
  uri: process.env.DATABASE_URL,
});

export const db = drizzle(connection, { schema, mode: 'default' });