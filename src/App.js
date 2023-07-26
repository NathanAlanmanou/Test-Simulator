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
    "Goal-Directed and Resilient Individual: Failure is an inevitable part of life. Describe one time you failed at something and how that has changed you. In your response, reflect on how this growth will impact you in the future. Please respond in short answer/essay format and use examples and include specific details.",
    "Collaborator: When asked about teamwork, students often write about being the leader. What is another important aspect in group work? Discuss a time when you have worked in a group and how you observed the importance of that trait",
    "Communicator: Effective communication is critical to get your point across in a variety of situations. As a student, you must communicate verbally, electronically, and in written form. In this essay, please demonstrate how you would communicate with a teacher in written form: You have received a grade for a project that you feel is unjust. The teacher has asked that you write an essay describing your project, your contribution to the project, and why you feel your grade should be changed.",
    "Innovator: Innovative ideas and creations sometimes occur when individuals are attempting to think of ways to make tasks simpler or easier to complete. Some TJHSST students engage in this activity while conducting their research topic during their Senior year. In considering the research laboratories at TJHSST, what lab do you think would support this research best, what innovative research are you most interested in exploring, how have previous experiences led you to want to research this topic? Please respond in short answer/essay format and include details and examples.",
    "A renewable energy company is deciding between two projects. Project A is a wind farm with an initial cost of $50 million, expected to generate 100,000 MWh of electricity per year at an operating cost of $5 per MWh. The electricity can be sold for $25 per MWh. Project B is a solar farm with an initial cost of $80 million, expected to generate 80,000 MWh of electricity per year at an operating cost of $3 per MWh. The electricity can be sold for $30 per MWh. If the company has a lifespan of 20 years, which project should the company choose?"
  ]

  //select * from where test_id = 1

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
    <div>
      <div class="header">
        <div class="logo"><img src="https://i.ibb.co/qWhBPVK/Edu-Avenues.png" alt="banner"></img></div>
        <div class="title"><h2>TJTestPrep Practice Portal</h2></div>
      </div>
      <div className="container">
        <br></br>
        <h1 className="title1" style={{textAlign: "center"}}>Thomas Jefferson High School for Science and Technology</h1>
        <h2 className="title1">TJTestPrep Practice Essay Exam</h2>
        <p className="text" style={{fontSize: "small"}}>User: {email}</p>
        {renderFAQButton()}
        <br></br>
        <p className="text">Please answer the question(s) below. Once you complete the sheet, scroll down to the bottom and submit.</p>
        <h4 className="red"><b>{timer} MINUTES REMAINING</b></h4>
        <h3 class="text"><b>Student Portrait Sheet + Problem Solving Essay:</b></h3>
        {questions.map((question, index) => (
          <div key={index}>
            <p class="text">{question}</p>
            <CKEditor
              editor={ClassicEditor}
              data={answers[index] || ''}
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
                handleAnswerChange(index, { target: { value: data } });
              }}
              disabled={remainingCharacters[index] <= 0} // Disable the CKEditor when character limit is reached
            />
            <p class="smalltext" style={{fontSize: "small", textAlign: "right"}}>Remaining Characters: {remainingCharacters[index]}</p>
          </div>
        ))}

        <div class="align-right">
          <button class="center" onClick={handleSubmit}>Submit</button>
        </div>

        <br></br>
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
      clientId: "hidden for privacy reasons",
      scope: 'profile email',
      plugin_name: "tjsim"
    });
  });

  const validEmails = ['hidden for privacy reasons']; // List of valid emails

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
          <body>
            <div class="header">
              <div><img class="logo" src="https://i.ibb.co/qWhBPVK/Edu-Avenues.png" alt="banner"></img></div>
              <div class="title"><h2>TJTestPrep Simulator</h2></div>
            </div>
            <div class="container">
              <h1 className="text" style={{textAlign: "center", color: "white"}}>.</h1>
              <h1 class="login" >Welcome to the TJTestPrep Simulator!</h1>
              <h2 class="title1">Please login with Google to continue:</h2>
              <br></br>
              <GoogleLogin
                clientId="523668124113-jh0ttje6rh13ss9onubqsj9v2raum1it.apps.googleusercontent.com"
                pluginName="TJ Simulator"
                buttonText="Login with Google"
                onSuccess={handleLoginSuccess}
                onFailure={handleLoginFailure}
                cookiePolicy={"single_host_origin"}
              />
            </div>
          </body>
        );
        case 'start':
          return (
            <body>
              <div class="header">
                <div class="logo"><img src="https://i.ibb.co/qWhBPVK/Edu-Avenues.png" alt="banner"></img></div>
                <div class="title"><h2>TJTestPrep Portal</h2></div>
              </div>
              <div class="container">
                <h1 className="text" style={{textAlign: "center", color: "white"}}>.</h1>
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
          <body>
            <div class="header">
              <div class="logo"><img src="https://i.ibb.co/qWhBPVK/Edu-Avenues.png" alt="banner"></img></div>
              <div class="title"><h2>TJTestPrep Simulator</h2></div>
            </div>
            <div class="container">
              <h1 className="text" style={{textAlign: "center", color: "white"}}>.</h1>
              <h1 className="text" style={{textAlign: "center"}}>Thank You for Submitting!</h1>
              <br></br>
              <p className="text" style={{textAlign: "center"}}>We will return your evaluated text shortly.</p>
              <p className="text" style={{textAlign: "center"}}>Time you had remaining: <b>{timer}</b> minutes</p>
            </div>
          </body>
        );
      default:
        return null;
    }
  };
  return <div>{renderPage()}</div>;
};

export default App;