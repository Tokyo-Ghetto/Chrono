import pg from "pg";

let pool = new pg.Pool();

// There seems to be an issue when creating a pool in development mode, leading to an error with the user's password.

declare global {
  // eslint-disable-next-line no-var
  var __db__: pg.Pool | undefined;
}

// Limit to one connection pool in development
if (process.env.NODE_ENV === "production") {
  pool = new pg.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || "5432"),
  });
} else {
  if (!global.__db__) {
    global.__db__ = new pg.Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT || "5432"),
    });
  }
  pool = global.__db__;
}

export { pool };
