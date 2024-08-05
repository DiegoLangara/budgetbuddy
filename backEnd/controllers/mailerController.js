const { query } = require('./db');
const nodemailer = require('nodemailer');
const utility = require('./utilityFunctions');

const sendContactForm = async (req, res) => {
  const { email, name, comments } = req.body;

  if (!email || !name || !comments) {
    return res.status(400).json({ message: 'All fields are required.', success: false, fields: email && name && comments });
  }

  // Configure the SMTP transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  // Email to the company
  const companyMailOptions = {
    from: process.env.SMTP_USER,
    to: process.env.CONTACT_EMAIL,
    subject: 'New Contact Form Submission',
    text: `You have a new contact form submission from:
    Name: ${name}
    Email: ${email}
    Comments: ${comments}`
  };

  // Confirmation email to the sender
  const senderMailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Thank you for contacting BudgetBuddy',
    text: `Dear ${name},

Thank you for reaching out to BudgetBuddy. We have received your message and one of our representatives will be contacting you shortly.

Here are the details you provided:
Name: ${name}
Email: ${email}
Comments: ${comments}

Best regards,
Team BudgetBuddy`
  };

  try {
    await transporter.sendMail(companyMailOptions);
    await transporter.sendMail(senderMailOptions);
    res.status(200).json({ message: 'Your message has been sent successfully.', success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'There was an error sending your message. Please try again later.', success: false });
  }
};

module.exports = {
  sendContactForm // Export the new function
};
