const calculateButton = document.getElementById("calculate-button");

// Getting the elements only to be used on keyup calculation function
let loanType = document.getElementById("loan-type");
let loanAmount = document.getElementById("loan-amount");
let loanPeriod = document.getElementById("loan-period");

function PMT(rate, nper, pv, fv, type) {
    /*
    PMT formula is based on an Excel function
    
    JavaScript formula based on ExcelFormulas.js
    Availability: https://gist.github.com/pies/4166888

    rate:  interest rate per period
    nper:  total number of payments for the loan
    pv:    present value or the loan amount
    fv:    future value or zero if omitted
    type:  payment at the beginning of the period = 1,
           payment at the end of the period = 0 or if omitted
     */

    if (!fv) fv = 0;
    if (!type) type = 0;

    if (rate == 0) return -(pv + fv) / nper;

    let pvif = Math.pow(1 + rate, nper);
    let pmt = rate / (pvif - 1) * -(pv * pvif + fv);

    if (type == 1) {
        pmt /= (1 + rate);
    };

    return Math.abs(pmt).toFixed(2);
}

function logPMT() {

    // Getting the elements and their values
    const loanType = document.getElementById("loan-type");
    let interestRateField = document.getElementById("interest-rate");

    const loanAmount = document.getElementById("loan-amount").value;
    const loanPeriod = document.getElementById("loan-period").value;

    console.log(inputValues);

    const summaryPayment = document.getElementById("summary-payment");

    // Check the loan type and assign its Interest Rate value
    switch (loanType.value) {
        case "housing":
            interestRate = 5;
            interestRateField.innerHTML = `${interestRate}%`;
            console.log("=== It's housing!");
            break;
        case "car":
            interestRate = 4;
            console.log("=== It's car!");
            break;
        case "spending":
            interestRate = 3;
            console.log("=== It's spending!");
            break;
        default:
            interestRate = 1;
            console.log("Please select a valid Loan Type.")
            break;
    }

    console.log("Loan amount:", loanAmount);
    console.log("Interest Rate:", interestRate);
    console.log("Loan Period:", loanPeriod);

    if (!loanAmount || !interestRate || !loanPeriod) {
        summaryPayment.innerHTML = "Please fill in all the required fields.";
    } else if (loanAmount === "0" || interestRate === "0" || loanPeriod === "0") {
        summaryPayment.innerHTML = "The values must be above zero.";
    } else {
        summaryPayment.innerHTML =
            `The monthly payment is ${PMT(
                ((interestRate / 100) / 12),
                (loanPeriod * 12),
                (loanAmount)
            ) + " kr"}`;
    }
}

calculateButton.addEventListener("click", logPMT);

[loanAmount, loanPeriod, loanType].forEach(function (event) {
    event.addEventListener("keyup", logPMT)
});
[loanAmount, loanPeriod, loanType].forEach(function (event) {
    event.addEventListener("click", logPMT)
});