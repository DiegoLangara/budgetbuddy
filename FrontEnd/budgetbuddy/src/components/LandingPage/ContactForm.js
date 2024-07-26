import React, { useState } from "react";
import Swal from "sweetalert2";
import '../../css/Form.css';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    comments: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/contact/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    Swal.fire({
      position: "center",
      icon: result.success ? "success" : "error",
      title: result.message,
      showConfirmButton: false,
      timer: 1200,
      width: "300px",
    });

    if (result.success) {
      setFormData({ email: '', name: '', comments: '' }); // Reset form on successful submission
    }
  };

  return (
    <div className="form-container-unique">
      <form className="contact-form-unique" onSubmit={handleSubmit}>
        <div className="form-group-unique">
          <label htmlFor="email" className="label-unique">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="example@example.com"
            className="input-unique"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group-unique">
          <label htmlFor="name" className="label-unique">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="John Doe"
            className="input-unique"
            required
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group-unique">
          <label htmlFor="comments" className="label-unique">Your comments</label>
          <textarea
            id="comments"
            name="comments"
            rows="3"
            className="textarea-unique"
            placeholder="How can we improve your experience?"
            required
            value={formData.comments}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="submit-btn-unique">Submit</button>
      </form>
    </div>
  );
};

export default ContactForm;
