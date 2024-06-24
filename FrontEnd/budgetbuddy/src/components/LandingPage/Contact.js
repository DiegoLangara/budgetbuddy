import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Contact = () => {
  return (
    <section id="contact" className="contact-section text-center">
      <div className="container">
        <h2>Contact Us</h2>
        <p>Want to know more? Reach out to us!</p>
        <Link to="/contact" className="btn btn-primary">Contact Us</Link>
      </div>
    </section>
  );
};

export default Contact;
