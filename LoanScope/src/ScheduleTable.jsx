const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

function ScheduleTable({ rows }) {
  // The engine doesn't store the payment amount, but it's interest + principal
  function paymentOf(row) {
    return row.interest + row.principalPaid;
  }

  function downloadCsv() {
    const header = 'Payment #,Payment,Principal,Interest,Balance';
    const lines = rows.map((row) =>
      [
        row.month,
        (paymentOf(row) / 100).toFixed(2),
        (row.principalPaid / 100).toFixed(2),
        (row.interest / 100).toFixed(2),
        (row.balance / 100).toFixed(2),
      ].join(',')
    );
    const csv = [header, ...lines].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'amortization-schedule.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <details>
      <summary>Schedule</summary>

      <div style={{ maxHeight: 400, overflowY: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Payment #</th>
              <th>Payment</th>
              <th>Principal</th>
              <th>Interest</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.month}>
                <td>{row.month}</td>
                <td>{money.format(paymentOf(row) / 100)}</td>
                <td>{money.format(row.principalPaid / 100)}</td>
                <td>{money.format(row.interest / 100)}</td>
                <td>{money.format(row.balance / 100)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

export default ScheduleTable