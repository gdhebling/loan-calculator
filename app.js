let loanType = document.getElementById("loan-type");

let loanAmount = document.getElementById("loan-amount");
let interestRate = document.getElementById("interest-rate");
let loanPeriod = document.getElementById("loan-period");

let calculateButton = document.getElementById("calculate-button")
console.log(loanType);

function calculateLoan() {
    console.log("Hi");
}

calculateButton.addEventListener("click", calculateLoan);