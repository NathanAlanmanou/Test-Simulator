import React, { useState, useEffect, Component } from 'react';
import { GoogleLogin } from 'react-google-login';
import { gapi } from "gapi-script";
import { Editor, EditorState, RichUtils } from 'draft-js';
import 'draft-js/dist/Draft.css';
import ReactDOM from 'react-dom';
import FAQPage from './FAQpage.js';
import './App.css';


const TestPage = ({email, testID, questions, page, timer, setPage}) => {
  const [entryID, setEntryID] = useState(Math.floor(1000000 + Math.random() * 8999999));
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

  

  const handleAnswerChange = (index, newEditorState) => {
    const newAnswers = [...answers];
    const contentState = newEditorState.getCurrentContent();
    const plainTextContent = contentState.getPlainText();
    newAnswers[index] = plainTextContent;
    setAnswers(newAnswers);
  };
  

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


  const [editorStates, setEditorStates] = useState(questions.map(() => EditorState.createEmpty()));

  const styleMap = {
    BOLD: {
      fontWeight: 'bold',
    },
    ITALIC: {
      fontStyle: 'italic',
    },
    UNDERLINE: {
      textDecoration: 'underline',
    },
  };
  
  // Function to toggle inline styles
  const toggleInlineStyle = (editorState, inlineStyle) => {
    const newState = RichUtils.toggleInlineStyle(editorState, inlineStyle);
    return newState;
  };
  
  // Inline style controls
  const InlineStyleControls = ({editorState, onToggle}) => {
    const currentStyle = editorState.getCurrentInlineStyle();
    
    const INLINE_STYLES = [
      {label: '𝐁', style: 'BOLD'},
      {label: '𝐈', style: 'ITALIC'},
      {label: '𝑈', style: 'UNDERLINE'},
    ];
  
    return (
      <div style={{marginBottom: '10px'}}>
        {INLINE_STYLES.map(type => 
          <span 
            key={type.style}
            style={styles.styleButton}
            onMouseDown={(e) => {
              e.preventDefault();
              onToggle(type.style);
            }}
          >
            {type.label}
          </span>
        )}
      </div>
    );
  };

  const styles = {
    styleButton: {
      color: '#333',
      margin: '0 4px',
      padding: '5px 10px',
      display: 'inline-block',
      cursor: 'pointer',
      backgroundColor: 'white',
      border: '1px solid #ddd',
      borderRadius: '4px',
      userSelect: 'none',
      transition: 'background-color 0.2s',
      ':hover': {
        backgroundColor: '#f5f5f5',
      }
    }
  };
  

  // Weirdly enough the 'Thomas Jefferson High School for Science and Technology' Title text cannot be
  // centered, even if you do style={{textAlign: "center"}}

  return (
    <div>
      <div className="header">
        <div className="logo"><img src="https://i.ibb.co/qWhBPVK/Edu-Avenues.png" alt="banner"></img></div>
        <div className="title"><h2>TJTestPrep Practice Portal</h2></div>
      </div>
      <div className="container">
        <h1 className="title1" style={{textAlign: "center"}}>Thomas Jefferson High School for Science and Technology</h1>
        <h2 className="title1">TJTestPrep Practice Essay Exam</h2>
        <p className="text" style={{fontSize: "small"}}>User: {email}</p>
        {renderFAQButton()}
        <p className="text">Please answer the question(s) below. Once you complete the sheet, scroll down to the bottom and submit.</p>
        <h4 className="red"><b>{timer} MINUTES REMAINING</b></h4>
        <h3 className="text"><b>Student Portrait Sheet + Problem Solving Essay:</b></h3>
        {questions.map((question, index) => (
          <div key={index}>
            <p className="text">{question}</p>
            
            <InlineStyleControls
              editorState={editorStates[index]}
              onToggle={inlineStyle => {
                const newEditorState = toggleInlineStyle(editorStates[index], inlineStyle);
                const newEditorStates = [...editorStates];
                newEditorStates[index] = newEditorState;
                setEditorStates(newEditorStates);
              }}
            />
            
            <Editor
              editorState={editorStates[index]}
              onChange={(newEditorState) => {
                const newEditorStates = [...editorStates];
                newEditorStates[index] = newEditorState;
                setEditorStates(newEditorStates);
                handleAnswerChange(index, newEditorState);
              }}
              customStyleMap={styleMap}
              readOnly={remainingCharacters[index] <= 0}
              placeholder="Type your answer here..." // This will show a placeholder when the editor is empty
            />

            <p className="smalltext" style={{fontSize: "small", textAlign: "right"}}>Remaining Characters: {remainingCharacters[index]}</p>
          </div>
        ))}
        <div className="align-right">
          <button className="center" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  )
  };


const App = () => {
  const [page, setPage] = useState('login');
  const [timer, setTimer] = useState(90);
  const [email, setEmail] = useState('');
  const [questions, setQuestions] = useState([]);
  const [testID, setTestID] = useState([]);

  gapi.load("client:auth2", () => {
    gapi.client.init({
      clientId: '523668124113-jh0ttje6rh13ss9onubqsj9v2raum1it.apps.googleusercontent.com',
      scope: 'profile email',
      plugin_name: "tjsim"
    });
  });

  const validEmails = ['mkjeung@uchicago.edu', 'nalanmanou@uchicago.edu', 'matthewkimjeung@gmail.com', 'shrys.jain@gmail.com']; // List of valid emails

  const handleLoginSuccess = async (response) => {
    console.log("RESPONSE:"  + response);
    const { email } = response.profileObj;
    alert("Welcome " + email);
    if (validEmails.includes(email)) {
      setEmail(email);
      setPage('start');
  
      // Sending the email to the API after successful login
      try {
        const apiResponse = await fetch('http://localhost:5000/api/user/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email })
        });
        const apiData = await apiResponse.json();
  
        // Extracting questions and testID from apiData
        const { questions, testID } = apiData;
  
        setQuestions(questions); // Setting questions
        setTestID(testID);       // Assuming you have a setter function for testID
        
        console.log('API Response:', apiData);
      } catch (error) {
        console.error('Error sending email to API:', error);
      }
  
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
              questions={questions}
            email={email}
            testID={testID}
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