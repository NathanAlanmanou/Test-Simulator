const express = require('express');
const pg = require('pg');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json()); 

const pgConfig = {
  user: 'postgres',
  host: 'localhost',
  database: 'testsimulator',
  password: '************',  
  port: 5432,
};

const pool = new pg.Pool(pgConfig);

// API route to insert answers from application into 'Test Entries' table of 'testsimulator' database
app.post('/api/submit-test', (req, res) => {

  const {entryID, email, testID, elapsedTime, answers} = req.body;
  pool.query(
    `INSERT INTO public."Test Entries"("Entry ID", "Student Email", "Test ID", "Time Elapsed", "Answer 1", "Answer 2", "Answer 3", "Answer 4", "Answer 5") 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [entryID, email, testID, elapsedTime, answers[0], answers[1], answers[2], answers[3], answers[4]],
    (err, result) => {
      if (err) {
        return res.status(500).send(err); 
      }
      res.status(200).json({
        message: 'Answers submitted successfully' 
      });
    }
  );

});
app.get('/api/submit-test', (req, res) => {
  res.send('GET handler for /submit-test');
});
app.use((req, res) => {
  res.status(404).send('Route not found');
});

// Starts server 
app.listen(5000, () => {
  console.log('Server listening on port 5000');
});