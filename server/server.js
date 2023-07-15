const express = require('express');
const pg = require('pg');

const app = express();

// PostgreSQL connection config
const pgConfig = {
    user: 'postgres',
    host: 'localhost',
    database: 'testsimulator',
    password: 'Feraliwinner',
    port: 5432,
};

// Connect to PostgreSQL
const pool = new pg.Pool(pgConfig);

// API route to save answers

app.post('/api/answers', (req, res) => {
  
    const { email, answers, elapsedTime } = req.body;
    
    pool.query(
      `INSERT INTO Test_Entries (Student_Email, Test_ID, Time_Elapsed, Answer_1, Answer_2, Answer_3, Answer_4, Answer_5) 
       VALUES ($1, 1, $2, $3, $4, $5, $6, $7)`,
      [email, elapsedTime, answers[0], answers[1], answers[2], answers[3], answers[4]], 
      (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.sendStatus(200);
      }
    );
  
  });