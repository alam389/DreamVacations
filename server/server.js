
//importing the libraries
const express = require('express');
const cors = require('cors');
const app = express();
const bcrypt = require('bcrypt');
var emailable = require('emailable')(process.env.EMAILABLE_API_KEY)
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './.env' });
const { Pool } = require('pg');

//test 
console.log("API Key:", process.env.EMAILABLE_API_KEY);
console.log("Environment variables loaded from:", './server/.env');// this is me testing this shit
console.log("PGHOST:", process.env.PGHOST); 
console.log("PGDATABASE:", process.env.PGDATABASE);
console.log("PGUSER:", process.env.PGUSER);
console.log("PGPASSWORD:", process.env.PGPASSWORD);
const port = 3000;

const lists = {}; //object to store favorite lists

const router = express.Router();
const adminRouter = express.Router();
const publicRouter = express.Router();
const userRouter = express.Router();
app.use(express.json()); // Middleware to parse JSON bodies
app.use('/api',router);
app.use('/api/public', publicRouter);
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);
userRouter.use(authenticateToken);



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

//-----------------------------------helper functions-----------------------------------//
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Expecting format: 'Bearer TOKEN'

  if (token == null) return res.sendStatus(401); // No token provided

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Invalid token
    req.user = user;
    next();
  });
}
//---------------------------------Public Routes---------------------------------//
publicRouter.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  console.log(`Registration attempt for username: ${username}`);
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;//regex for email validation by making sure it has an @ and a not empty domain or username
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const client = await pool.connect();
  try {
    // Check if the username already exists
    const userCheck = await client.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }
  
    // Verify the email address using Emailable
    const response = await emailable.verify(email);
    console.log('Email verification response:', response);

    if (response.error) {
      console.error('Email verification error:', response.error);
      return res.status(500).json({ error: 'Email verification failed' });
    }
    if (typeof response.score !== 'number' || !response.state) {//if the response is not a number or does not have a state, it will return an error
      return res.status(500).json({ error: 'Invalid response from email verification service' });
    }
    //based on the response from emailable, it will check the score out of 100 and if it is deliverable, if not it will not be created in the database and return an error error
    if (response.score >= 40 && response.state === 'deliverable') {
      const salt = await bcrypt.genSalt(10);//generate a salt
      const hashedPassword = await bcrypt.hash(password, salt);
      await client.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [username, email, hashedPassword]);
      res.status(201).json({ message: 'User created successfully' });
    }else {
      res.status(400).json({ error: 'Invalid email address' });
    }
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
  
});

publicRouter.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);//query the database
    const user = result.rows[0];//get the first row
    if (user && await bcrypt.compare(password, user.password)) {//compare the password using bcrypt
      const token = jwt.sign({
        userid: user.user_id,
        username: user.username}, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
      );
      console.log(result.rows[0]);//log the results
      res.json({ message: 'Login successful',userid: user.user_id, token: token});
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
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
//-----------------------------------User Routes----------------------------------------//

  userRouter.post('/list/create_list/:listName', async (req, res) => {
    let { listName } = req.params;
    let userid = req.user.userid;
    // server sanitization
    listName = listName.replace(/[^a-zA-Z0-9 ]/g, '').substring(0, 15);
    
    try {
      const client = await pool.connect();
      currentList = await client.query('SELECT * FROM userlist WHERE user_id = $1', [userid]);//query the database
      if (currentList.rows.length < 20 && currentList.rows.find(list => list.listname === listName) === undefined) {
        await client.query('INSERT INTO userlist (listname, user_id) VALUES ($1, $2)', [listName, userid]);
        res.status(201).json({ message: 'List created successfully' });
      }else {
        res.status(400).json({ error: 'List limit reached or list name already exists' });
      }
    }catch (error) {
      console.error('Database query error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  userRouter.get('/list/getalllist', async(req, res) => {
    let userid = req.user.userid;

    try{
      console.log(`Getting all lists for user "${userid}"`);
      let client = await pool.connect();
      const results = await client.query('SELECT * FROM userlist WHERE user_id = $1', [userid]);
      res.json(results.rows);
    }catch (error) {
      console.error('Database query error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  userRouter.get('/list/getalist/:listname', async(req, res) => {
    let listname = req.params.listname;
    let userid = req.user.userid;

    try{
      console.log(`Getting all lists for user "${userid}"`);
      let client = await pool.connect();
      const results = await client.query('SELECT * FROM userlist WHERE (user_id, listname) = $1, $2', [userid, listname]);
      res.json(results.rows);
    }catch (error) {
      console.error('Database query error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  userRouter.delete('/list/delete/:listname', async(req, res)=>{
    let listname = req.params.listname;
    let userid = req.user.userid;

    try{
      console.log(`Deleting list "${listname}" for user "${userid}"`);
      let client = await pool.connect();
      await client.query('DELETE FROM userlist WHERE (user_id, listname) = ($1, $2)', [userid, listname]);
      res.json({ message: 'List deleted successfully' });
    }catch (error) {
      console.error('Database query error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  })

  userRouter.put('/list/add/:listname/:destinationid', async(req, res) => {
    const{ listname,destinationid }= req.params;

    try{
      
    }catch (error) {
      console.error('Database query error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

  });


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
