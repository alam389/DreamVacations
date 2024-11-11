const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config({ path: 'C:/SE 3316/clone2/lab-4-alam389/server/.env' });

console.log("Environment variables loaded from:", './server/.env');
console.log("PGHOST:", process.env.PGHOST); 
console.log("PGDATABASE:", process.env.PGDATABASE);
console.log("PGUSER:", process.env.PGUSER);
console.log("PGPASSWORD:", process.env.PGPASSWORD);
const router = express.Router();
const { Pool } = require('pg');

const port = 3000;
app.use('/api', router);

const { 
    PGHOST,
    PGDATABASE,
    PGUSER,
    PGPASSWORD } = process.env //destructuring
//connection logic to neon postgresql
const pool = new Pool({
    host: PGHOST,
    database: PGDATABASE,
    user: PGUSER,
    password: PGPASSWORD,
    port: 5432,
    ssl: {
        require: true,
    }
});
router.get('/all', async (req, res) => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM destination');
        res.json(result.rows);
    } catch (error) {
        console.error("Database query error:", error);
        res.status(400).json({ error: error.message });
    } finally {
        client.release();
    }
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
