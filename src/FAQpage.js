// FAQPage.js
import React from 'react';

const FAQPage = () => {
  // Define your FAQ questions and answers here
  const faqData = [
    {
      question: 'Question 1?',
      answer: 'Answer 1.',
    },
    {
      question: 'Question 2?',
      answer: 'Answer 2.',
    },
    // Add more questions and answers as needed
  ];

  return (
    <div>
      <h1>FAQ</h1>
      {faqData.map((faq, index) => (
        <div key={index}>
          <h3>{faq.question}</h3>
          <p>{faq.answer}</p>
        </div>
      ))}
    </div>
  );
};

export default FAQPage;
