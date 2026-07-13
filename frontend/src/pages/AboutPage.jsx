import React from 'react';
import { FaEnvelope, FaLinkedin, FaGithub, FaUser, FaInstagram, FaXTwitter } from 'react-icons/fa6';
import EyeLogo from '../components/EyeLogo';
import './AboutPage.css';

export default function AboutPage() {
  return (
    <div className="about-page">
      <div className="about-content">
        <div className="about-logo-wrapper">
          <EyeLogo />
        </div>
        
        <div className="about-links">
          <a href="#">API DOCS</a>
          <a href="#">TERMS OF SERVICE</a>
          <a href="#">PRIVACY POLICY</a>
        </div>
        
        <div className="about-socials">
          <a href="#"><FaEnvelope size={22} /></a>
          <a href="#"><FaLinkedin size={22} /></a>
          <a href="#"><FaGithub size={22} /></a>
          <a href="#"><FaUser size={20} /></a>
          <a href="#"><FaInstagram size={22} /></a>
          <a href="#"><FaXTwitter size={22} /></a>
        </div>
      </div>

      <div className="about-footer">
        <h1 className="massive-text">EYE STOCK</h1>
        <p className="copyright-text">© 2026 EYE STOCK, ALL RIGHTS RESERVED.</p>
        <p className="made-with-love">Made with <span style={{ color: '#ef4444' }}>♥️</span> in India</p>
      </div>
    </div>
  );
}
