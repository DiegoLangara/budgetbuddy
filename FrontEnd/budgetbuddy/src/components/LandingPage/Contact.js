import React from "react";
import '../../css/ContactUs.css'; // Assuming this is where the Contact page styles are
import ContactForm from '../../components/LandingPage/ContactForm.js';
import backgroundImage from '../../Assets/BB-ContactUs-Desktop.png'; // Ensure the correct path

const Contact = () => {
  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <div className="contact-row">
            <div className="contact-item">
              <h3>Interested in inquiring about our services?</h3>
              <p>We’d love to hear your feedback.</p>
            </div>
            <div className="contact-form">
              <ContactForm/>
            </div>
        </div>
        <img src={backgroundImage} alt="Background" />
      </div>
    </section>
  );
};

export default Contact;
