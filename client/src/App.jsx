import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [invoiceVolume, setInvoiceVolume] = useState("");
  const [staffCount, setStaffCount] = useState("");
  const [wage, setWage] = useState("");
  const [cost, setCost] = useState("");
  const [email, setEmail] = useState("");
  const [results, setResults] = useState(null);
  const [message, setMessage] = useState("");

  const handleCalculate = (e) => {
    e.preventDefault();

    const volume = parseFloat(invoiceVolume);
    const staff = parseFloat(staffCount);
    const salary = parseFloat(wage);
    const operationalCost = parseFloat(cost);

    if (isNaN(volume) || isNaN(staff) || isNaN(salary) || isNaN(operationalCost)) return;

    // Example logic — modify per your ROI formula
    const monthlySavings = (staff * salary * 0.3).toFixed(2); // 30% efficiency gain
    const roi = (((monthlySavings - operationalCost) / operationalCost) * 100).toFixed(2);
    const payback = (operationalCost / monthlySavings).toFixed(1);

    setResults({
      monthlySavings,
      roi,
      payback,
    });
    setMessage("");
  };

  const handleSendReport = async () => {
    if (!email) {
      setMessage("Please enter an email address");
      return;
    }
    if (!results) {
      setMessage("Please calculate ROI before sending report");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/send-report", {
        email,
        roi: results.roi,
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage("Failed to send report");
    }
  };

  return (
    <div className="app-container">
      <div className="card">
        <h1>Invoice ROI Simulator</h1>

        <form onSubmit={handleCalculate} className="input-group">
          <div>
            <input
              type="number"
              placeholder="Invoice Volume"
              value={invoiceVolume}
              onChange={(e) => setInvoiceVolume(e.target.value)}
              required
            />
          </div>

          <div>
            <input
              type="number"
              placeholder="Staff Count"
              value={staffCount}
              onChange={(e) => setStaffCount(e.target.value)}
              required
            />
          </div>

          <div>
            <input
              type="number"
              placeholder="Average Wage (₹)"
              value={wage}
              onChange={(e) => setWage(e.target.value)}
              required
            />
          </div>

          <div>
            <input
              type="number"
              placeholder="Operational Cost (₹)"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              required
            />
          </div>

          <button type="submit">Calculate ROI</button>
        </form>

        {results && (
          <div className="result-section">
            <h3>Results</h3>
            <div className="result-values">
              <div className="result-item">
                <span>Monthly Savings:</span>
                <span>₹{results.monthlySavings}</span>
              </div>
              <div
                className={`result-item ${
                  results.roi >= 0 ? "positive" : "negative"
                }`}
              >
                <span>ROI:</span>
                <span>{results.roi}%</span>
              </div>
              <div className="result-item">
                <span>Payback Period:</span>
                <span>{results.payback} months</span>
              </div>
            </div>

            {/* ✅ Email Input Section */}
            <div className="email-section">
              <input
                type="email"
                placeholder="Enter your email to receive report"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="button" onClick={handleSendReport}>
                Send Report
              </button>
            </div>
          </div>
        )}

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default App;
