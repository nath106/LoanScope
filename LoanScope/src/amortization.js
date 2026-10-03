
// RE6
// Input: Pricipal, APR, and monthly Payment

// Output: Loan Payoff Date and Total Term in Months

// RE7
// Cumulative Interest Paid each month
// Cumulative Prinicpal Paid each month

// RE8
// Cap schedule at 1,200 months (100 years)
// Display payoff date would exceed horizon

// RE9
// 

export function buildSchedule(principalCents, apr, paymentCents) {
    let balance = principalCents;
    let month = 0;
    let cumulativeInterest = 0;
    let cumulativePrincipal = 0;
    const rows = [];

    while (balance > 0 && month < 1200) {
        month += 1;

        // 
        const interest = Math.round(balance * (apr/12));

        const owed = balance + interest;

        let principalPaid;

        if (paymentCents >= owed) {
            principalPaid = balance;
        }
        else {
            principalPaid = paymentCents - interest;
        }

        balance = balance - principalPaid;

        cumulativeInterest += interest;
        cumulativePrincipal += principalPaid;

        rows.push({
            month: month, 
            interest: interest, 
            principalPaid: principalPaid, 
            cumulativeInterest: cumulativeInterest, 
            cumulativePrincipal: cumulativePrincipal, 
            balance: balance
        });
    }

    return { rows:rows, termMonths:rows.length, totalInterestCents: cumulativeInterest, exceedsHorizon: balance > 0,};
}