// FAQPage.js
import React from 'react';

const FAQPage = () => {
  // Define your FAQ questions and answers here
  const faqData = [
    {
      question: 'Can I skip questions and come back to them later?',
      answer: 'You are allowed to o skip questions and return to them later within the same section. However, \
      it is advisable that you try to answer every question to the best of your abilities.'
    },
    {
      question: 'How is the test scored?',
      answer: 'Every question you answer correctly, you will earn points. The number of points may depend \
      on the specific test or type of question. There is no extra penalty for a wrong answer as opposed to \
      leaving your answer blank.',
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
