let calculateButton = document.getElementById("calculate-button");

// Getting the elements and their values, this will be used only for Calculate on Enter Key
let loanAmount = document.getElementById("loan-amount");
let interestRate = document.getElementById("interest-rate");
let loanPeriod = document.getElementById("loan-period");


/*
    The PMT formula is based on an Excel function
    
    JavaScript formula from ExcelFormulas.js
    Availability: https://gist.github.com/pies/4166888
*/

function PMT(rate, nper, pv, fv, type) {
    /*
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

function loanTypeRate() {
    let loanType = document.getElementById("loan-type");
    // let interestRate = document.getElementById("interest-rate");
    if (loanType.value === "housing") {
        console.log("=== It's housing yo!");
    } else if (loanType.value === "car") {
        console.log("=== It's car yo!");
    } else if (loanType.value === "spending") {
        console.log("=== It's spending yo!");
    } else {
        console.log("Please check the Loan Type.")
    }
}

function logPMT() {

    loanTypeRate();

    // Getting the elements and their values
    let loanAmount = document.getElementById("loan-amount").value;
    let interestRate = document.getElementById("interest-rate").value;
    let loanPeriod = document.getElementById("loan-period").value;
    let summaryPayment = document.getElementById("summary-payment");
    console.log("Loan amount: " + loanAmount);
    console.log("Interest Rate: " + interestRate);
    console.log("Loan Period: " + loanPeriod);

    if (loanAmount === "" || interestRate === "" || loanPeriod === "") {
        console.log("Please fill in all the fields.");
    } else if (loanAmount === "0" || interestRate === "0" || loanPeriod === "0") {
        console.log("Values must be above zero.");
    } else {

        summaryPayment.innerHTML = "The monthly payment is: " +
            PMT(
                ((interestRate / 100) / 12),
                (loanPeriod * 12),
                (loanAmount)
            ) + " kr";
    }
}

calculateButton.addEventListener("click", logPMT);

// [loanAmount, interestRate, loanPeriod].forEach(function (event) {
//     event.addEventListener("keyup", logPMT)
// })