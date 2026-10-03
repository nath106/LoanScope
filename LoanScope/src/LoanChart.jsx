import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

// Custom tooltip: always shows month, balance, and cumulative interest
function ChartTooltip({ active, payload }) {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0].payload;
  return (
    <div style={{ background: 'white', color: '#222', border: '1px solid #ccc', padding: 8 }}>
      <p>Month {point.month}</p>
      <p>Balance: {money.format(point.balance)}</p>
      <p>Interest paid so far: {money.format(point.cumulativeInterest)}</p>
    </div>
  );
}

function LoanChart({ rows, principalCents }) {
  const [showInterest, setShowInterest] = useState(false);

  // Convert cents to dollars for display, and add a month 0 starting point
  const data = [
    { month: 0, balance: principalCents / 100, cumulativeInterest: 0 },
    ...rows.map((row) => ({
      month: row.month,
      balance: row.balance / 100,
      cumulativeInterest: row.cumulativeInterest / 100,
    })),
  ];

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={showInterest}
          onChange={(event) => setShowInterest(event.target.checked)}
        />
        Show cumulative interest
      </label>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" label={{ value: 'Month', position: 'insideBottom', offset: -5 }} />
          <YAxis tickFormatter={(value) => money.format(value)} width={90} />
          <Tooltip content={<ChartTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="balance"
            name="Remaining balance"
            stroke="#2563eb"
            dot={false}
            isAnimationActive={false}
          />
          {showInterest && (
            <Line
              type="monotone"
              dataKey="cumulativeInterest"
              name="Cumulative interest"
              stroke="#dc2626"
              dot={false}
              isAnimationActive={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default LoanChart