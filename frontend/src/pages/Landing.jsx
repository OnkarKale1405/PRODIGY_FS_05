import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import './Landing.css'; // Importing external CSS file
import Logo from "../assets/sphere.png";

const Landing = () => {
  return (
    <div className="landing-container">
      <div className="main-container">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <img
            src={Logo}
            alt="logo"
            style={{ width: "100%", marginTop: "4rem" }}
          />
          <motion.span
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.5 }}
            className="company-name"
          >
            Social Sphere, Inc.
          </motion.span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="signup-container"
        >
          <motion.h2
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="headline"
          >
            Circling Now
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="subheadline"
          >
            A place to share your thoughts and ideas
          </motion.h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="signup-button"
          >
            <Link to="/signup" className="signup-link">
              Create Account
            </Link>
          </motion.button>
          <motion.h4
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="signin-prompt"
          >
            Already have an account?
          </motion.h4>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="signin-button"
          >
            <Link to="/signin" className="signin-link">
              Sign In
            </Link>
          </motion.button>
        </motion.div>
      </div>
      <footer>
        <nav>
          <ul>{/* Add your navigation links here */}</ul>
        </nav>
        <span>&copy; Social Sphere, Inc.</span>
      </footer>
    </div>
  );
};

export default Landing;
