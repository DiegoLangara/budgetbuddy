import React from "react";
import '../../css/ContactUs.css'; // Assuming this is where the Contact page styles are
import ContactForm from '../../components/LandingPage/ContactForm.js'

const Contact = () => {
  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <div className="contact-row">
            <div className="contact-item">
              <h3>Interested in inquiring about our services?</h3>
              <p>We’d love to hear your feedback.</p>
            </div>
            <div className="contact-image">
              <ContactForm/>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
