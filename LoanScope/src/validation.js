export function validateInputs(principal, rate, payment) {
    const principalNum = Number(principal)
    const rateNum = Number(rate) / 100
    const paymentNum = Number(payment)
    //Monthly interest rate
    const monthlyInterest = principalNum * rateNum / 12
    //paymentMax
    const paymentMax = Math.max(1000000, 3 * monthlyInterest)

    //errors object, empty fields
    const errors = {
        principal: "",
        rate: "",
        payment: "",

    };

    //If statements for checking errors

    // principal 
    if (principal === "") { //if field is empty
        errors.principal = "Enter a starting principal.";
    }
    else if (!Number.isFinite(principalNum)) {
    errors.principal = "Principal must be a number.";
    }
    else if (principalNum < 1 || principalNum > 100000000) {
        errors.principal = "Enter value between $1 and $100,000,000."
    }


    // rate
    if (rate === ""){
        errors.rate = "Enter a valid Rate.";
    }
    else if (!Number.isFinite(rateNum)) {
    errors.principal = "Rate must be a number.";
    }
    else if (rateNum < 0 || rateNum > 0.4){
        errors.rate = "Enter an interest rate between 0% to 40%"
    }

    // payment
    if (!errors.principal && !errors.rate)
    {
        if (payment === ""){
            errors.payment = "Enter a valid payment"
        }
        else if (!Number.isFinite(paymentNum)) {
            errors.principal = "Payment must be a number.";
        }
        else if (paymentNum < 1)
        {
            errors.payment = "Under $1."
        }
        else if (paymentNum <= monthlyInterest)
        {
            errors.payment = "Loan would never be paid off"
        }
        else if (paymentNum > paymentMax)
        {
            errors.payment = "Over the maximum"
        }
    }
  return { errors, monthlyInterest, paymentMax };
}