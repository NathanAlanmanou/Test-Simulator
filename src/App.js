import React, { useState, useEffect } from 'react';

const TestPage = ({ questions, timer, onAnswerChange, onSubmit }) => {
  return (
    <div>
      <h1>Test Questions</h1>
      <p>Time Remaining: {timer} seconds</p>
      {questions.map((question, index) => (
        <div key={index}>
          <p>Question {index + 1}: {question}</p>
          <input
            type="text"
            onChange={(event) => onAnswerChange(index, event)}
          />
        </div>
      ))}
      <button onClick={onSubmit}>Submit</button>
    </div>
  );
};

const App = () => {

  const [page, setPage] = useState('start'); 
  const [timer, setTimer] = useState(7200);
  const [answers, setAnswers] = useState([]);

  // Removed Google login logic

  useEffect(() => {
    let countdown;
    if (page === 'test' && timer > 0) {
      countdown = setTimeout(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (page === 'test' && timer === 0) {
      submitTest(); // Automatically submit the test when the timer runs out
    }
    return () => clearTimeout(countdown);
  }, [page, timer]);

  const startTest = () => {
    setPage('test');
  };
  
  const handleAnswerChange = (index, event) => {
    const newAnswers = [...answers];
    newAnswers[index] = event.target.value;
    setAnswers(newAnswers);
  };

  const submitTest = () => {

    const elapsedTime = 7200 - timer; // get time remaining
    setPage('thankyou');
    fetch('/api/answers', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        answers: answers,
        elapsedTime: elapsedTime
      })
    })
    .then(response => {
      if (response.ok) {
        console.log('Answers saved!'); 
        setPage('thankyou');
      }
    }) 
    .catch(error => {
      console.log(error);
    });
  
  };

  const renderPage = () => {
    switch (page) {
      case 'start':
        return (
          <div>
            <h1>Welcome to the Test</h1>
            <button onClick={startTest}>Start</button> 
          </div>
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
            onAnswerChange={handleAnswerChange}
            onSubmit={submitTest}
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