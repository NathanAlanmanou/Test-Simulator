import React, { useState, useEffect } from 'react';

const TestPage = ({ timer, onAnswerChange, onSubmit}) => {
  const [answer1, setAnswer1] = React.useState("");
  const [answer2, setAnswer2] = React.useState("");
  const [answer3, setAnswer3] = React.useState("");
  const [answer4, setAnswer4] = React.useState("");
  const [answer5, setAnswer5] = React.useState("");

  const handleAnswerChange = (answerSetter) => (event) => {
    answerSetter(event.target.value);
  };

  const answers = [answer1, answer2, answer3, answer4, answer5];

  const submitAnswers = () => {
    console.log(answers)
    fetch('http://localhost:5000/api/submit-test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
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
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  const handleSubmit = (event) => {
    submitAnswers();
    onSubmit(event);  // Execute the passed onSubmit function
  };


  return (
    <div>
      <h1>Test Questions</h1>
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



const App = (answers, setAnswers) => {

  const [page, setPage] = useState('start'); 
  const [entryID, setEntryID] = useState(
    Math.floor(100000 + Math.random() * 900000)  
  );
  const [timer, setTimer] = useState(7200);

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
    fetch('http://localhost:5000/api/submit-test', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'nalanmanou@uchicago.edu',
        elapsedTime: elapsedTime
      })
    })
    .then(response => {
      if (response.ok) {
        setPage('thankyou');
      }
    }) 
    .catch(error => {
      console.error('Error submitting test:', error);
    // .catch(error => {
    //   console.log(error);
      // setPage('thankyou');
    });
  
  };

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
            answers={answers}
            setAnswers={setAnswers}

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