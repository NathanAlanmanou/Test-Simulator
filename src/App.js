import React, { useState, useEffect } from 'react';
import './App.css';


const TestPage = ({page, timer, setPage}) => {
  const [entryID, setEntryID] = useState(
    Math.floor(100000 + Math.random() * 900000)  
  );
  const email = 'nalanmanou@uchicago.edu'
  const testID = 1 
  const [answer1, setAnswer1] = React.useState("");
  const [answer2, setAnswer2] = React.useState("");
  const [answer3, setAnswer3] = React.useState("");
  const [answer4, setAnswer4] = React.useState("");
  const [answer5, setAnswer5] = React.useState("");
  const answers = [answer1, answer2, answer3, answer4, answer5];

  const handleAnswerChange = (answerSetter) => (event) => {
    answerSetter(event.target.value);
  };

  if (page === 'test' && timer === 0) {submitAnswers()}

  const submitAnswers = () => {
    const elapsedTime = 7200 - timer; // get time remaining
    fetch('http://localhost:5000/api/submit-test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        entryID: entryID,
        email: email,
        testID: testID,
        elapsedTime: elapsedTime,
        answers: answers
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
    setPage('thankyou')
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  const handleSubmit = (event) => {
    submitAnswers();
  };

  return (
<div style={{textAlign: 'center'}}>
  <h1>Test Questions</h1>
  <p style={{fontSize: '1.1em'}}>Write your answers to each question in the space below. Press the 'Submit' button when you are finished.</p>
  <p>Time Remaining: {timer} seconds</p>
  <div>
    <p>Question 1</p>
    <input type="text" onChange={handleAnswerChange(setAnswer1, 0)} />
  </div>
  <div>
    <p>Question 2</p>
    <input type="text" onChange={handleAnswerChange(setAnswer2, 1)} />
  </div>
  <div>
    <p>Question 3</p>
    <input type="text" onChange={handleAnswerChange(setAnswer3, 2)} />
  </div>
  <div>
    <p>Question 4</p>
    <input type="text" onChange={handleAnswerChange(setAnswer4, 3)} />
  </div>
  <div>
    <p>Question 5</p>
    <input type="text" onChange={handleAnswerChange(setAnswer5, 4)} />
  </div>
  <button onClick={handleSubmit}>Submit</button>
</div>
  );
};


const App = () => {
  const [page, setPage] = useState('start');
  const [timer, setTimer] = useState(7200);


  const startTest = () => {
    setPage('test');
  };

  useEffect(() => {
    let countdown;
    if (page === 'test' && timer > 0) {
      countdown = setTimeout(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } 
    // else if (page === 'test' && timer === 0) { 
    //   submitAnswers(); // Automatically submit the test when the timer runs out
    // }
    return () => clearTimeout(countdown);
  }, [page, timer]);

  const renderPage = () => {
    switch (page) {
      case 'start':
        return (
          <body>
            <div className="header">
        <div className="logo" style={{padding: '35px'}}>
            <img src="https://static.wixstatic.com/media/4606ee_fd197c744f29469ca269ab7c908a07e1~mv2.png/v1/fill/w_92,h_92,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/EA_Round2%20(2).png" alt="banner"></img>
        </div>
              <div className="title"><h1>TJTestPrep Student Practice Portal</h1></div>
            </div>
            <div className="container">
              <h1 className="title1">TJTestPrep Practice Exam</h1>
              <h2 className="title1"></h2>
              <p className="text">Select the start button when you are ready to begin the exam</p>
              <div className="button-container">
                <button className="btn" onClick={startTest}>Start</button>
              </div>
            </div>
          </body>
        );
      case 'test':
        return (
          <TestPage
            questions={[
              "Question 1",
              "Question 2",
              "Question 3",
              "Question 4",
              "Question 5"
            ]}
            timer={timer}
            setPage={setPage}
          />
        );
      case 'thankyou':
        return (
          <div>
            <h1>Thank You for Submitting the Test!</h1>
            <p>Time Remaining: {timer} seconds</p>
            {/* Display any additional information or messages here */}
          </div>
        );
      default:
        return null;
    }
  };
  return <div>{renderPage()}</div>;
};

export default App;