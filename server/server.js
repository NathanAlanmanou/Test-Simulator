const express = require('express');
const pg = require('pg');

const app = express();

// PostgreSQL connection config
const pgConfig = {
  user: 'username',
  host: 'localhost',
  database: 'mydb',
  password: 'password',
  port: 5432
};

// Connect to PostgreSQL
const pool = new pg.Pool(pgConfig);

// API route to save answers
app.post('/api/answers', (req, res) => {
  // Get answers from request
  const answers = req.body.answers; 
  
  // Save to database
  pool.query(
    'INSERT INTO test_entries (answers) VALUES ($1)',
    [JSON.stringify(answers)],
    (err, result) => {
      // send response
    }
  );
});

app.listen(5000, () => {
  console.log('Server listening on port 5000');
});