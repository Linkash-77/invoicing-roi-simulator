import React, { useState } from 'react'

function InputForm({ setRoi }) {
  const [investment, setInvestment] = useState('')
  const [gain, setGain] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (investment && gain) {
      const roiValue = ((gain - investment) / investment) * 100
      setRoi(roiValue.toFixed(2))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <label>
        Initial Investment:
        <input
          type="number"
          value={investment}
          onChange={(e) => setInvestment(e.target.value)}
          placeholder="Enter amount"
          required
        />
      </label>

      <label>
        Total Return:
        <input
          type="number"
          value={gain}
          onChange={(e) => setGain(e.target.value)}
          placeholder="Enter total amount"
          required
        />
      </label>

      <button type="submit">Calculate ROI</button>
    </form>
  )
}

export default InputForm
