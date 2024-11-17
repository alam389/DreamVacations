const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config({ path: './.env' });
console.log("Environment variables loaded from:", './server/.env');// this is me testing this shit
console.log("PGHOST:", process.env.PGHOST); 
console.log("PGDATABASE:", process.env.PGDATABASE);
console.log("PGUSER:", process.env.PGUSER);
console.log("PGPASSWORD:", process.env.PGPASSWORD);
const router = express.Router();
const { Pool } = require('pg');
const lists = {}; //object to store favorite lists


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
        const result = await client.query('SELECT * FROM destinations');
        res.json(result.rows);
    } catch (error) {
        console.error("Database query error:", error);
        res.status(400).json({ error: error.message });
    } finally {
        client.release();
    }
});
router.get('/:id', async (req, res) => {
    const destinationId = parseInt(req.params.id, 10); //convert ID to an integer
    const client = await pool.connect();

    try {
        const result = await client.query('SELECT * FROM destinations WHERE destination_id = $1', [destinationId]);
        res.json(result.rows);
    }catch(error){
        console.error("Database query error:", error);
        res.status(400).json({ error: error.message });
    }
  });

router.get('/:id/coordinates',async (req, res) => {
    const destinationId = parseInt(req.params.id, 10); //ID to an integer
    const client = await pool.connect();

    try {
        const result = await client.query('SELECT latitude, longitude FROM destinations WHERE destination_id = $1', [destinationId]);
        res.json(result.rows);

    } catch (error) {
        console.error("Database query error:", error);
        res.status(400).json({ error: error.message });

    }
  });

  router.get('/search/:field/:pattern/:n?', async (req, res) => {
    const { field, pattern, n } = req.params;
    const limit = n ? parseInt(n, 10) : null;
    const client = await pool.connect();
    const allowedFields = [
      'destination', 'region', 'country', 'category', 'approximate_annual_tourists',
      'currency', 'majority_religion', 'famous_foods', 'language', 'best_time_to_visit',
      'cost_of_living', 'safety', 'cultural_significance', 'description'
    ];
  
    if (!allowedFields.includes(field)) {
      return res.status(400).json({ error: `Invalid search field: ${field}` });
    }
  
    try {
      // Construct the query safely
      const query = `
        SELECT * 
        FROM public.destinations
        WHERE ${field} ILIKE $1
        ${limit ? 'LIMIT $2' : ''}
      `;
  
      // Execute the query with parameters
      const params = [`%${pattern}%`];
      if (limit) params.push(limit);
  
      const result = await client.query(query, params);
  
      if (result.rows.length === 0) {
        console.log(`No matches found for pattern: "${pattern}" in field: "${field}"`);
        return res.status(404).json({ error: 'No matches found' });
      } else {
        console.log(`Found ${result.rows.length} matches for pattern: "${pattern}" in field: "${field}"`);
      }
  
      // Return the results
      return res.json(result.rows);
    } catch (error) {
      console.error('Database query error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    } finally {
      client.release();
    }
  });


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
