import { Pool } from "pg";

const pool = new Pool({
  host: process.env.PGHOST || "postgres",
  port: parseInt(process.env.PGPORT || "5432"),
  user: process.env.PGUSER || "appuser",
  password: process.env.PGPASSWORD || "apppass",
  database: process.env.PGDATABASE || "appdb",
});

// Run schema migration on startup
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        done BOOLEAN DEFAULT false
      )
    `);
    console.log("✅ Todos table ready");
  } catch (err) {
    console.error("❌ DB migration failed", err);
  }
})();

export default pool;
