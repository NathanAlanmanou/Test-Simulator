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

app.post('http://localhost:5000/api/submit-test', (req, res) => {
  
    const { email, answers, elapsedTime } = req.body;
    
    pool.query(
      `INSERT INTO public."Test Entries"("Entry ID", "Student Email", "Test ID", "Time Elapsed", "Answer 1", "Answer 2", "Answer 3", "Answer 4", "Answer 5") 
       VALUES (12347, $1, 1, $2, $3, $4, $5, $6, $7)`,
      [email, elapsedTime, answers[0], answers[1], answers[2], answers[3], answers[4]], 
      (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.sendStatus(200);
      }
    );
  
  });

// app.post('http://localhost:5000/api/submit-test', (req, res) => {
    
//     const testData = {
//       entry_id: 12343,
//       student_email: 'nalanmanou@uchicago.edu',
//       test_id: 1,
//       time_elapsed: 3600, 
//       answer_1: '',
//       answer_2: 'Answer 2',
//       answer_3: 'Answer 3',
//       answer_4: 'Answer 4',
//       answer_5: 765
//     };

//     pool.query(
//       `INSERT INTO public."Test Entries"("Entry ID", "Student Email", "Test ID", "Time Elapsed", "Answer 1", "Answer 2", "Answer 3", "Answer 4", "Answer 5")
//       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
//       [testData.entry_id, testData.student_email, testData.test_id, testData.time_elapsed, 
//       testData.answer_1, testData.answer_2, testData.answer_3,
//       testData.answer_4, testData.answer_5],
//       (err, result) => {
//         if (err) {
//           console.log(err);
//         } else {
//           console.log('Inserted test entry:', result);
//         }
//       }
//     );
    
//   });

// app.post('http://localhost:5000/api/submit-test', (req, res) => {
  
//     // const { email, elapsedTime } = req.body;
    
//     pool.query(
//       `INSERT INTO public."Test Entries"("Entry ID", "Student Email", "Test ID", "Time Elapsed", "Answer 1", "Answer 2", "Answer 3", "Answer 4", "Answer 5") 
//        VALUES (12345, "asdfas", 1, 1234, 1, 2, 3, 4, 5)`,
//       (err, result) => {
//         if (err) {
//           return res.status(500).send(err);
//         }
//         res.sendStatus(200);
//       }
//     );
  
//   });

// Insert test data

// const testData = {
//   entry_id: 12343,
//   student_email: 'nalanmanou@uchicago.edu',
//   test_id: 1,
//   time_elapsed: 3600, 
//   answer_1: '',
//   answer_2: 'Answer 2',
//   answer_3: 'Answer 3',
//   answer_4: 'Answer 4',
//   answer_5: 765
// };

// pool.query(
//   `INSERT INTO public."Test Entries"("Entry ID", "Student Email", "Test ID", "Time Elapsed", "Answer 1", "Answer 2", "Answer 3", "Answer 4", "Answer 5")
//    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
//   [testData.entry_id, testData.student_email, testData.test_id, testData.time_elapsed, 
//    testData.answer_1, testData.answer_2, testData.answer_3,
//    testData.answer_4, testData.answer_5],
//   (err, result) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log('Inserted test entry:', result);
//     }
//   }
// );