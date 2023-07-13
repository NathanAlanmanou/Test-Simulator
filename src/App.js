import React, { useState, useEffect } from 'react';
import { GoogleLogin } from 'react-google-login';


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
  const [page, setPage] = useState('login');
  const [timer, setTimer] = useState(7200); // 2 hours in seconds
  const [answers, setAnswers] = useState([]);
  const [email, setEmail] = useState('');

  const validEmails = ['mkjeung@uchicago.edu', 'matthewkimjeung@gmail.com']; // List of valid emails

  const handleLoginSuccess = (response) => {
    const { email } = response.profileObj;
    alert(email);
    if (validEmails.includes(email)) {
      setEmail(email);
      setPage('start');
    } else {
      setPage('login');
    }
  };

  const handleLoginFailure = (error) => {
    console.log('Login failed:', error);
    //temporary, should be login
    setPage('start');
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


  const startTest = () => {
    setPage('test');
  };

  const handleAnswerChange = (index, event) => {
    const newAnswers = [...answers];
    newAnswers[index] = event.target.value;
    setAnswers(newAnswers);
  };

  const submitTest = () => {
    // Handle test submission
    setPage('thankyou');
    console.log('Answers:', answers); // You can send this array to the server for recording or further processing
  };

  const renderPage = () => {
    switch (page) {
    case 'login':
      return (
        <div>
          <h1>Google Login</h1>
          <GoogleLogin
            clientId="224009911894-dhi3o5gcjttqoq76c0jo5amf2nhtp34h.apps.googleusercontent.com"
            buttonText="Login with Google"
            onSuccess={handleLoginSuccess}
            onFailure={handleLoginFailure}
            cookiePolicy="single_host_origin"
          />
        </div>
      );
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
