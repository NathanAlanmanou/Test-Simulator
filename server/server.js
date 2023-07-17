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

// app.post('http://localhost:5000/api/submit-test', (req, res) => {
  
//     const { email, answers, elapsedTime } = req.body;
    
//     pool.query(
//       `INSERT INTO public."Test Entries"("Entry ID", "Student Email", "Test ID", "Time Elapsed", "Answer 1", "Answer 2", "Answer 3", "Answer 4", "Answer 5") 
//        VALUES (12345, $1, 1, $2, $3, $4, $5, $6, $7)`,
//       [email, elapsedTime, answers[0], answers[1], answers[2], answers[3], answers[4]], 
//       (err, result) => {
//         if (err) {
//           return res.status(500).send(err);
//         }
//         res.sendStatus(200);
//       }
//     );
  
//   });

app.post('http://localhost:5000/api/submit-test', (req, res) => {
  
    const { email, elapsedTime } = req.body;
    
    pool.query(
      `INSERT INTO public."Test Entries"("Entry ID", "Student Email", "Test ID", "Time Elapsed", "Answer 1", "Answer 2", "Answer 3", "Answer 4", "Answer 5") 
       VALUES (12345, $1, 1, $2, 1, 2, 3, 4, 5)`,
      [email, elapsedTime], 
      (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.sendStatus(200);
      }
    );
  
  });