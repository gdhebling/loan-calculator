const calculateButton = document.getElementById("calculate-button");

let loanGoal = document.getElementById("loan-goal");
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

function serialLoan(rate, period, pv, instYr) {
    /* 
    instYr:    instalments per year, 12 if omitted
      */

    if (!instYr) instYr = 12;

    ratePerInst = rate / instYr;
    numInst = period * instYr;

    interest = pv * ratePerInst;
    repayment = pv / numInst;
    payment = repayment + interest;
    principal = (pv - repayment);

    return {
        interest,
        repayment,
        payment,
        principal
    };
}

function setInterestRate() {
    const loanGoal = document.getElementById("loan-goal");
    let interestRateField = document.getElementById("interest-rate");

    switch (loanGoal.value) {
        case "housing":
            interestRate = 3.5;
            interestRateField.innerHTML = `${interestRate}%`;
            break;
        case "car":
            interestRate = 4.65;
            interestRateField.innerHTML = `${interestRate}%`;
            break;
        case "consumer":
            interestRate = 12;
            interestRateField.innerHTML = `${interestRate}%`;
            break;
        default:
            interestRate = 0;
            interestRateField.innerHTML = `${interestRate}%`;
            break;
    }
}

function logPMT() {

    let loanAmount = document.getElementById("loan-amount").value;
    let loanPeriod = document.getElementById("loan-period").value;
    const loanType = document.getElementById("loan-type").value;
    const summaryPayment = document.getElementById("summary-payment");
    const tableBody = document.getElementById("table-body");

    setInterestRate();

    // Calculating serial loan
    serialLoan(
        (interestRate / 100),
        (loanPeriod),
        (loanAmount)
    );

    // Calculating annuity loan
    const resultPMT = PMT(
        ((interestRate / 100) / 12),
        (loanPeriod * 12),
        (loanAmount)
    );

    function printResults() {
        summaryPayment.innerHTML = `
        <h3>Your Summary</h3>
        `;


        if (loanType === "serial-loan-type") {
            summaryPayment.innerHTML = `
            <p> Your first monthly payment is <span> ${payment.toFixed(2)} kr </span></p>
            <h4>Report:</h4>
            `;
            tableBody.innerHTML = `
                <table>
                <thead>
                <tr>
                    <th>Period</th>
                    <th>First Payment</th>
                    <th>First Interest Payment</th>
                    <th>Fixed Repayment</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>${numInst.toFixed(0)}</td>   
                    <td>${payment.toFixed(2)} kr</td>
                    <td>${interest.toFixed(2)} kr</td>
                    <td>${repayment.toFixed(2)} kr</td>
                </tr>
                </tbody>
                </table>
                `
        } else if (loanType === "annuity-loan-type") {
            summaryPayment.innerHTML = `
            <p> The monthly payment is <span> ${resultPMT} kr </span></p>
            <h4>Report:</h4>
            `;

            tableBody.innerHTML = `
                <table>
                <thead>
                <tr>
                    <th>Period</th>
                    <th>Monthly Payment</th>
                    <th>Total Cost</th>
                    <th>Interest Paid</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>${loanPeriod} years</td>   
                    <td>${resultPMT} kr</td>
                    <td>${(resultPMT * (loanPeriod * 12)).toLocaleString("no-NO")} kr</td>
                    <td>${((resultPMT * (loanPeriod * 12)) - loanAmount).toLocaleString("no-NO")} kr</td>
                </tr>
                </tbody>
                </table>
                `
        }
    }

    if (!loanAmount || !interestRate || !loanPeriod) {
        summaryPayment.innerHTML = "Please fill in all the required fields.";
        tableBody.innerHTML = "";
    } else if (loanAmount === "0" || interestRate === "0" || loanPeriod === "0") {
        summaryPayment.innerHTML = "The values must be above zero.";
        tableBody.innerHTML = "";
    } else {
        printResults();
    }
}

setInterestRate();

loanGoal.addEventListener("change", setInterestRate);
calculateButton.addEventListener("click", logPMT);