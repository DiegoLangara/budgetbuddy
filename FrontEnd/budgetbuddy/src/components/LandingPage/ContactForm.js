import React from "react";
import '../../css/Form.css';

const ContactForm = () => {
  return (
    <div className="form-container">
      <form className="contact-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="example@example.com"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="name" className="banner">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="comments">Your comments</label>
          <textarea
            id="comments"
            name="comments"
            rows="3"
            required
          />
        </div>
        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
};

export default ContactForm;
