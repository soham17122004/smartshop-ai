import {
  FaRobot,
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaHeart,
  FaExternalLinkAlt,
} from "react-icons/fa";

import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-about">
          <div className="footer-logo">
            <FaRobot />
            <div>
              <h2>SmartShop AI</h2>
              <span>ML Recommendation System</span>
            </div>
          </div>
          <p>
            SmartShop AI is an AI-powered e-commerce recommendation platform
            that uses Machine Learning, TF-IDF, and Cosine Similarity to
            recommend the most relevant products.
          </p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <a href="/">Home</a>
          <a href="/wishlist">Wishlist</a>
          <a href="/cart">Cart</a>
        </div>

        <div className="footer-tech">
          <h3>Built With</h3>
          <a
            href="https://vitejs.dev"
            target="_blank"
            rel="noopener noreferrer"
            title="Frontend React + Vite Framework"
          >
            React + Vite <FaExternalLinkAlt className="tech-link-icon" />
          </a>
          <a
            href="https://fastapi.tiangolo.com"
            target="_blank"
            rel="noopener noreferrer"
            title="Backend Python FastAPI Framework"
          >
            FastAPI <FaExternalLinkAlt className="tech-link-icon" />
          </a>
          <a
            href="https://scikit-learn.org"
            target="_blank"
            rel="noopener noreferrer"
            title="Scikit-Learn Machine Learning Library"
          >
            Machine Learning <FaExternalLinkAlt className="tech-link-icon" />
          </a>
          <a
            href="https://scikit-learn.org/stable/modules/feature_extraction.html#text-feature-extraction"
            target="_blank"
            rel="noopener noreferrer"
            title="TF-IDF & Cosine Similarity Algorithm"
          >
            TF-IDF + Cosine Similarity <FaExternalLinkAlt className="tech-link-icon" />
          </a>
        </div>

        <div className="footer-contact">
          <h3>Connect</h3>
          <a
            href="https://github.com/soham17122004"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub />
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/sohamdobariya/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin />
            LinkedIn
          </a>
          <a href="mailto:sohamdobariya01@gmail.com">
            <FaEnvelope />
            sohamdobariya01@gmail.com
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          Made with <FaHeart className="heart" /> using React, FastAPI &
          Machine Learning
        </p>

        <span>
          © {new Date().getFullYear()} SmartShop AI • Developed by Soham Dobariya
        </span>
      </div>
    </footer>
  );
}

export default Footer;