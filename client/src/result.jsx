import React from 'react'

function Result({ roi }) {
  return (
    <div className="result-box">
      <h2>ROI Result</h2>
      <p>Your ROI is: <strong>{roi}%</strong></p>
    </div>
  )
}

export default Result
