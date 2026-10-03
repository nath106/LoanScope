import { useState } from 'react'

function ParameterInput({ label, min, max, step, value, onChange, error}) {
  return (
        <label> {label}
          <input 
          type="number" 
          min={min}
          max={max}
          value={value}
          step={step} 
          onChange= {(event) => onChange(event.target.value)}
          />
          {error && <p role="alert">{error}</p>}
        </label>
  );
};

export default ParameterInput