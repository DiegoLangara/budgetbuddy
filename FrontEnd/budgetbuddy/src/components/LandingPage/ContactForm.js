import React from "react";
import '../../css/Form.css';

const ContactForm = () => {
  return (
    <div className="form-container-unique">
      <form className="contact-form-unique">
        <div className="form-group-unique">
          <label htmlFor="email" className="label-unique">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="example@example.com"
            className="input-unique"
            required
          />
        </div>
        <div className="form-group-unique">
          <label htmlFor="name" className="label-unique banner-unique">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="John Doe"
            className="input-unique"
            required
          />
        </div>
        <div className="form-group-unique">
          <label htmlFor="comments" className="label-unique">Your comments</label>
          <textarea
            id="comments"
            name="comments"
            rows="3"
            className="textarea-unique"
            placeholder="How can we improove your experience?"
            required
          />
        </div>
        <button type="submit" className="submit-btn-unique ">Submit</button>
      </form>
    </div>
  );
};

export default ContactForm;
