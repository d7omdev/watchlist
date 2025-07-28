import {
  mysqlTable,
  varchar,
  int,
  text,
  timestamp,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  avatarUrl: varchar("avatar_url", { length: 512 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const entries = mysqlTable("entries", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // 'Movie' or 'TV Show'
  director: varchar("director", { length: 255 }).notNull(),
  budget: varchar("budget", { length: 100 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  duration: varchar("duration", { length: 100 }).notNull(),
  yearTime: varchar("year_time", { length: 100 }).notNull(),
  description: text("description"),
  imageUrl: varchar("image_url", { length: 512 }), // Movie image
  userId: int("user_id"), // FK to users.id
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

