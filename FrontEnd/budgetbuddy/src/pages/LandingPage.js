import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/LandingPage.css';
import Header from '../components/LandingPage/Header';
import Features from '../components/LandingPage/Features';
import Team from '../components/LandingPage/Team';
import Contact from '../components/LandingPage/Contact';
import Footer from '../components/LandingPage/Footer';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Header />
      <Features />
      <Team />
      <Contact />
      <Footer />
    </div>
  );
};

export default LandingPage;
