const calculateButton = document.getElementById("calculate-button");

let loanGoal = document.getElementById("loan-goal");
let loanAmount = document.getElementById("loan-amount");
let loanPeriod = document.getElementById("loan-period");

Number.prototype.toLocaleNorway = function () {
    return this.toLocaleString("no-NO", {
        style: "currency", currency: "NOK"
    });
};

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

    return Math.abs(pmt);
}

function serialLoan(rate, period, pv, instYr) {
    /* 
    rate:       interest rate per period
    period:     period of the loan (in years)
    pv:         present value or the loan amount
    instYr:     instalments per year, 12 if omitted

    numInst:    number of instalments
      */

    if (!instYr) instYr = 12;

    ratePerInst = rate / instYr;
    numInst = period * instYr;

    interest = pv * ratePerInst;
    repayment = pv / numInst;
    payment = repayment + interest;
    principal = (pv - repayment);

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
    const tableHeader = document.getElementById("table-header");
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
        tableHeader.innerHTML = "";
        tableBody.innerHTML = "";


        if (loanType === "serial-loan-type") {

            // Calculating Next Instalments for Serial Loan
            nextInstalments(
                interest,
                numInst,
                payment,
                repayment
            );

            function nextInstalments(interest, numInst, payment, repayment) {
                let instalmentArray = [];
                let interestArray = [];
                let principalArray = [];
                let repaymentArray = [];
                summaryPayment.innerHTML = `
                <p> Your first monthly payment is <span> ${payment.toLocaleNorway()} </span></p>
                <h4>Report:</h4>
                `;
                tableHeader.innerHTML = `
                    <tr>
                        <th>Period</th>
                        <th>Instalment</th>
                        <th>Interest</th>
                        <th>Repayment</th>
                        <th>Remain</th>
                    </tr>
                    `
                for (let i = 0; i < numInst; i++) {
                    if (i === 0) {
                        principal = principal;
                        interest = interest;
                        repayment = repayment;
                        payment = payment;

                        instalmentArray.push(payment);
                        interestArray.push(interest);
                        principalArray.push(principal);
                        repaymentArray.push(repayment);

                        tableBody.innerHTML += `
                        <tr>
                            <td>${i + 1}</td>   
                            <td>${payment.toLocaleNorway()}</td>
                            <td>${interest.toLocaleNorway()}</td>
                            <td>${repayment.toLocaleNorway()}</td>
                            <td>${principal.toLocaleNorway()}</td>
                        </tr>
                    `

                    } else {
                        interest = principal * ratePerInst;
                        repayment = repayment;
                        payment = repayment + interest;
                        principal = principal - repayment;

                        instalmentArray.push(payment);
                        interestArray.push(interest);
                        principalArray.push(principal);
                        repaymentArray.push(repayment);

                        tableBody.innerHTML += `
                            <tr>
                                <td>${i + 1}</td>   
                                <td>${payment.toLocaleNorway()}</td>
                                <td>${interest.toLocaleNorway()}</td>
                                <td>${repayment.toLocaleNorway()}</td>
                                <td>${principal.toLocaleNorway()}</td>
                            </tr>
                        `

                    }
                }
            }


        } else if (loanType === "annuity-loan-type") {
            summaryPayment.innerHTML = `
            <p> The monthly payment is <span> ${resultPMT.toLocaleNorway()}</span></p>
            <h4>Report:</h4>
            `;

            tableHeader.innerHTML = `
            <tr>
                <th>Period</th>
                <th>Fixed Monthly Payment</th>
                <th>Total Cost</th>
                <th>Total Interest Paid</th>
            </tr>
            `

            tableBody.innerHTML = `
            <tr>
                <td>${loanPeriod} years</td>   
                <td>${resultPMT.toLocaleNorway()}</td>
                <td>${(resultPMT * (loanPeriod * 12)).toLocaleNorway()}</td>
                <td>${((resultPMT * (loanPeriod * 12)) - loanAmount).toLocaleNorway()}</td>
            </tr>
            `
        }
    }

    if (!loanAmount || !interestRate || !loanPeriod) {
        summaryPayment.innerHTML = "Please fill in all the required fields.";
        tableHeader.innerHTML = "";
        tableBody.innerHTML = "";
    } else if (loanAmount === "0" || interestRate === "0" || loanPeriod === "0") {
        summaryPayment.innerHTML = "The values must be above zero.";
        tableHeader.innerHTML = "";
        tableBody.innerHTML = "";
    } else {
        printResults();
    }
}

setInterestRate();

loanGoal.addEventListener("change", setInterestRate);
calculateButton.addEventListener("click", logPMT);