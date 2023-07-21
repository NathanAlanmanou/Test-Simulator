import React, { useState, useEffect, Component } from 'react';
import { GoogleLogin } from 'react-google-login';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { gapi } from "gapi-script";
import ReactDOM from 'react-dom';
import FAQPage from './FAQpage.js';
import './App.css';


const TestPage = ({email, page, timer, setPage}) => {
  const [entryID, setEntryID] = useState(Math.floor(100000 + Math.random() * 999999));
  const testID = 1 
  const [answers, setAnswers] = useState(Array(5).fill(''));
  const characterLimits = [1500, 1500, 1500, 1500, 3700]; // Character Limits
  const [remainingCharacters, setRemainingCharacters] = useState([...characterLimits]);

  useEffect(() => {
    // Calculate and update remaining characters whenever answers change
    const newRemainingCharacters = characterLimits.map((limit, index) => limit - (answers[index] ? answers[index].length : 0));
    setRemainingCharacters(newRemainingCharacters);
  }, [answers]);
  
  const [faqWindow, setFaqWindow] = useState(null);

  const openFAQPage = () => {
    const newWindow = window.open('', '_blank', 'width=600,height=400');
    newWindow.document.title = 'FAQ';
    newWindow.document.body.innerHTML = '<div id="faq-root"></div>';
  
    // Render the FAQPage component into the new window
    ReactDOM.render(<FAQPage />, newWindow.document.getElementById('faq-root'));
  
    setFaqWindow(newWindow);
  };
  

  // Closes the FAQ page when the window is closed
  const handleFAQWindowClose = () => {
    setFaqWindow(null);
  };

  const renderFAQButton = () => {
    return (
      <button onClick={openFAQPage}>FAQ</button>
    );
  };

  

  const handleAnswerChange = (index, event) => {
    const newAnswers = [...answers];
    newAnswers[index] = event.target.value;
    // line below removes the  '<p></p>' that surrounds the logged answers when they are inserted into the database
    newAnswers[index] = event.target.value.replace(/<p>|<\/p>/g, '');
    setAnswers(newAnswers);
  };
  
  //Establish Questions, (later will be achieved by importing from public."Questions")
  const questions=[
    "Describe a challenge that you have overcome in your life.",
    "Everyone applying to TJ says they are a good fit. What made you decide to apply?",
    "What’s the biggest risk you’ve ever taken? How did it turn out?",
    "What is something you do every day? When did you start doing this? What does it mean to you?",
    "What makes you happy?"
  ]

  if (page === 'test' && timer === 0) {submitAnswers()}

  const submitAnswers = () => {
    const elapsedTime = 90 - timer;
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

  // Weirdly enough the 'Thomas Jefferson High School for Science and Technology' Title text cannot be
  // centered, even if you do style={{textAlign: "center"}}

  return (
    <div style={{textAlign: 'center'}}>
      <div className="header">
        <div className="logo">
          <img src="https://jasonline.fcps.edu/jase-web/resource/images/tjhs_banner.png" alt="banner" />
        </div>
        <div className="title">
          <h2>Student Information Sheet</h2>
        </div>
      </div>
      <div className="container">
        <h1 className="title1">Thomas Jefferson High School for Science and Technology</h1>
        <h2 className="title1">TJTestPrep Practice Essay Portal</h2>
        <p className="text" style={{textAlign: "center"}}>Please answer the question(s) below. Once you complete the sheet, scroll down to the bottom and submit.</p>
        {/* Could probably add some information about the user here */} (RoP)
        <p className="red">MINUTES REMAINING: {timer}</p>
        <h3><b>Student Information Sheet:</b></h3>
        <div>
          <p>Describe a challenge that you have overcome in your life.</p>
          <CKEditor
            editor={ClassicEditor}
            data={answers[0] || ''}
            config={{
              toolbar: [
                'undo', 'redo', '|',
                'bold', 'italic', 'underline', '|',
                'cut', 'copy', 'paste', '|',
                'bulletedList', 'indent', 'outdent',
              ],
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              handleAnswerChange(0, { target: { value: data } });
            }}
            disabled={remainingCharacters[0] <= 0}
          />
        </div>
        <div>
          <p>Everyone applying to TJ says they are a good fit. What made you decide to apply?</p>
          <CKEditor
            editor={ClassicEditor}
            data={answers[1] || ''}
            config={{
              toolbar: [
                'undo', 'redo', '|',
                'bold', 'italic', 'underline', '|',
                'cut', 'copy', 'paste', '|',
                'bulletedList', 'indent', 'outdent',
              ],
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              handleAnswerChange(1, { target: { value: data } });
            }}
            disabled={remainingCharacters[1] <= 0}
          />
        </div>
        <div>
          <p>What’s the biggest risk you’ve ever taken? How did it turn out?</p>
          <CKEditor
            editor={ClassicEditor}
            data={answers[2] || ''}
            config={{
              toolbar: [
                'undo', 'redo', '|',
                'bold', 'italic', 'underline', '|',
                'cut', 'copy', 'paste', '|',
                'bulletedList', 'indent', 'outdent',
              ],
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              handleAnswerChange(2, { target: { value: data } });
            }}
            disabled={remainingCharacters[2] <= 0}
          />
        </div>
        <div>
          <p>What is something you do every day? When did you start doing this? What does it mean to you?</p>
          <CKEditor
            editor={ClassicEditor}
            data={answers[3] || ''}
            config={{
              toolbar: [
                'undo', 'redo', '|',
                'bold', 'italic', 'underline', '|',
                'cut', 'copy', 'paste', '|',
                'bulletedList', 'indent', 'outdent',
              ],
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              handleAnswerChange(3, { target: { value: data } });
            }}
            disabled={remainingCharacters[3] <= 0}
          />
        </div>
        <div>
          <p>What makes you happy?</p>
          <CKEditor
            editor={ClassicEditor}
            data={answers[4] || ''}
            config={{
              toolbar: [
                'undo', 'redo', '|',
                'bold', 'italic', 'underline', '|',
                'cut', 'copy', 'paste', '|',
                'bulletedList', 'indent', 'outdent',
              ],
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              handleAnswerChange(4, { target: { value: data } });
            }}
            disabled={remainingCharacters[4] <= 0}
          />
        </div>

        {renderFAQButton()}
        <button onClick={handleSubmit}>Submit Answers</button>
      </div>
    </div>
  );
  };


const App = () => {
  const [page, setPage] = useState('login');
  const [timer, setTimer] = useState(90);
  const [email, setEmail] = useState('');


  gapi.load("client:auth2", () => {
    gapi.client.init({
      clientId: "523668124113-jh0ttje6rh13ss9onubqsj9v2raum1it.apps.googleusercontent.com",
      scope: 'profile email',
      plugin_name: "tjsim"
    });
  });

  const validEmails = ['mkjeung@uchicago.edu', 'nalanmanou@uchicago.edu', 'matthewkimjeung@gmail.com', 'shrys.jain@gmail.com']; // List of valid emails

  const handleLoginSuccess = (response) => {
    console.log("RESPONSE:"  + response);
    const { email } = response.profileObj;
    alert("Welcome " + email);
    if (validEmails.includes(email)) {
      setEmail(email);
      setPage('start');
    } else {
      setPage('login');
    }
  };

  const handleLoginFailure = (error) => {
    console.log(error);
    setPage('login');
  };


  const startTest = () => {
    setPage('test');
  };

  useEffect(() => {
    let countdown;
    if (page === 'test' && timer > 0) {
      countdown = setTimeout(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 60000);
    } 
    return () => clearTimeout(countdown);
  }, [page, timer]);

  const renderPage = () => {
    switch (page) {
      case 'login':
        return (
          <div>
            <h1 class="whitetext">Google Login</h1>
            <GoogleLogin
              clientId="523668124113-jh0ttje6rh13ss9onubqsj9v2raum1it.apps.googleusercontent.com"
              pluginName="TJ Simulator"
              buttonText="Login with Google"
              onSuccess={handleLoginSuccess}
              onFailure={handleLoginFailure}
              cookiePolicy={"single_host_origin"}
            />
          </div>
        );
        case 'start':
          return (
            <body>
              <div class="header">
                <div class="logo"><img src="https://jasonline.fcps.edu/jase-web/resource/images/tjhs_banner.png" alt="banner"></img></div>
                <div class="title"><h2>TJTestPrep Portal</h2></div>
              </div>
              <div class="container">
                <h1 className="title1">Thomas Jefferson High School for Science and Technology</h1>
                <h2 class="title1" style={{textAlign: "center"}}>TJTestPrep Student Practice Portal</h2>
                <p class="text" style={{textAlign: "center"}}>Please wait until further instructions are given by your session proctor</p>
                <p class="text" style={{textAlign: "center"}}>When instructed, select the Start button below.</p>
                <button class="btn" onClick={startTest}>Start</button>
              </div>
            </body>
          );
        case 'test':
          return (
            <TestPage
              questions={[
                "Prompt 1",
                "Prompt 2",
                "Prompt 3",
                "Prompt 4",
                "Prompt 5"
              ]}
            email={email}
            timer={timer}
            setPage={setPage}
          />
        );
      case 'thankyou':
        return (
          <div style={{textAlign: 'center', color: 'white'}}>
            <h1>Thank You for Submitting the Test!</h1>
            <p>We will return your evaluated text shortly.</p>
            <p>Time Remaining: {timer} minutes</p>
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