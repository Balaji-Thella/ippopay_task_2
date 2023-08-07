import React, { useEffect, useState } from "react";
import "./PasswordStrengthCalculator.css";
import axios from "axios";

const PasswordStrengthCalculator = () => {
  const [password, setPassword] = useState("");
  const [steps, setSteps] = useState(0);
  const [message, setMessage] = useState("");
  const [doesSubmitted, setDoesSubmitted] = useState(false);

  // Function to calculate the minimum steps to make a password strong
  const strongPasswordChecker = (password) => {
    const n = password.length;

    // Initialize variables to keep track of required modifications
    let deletions = 0;
    let replacements = 0;

    // Initialize variables to keep track of character types
    let hasLower = false;
    let hasUpper = false;
    let hasDigit = false;

    // Initialize variable to keep track of repeating characters
    let repeatCount = 0;

    for (let i = 0; i < n; ) {
      const currChar = password[i];
      let count = 0;

      // Count repeating characters
      while (i < n && password[i] === currChar) {
        i++;
        count++;
      }

      // Update character type flags
      if (/[a-z]/.test(currChar)) hasLower = true;
      if (/[A-Z]/.test(currChar)) hasUpper = true;
      if (/[0-9]/.test(currChar)) hasDigit = true;

      // Calculate replacements needed for repeating characters
      replacements += Math.floor(count / 3);
      repeatCount += Math.floor(count / 3);
    }

    const typesMissing =
      (hasLower ? 0 : 1) + (hasUpper ? 0 : 1) + (hasDigit ? 0 : 1);

    if (n < 6) {
      const diff = 6 - n;
      return Math.max(diff, typesMissing);
    } else {
      if (n > 20) {
        const deleteCount = n - 20;
        replacements -= Math.min(deleteCount, repeatCount);
        deletions = deleteCount;
      }
      return deletions + Math.max(typesMissing, replacements);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDoesSubmitted(true);
    const minSteps = strongPasswordChecker(password);
    const result = `Minimum steps required: ${minSteps}`;
    try {
      const payload = {
        password: password,
        result: result,
      };
      const response = await axios.post(
        "http://localhost:5000/api/savePassword",
        { payload }
      );
      setMessage(response.data.message);
    } catch (error) {
      console.error("Error saving password:", error);
      setMessage("Error saving password.");
    }
    setSteps(result);
  };

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        setMessage("");
      }, 5000);
    }
  }, [message]);

  return (
    <div className="password-container">
      <h1>Password Strength Calculator</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <div>
          <button type="submit" className="button">
            Save Password
          </button>
        </div>
      </form>
      <p className="steps-text">
        {doesSubmitted
          ? `Steps required to make password strong: ${steps}.`
          : "Please enter the password and submit it."}
      </p>
      {message ? <div className="alert">{message}</div> : null}
    </div>
  );
};

export default PasswordStrengthCalculator;
