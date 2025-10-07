import React, { useState } from "react";
import "./App.css";

function App() {
  const [invoiceVolume, setInvoiceVolume] = useState("");
  const [staffCount, setStaffCount] = useState("");
  const [averageWage, setAverageWage] = useState("");
  const [automationCost, setAutomationCost] = useState("");
  const [results, setResults] = useState(null);

  const calculateMetrics = () => {
    if (invoiceVolume && staffCount && averageWage && automationCost) {
      const monthlySavings =
        invoiceVolume * 5 - staffCount * averageWage * 0.1;

      const roi = ((monthlySavings - automationCost) / automationCost) * 100;
      const payback = automationCost / monthlySavings;

      setResults({
        savings: monthlySavings.toFixed(2),
        roi: roi.toFixed(2),
        payback: payback.toFixed(2),
      });
    }
  };

  return (
    <div className="app-container">
      <h1>Invoice ROI</h1>

      <div className="form-container">
        <label>
          Monthly Invoice Volume:
          <input
            type="number"
            value={invoiceVolume}
            onChange={(e) => setInvoiceVolume(e.target.value)}
            placeholder="Enter total invoices"
          />
        </label>

        <label>
          Number of Staff:
          <input
            type="number"
            value={staffCount}
            onChange={(e) => setStaffCount(e.target.value)}
            placeholder="Enter staff count"
          />
        </label>

        <label>
          Average Monthly Wage (₹):
          <input
            type="number"
            value={averageWage}
            onChange={(e) => setAverageWage(e.target.value)}
            placeholder="Enter wage per staff"
          />
        </label>

        <label>
          Automation Tool Cost (₹):
          <input
            type="number"
            value={automationCost}
            onChange={(e) => setAutomationCost(e.target.value)}
            placeholder="Enter cost"
          />
        </label>

        <button onClick={calculateMetrics}>Calculate ROI</button>
      </div>

      {results && (
        <div className="result-box">
          <p>💰 <b>Monthly Savings:</b> ₹{results.savings}</p>
          <p>📈 <b>ROI:</b> {results.roi}%</p>
          <p>⏳ <b>Payback Period:</b> {results.payback} months</p>
        </div>
      )}
    </div>
  );
}

export default App;
