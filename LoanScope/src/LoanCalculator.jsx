import { useState } from 'react'
import ParameterInput from './Parameterinput'
import { buildSchedule } from './amortization'
import LoanChart from './LoanChart'
import ScheduleTable from './ScheduleTable'
import { readScenario } from './scenario'
import { validateInputs } from './validation'

function LoanCalculator() {
    const [initial] = useState(() => readScenario(window.location.search));
    const [principal, setPrincipal] = useState(initial.principal);
    const [rate, setRate] = useState(initial.rate);
    const [payment, setPayment] = useState(initial.payment);

    // string -> numbers
    const principalNum = Number(principal)
    const rateNum = Number(rate) / 100
    const paymentNum = Number(payment)

    const { errors, monthlyInterest, paymentMax } = validateInputs(principal, rate, payment);
    const hasErrors = Object.values(errors).some(Boolean);

    const principalCents = Math.round(principalNum * 100);
    const paymentCents = Math.round(paymentNum * 100);

    const schedule = hasErrors
        ? null
        : buildSchedule(principalCents, rateNum, paymentCents);

    let payoffDate = "";
    let years = 0;
    let months = 0;

    if (schedule && !schedule.exceedsHorizon) {
        const today = new Date();
        const payoff = new Date(today.getFullYear(), today.getMonth() + schedule.termMonths, 1);
        payoffDate = payoff.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        years = Math.floor(schedule.termMonths / 12);
        months = schedule.termMonths % 12;
    }
    const [copied, setCopied] = useState(false);

    function handleShare() {
        const params = new URLSearchParams({ principal, rate, payment });
        const link = `${window.location.origin}${window.location.pathname}?${params}`;
        navigator.clipboard.writeText(link).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
    });
    }

    //ParameterInput({ label, min, max, step, value, handleChange}
    return (
        <div>
            <ParameterInput 
            label = "Principal" 
            value={principal} 
            min={1}
            max={100000000}
            step={1}
            onChange={setPrincipal}
            error={errors.principal}
            />
            <ParameterInput 
            label = "rate" 
            value={rate} 
            min={0}
            max={40}
            step={0.01}
            onChange={setRate}
            error={errors.rate}
            />
            <ParameterInput 
            label = "Payment" 
            value={payment} 
            min={1}
            max={paymentMax}
            step={0.01}
            onChange={setPayment}
            error={errors.payment}
            />
            {schedule && schedule.exceedsHorizon && (
                <p>This loan would take more than 100 years to pay off.</p>
            )}
            {schedule && !schedule.exceedsHorizon && (
                <div>
                    <p>Payoff date: {payoffDate}</p>
                    <p>Term: {years} years, {months} months</p>
                    <p>Total interest: ${(schedule.totalInterestCents / 100).toFixed(2)}</p>
                </div>
            )}
            {schedule && (
                <LoanChart rows={schedule.rows} principalCents={principalCents} />
            )}
            {schedule && <ScheduleTable rows={schedule.rows} />}
            <button onClick={handleShare} disabled={hasErrors}>Share</button>
    {copied && <span> Link copied!</span>}
        </div>
    )

};

export default LoanCalculator