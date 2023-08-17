const express = require('express');
const pg = require('pg');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json()); 

const pgConfig = {
  user: 'postgres',
  host: 'localhost',
  database: 'testsimulator',
  password: 'Feraliwinner',  
  port: 5432,
};

const pool = new pg.Pool(pgConfig);

app.post('/api/user/login', (req, res) => {
  const { email } = req.body;
  
  const queryString = `
    WITH TestQuestions AS (
    SELECT "Test ID", "Q1 ID", "Q2 ID", "Q3 ID", "Q4 ID", "Q5 ID"
    FROM public."Tests"
    WHERE "Test ID" IN (
        SELECT "Test ID"
        FROM public."Students Info"
        WHERE "Email" = $1
    )
    )
    
    SELECT TQ."Test ID", Q."Question"
    FROM public."Questions" Q
    JOIN TestQuestions TQ ON Q."Question ID" IN (TQ."Q1 ID", TQ."Q2 ID", TQ."Q3 ID", TQ."Q4 ID", TQ."Q5 ID");
  `;
  
  pool.query(queryString, [email], (err, result) => {
      if (err) {
          console.error('Error querying the database', err);
          return res.status(500).json({ error: 'Internal Server Error' });
      }
      
      if (!result.rows || result.rows.length === 0) {
          return res.status(404).json({ error: 'No questions found for the provided IDs' });
      }

      // Extract the test ID (assuming there's only one test ID for the given email)
      const testID = result.rows[0]["Test ID"];
      
      // Extract the questions from the rows
      const questions = result.rows.map(row => row.Question);
      
      console.log('Retrieved test ID:', testID);
      console.log('Retrieved test questions:', questions);
      
      res.status(200).json({
          testID: testID,
          questions: questions
      });
  });
});



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