// Utility functions for EMI and prepayment calculations will be moved here for modularity and testability.

export function calculateEMI({
  loanAmount,
  interestRate,
  tenure,
  tenureType,
  fee = 0,
  prepayments = []
}) {
  // Convert tenure to months
  let months = tenureType === 'years' ? tenure * 12 : tenure;
  let monthlyRate = interestRate / 12 / 100;
  let principal = loanAmount;
  let emi = 0;
  let originalEmi = 0;
  let totalInterest = 0;
  let totalOutflow = 0;
  let amortizationTable = [];
  let prepaymentImpact = {
    totalPrepaid: 0,
    totalPenalty: 0,
    monthsSaved: 0,
    interestSaved: 0,
  };

  // Prepare prepayment schedule
  // Each entry: { amount, frequency, startMonth, penalty }
  let prepaymentSchedule = [];
  prepayments.forEach(pp => {
    const { amount, frequency = 'one-time', startMonth = 1, penalty = 0 } = pp;
    if (frequency === 'one-time') {
      prepaymentSchedule.push({ month: startMonth, amount, penalty });
    } else if (frequency === 'monthly') {
      for (let m = startMonth; m <= months; m++) {
        prepaymentSchedule.push({ month: m, amount, penalty });
      }
    } else if (frequency === 'yearly') {
      for (let m = startMonth; m <= months; m += 12) {
        prepaymentSchedule.push({ month: m, amount, penalty });
      }
    }
  });
  // Sort by month
  prepaymentSchedule.sort((a, b) => a.month - b.month);

  // Remove duplicates (if multiple prepayments in same month, sum them)
  let mergedPrepayments = {};
  prepaymentSchedule.forEach(pp => {
    if (!mergedPrepayments[pp.month]) {
      mergedPrepayments[pp.month] = { amount: 0, penalty: 0 };
    }
    mergedPrepayments[pp.month].amount += Number(pp.amount);
    mergedPrepayments[pp.month].penalty += Number(pp.penalty);
  });

  // Calculate EMI (initial)
  emi = monthlyRate === 0
    ? principal / months
    : (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
  originalEmi = emi;

  let month = 1;
  let originalMonths = months;
  let originalTotalInterest = 0;
  let originalPrincipal = principal;
  let running = true;

  while (running && principal > 0.01 && month <= 1000) {
    let interest = principal * monthlyRate;
    let principalComponent = emi - interest;
    if (principalComponent > principal) principalComponent = principal;
    let prepay = mergedPrepayments[month] || { amount: 0, penalty: 0 };
    let prepayAmount = prepay.amount;
    let penaltyAmount = prepay.penalty;
    let totalPayment = emi + prepayAmount + penaltyAmount;
    let closingPrincipal = principal - principalComponent - prepayAmount;
    if (closingPrincipal < 0) {
      prepayAmount += closingPrincipal; // Reduce prepayment if overpaid
      closingPrincipal = 0;
    }
    amortizationTable.push({
      month,
      openingPrincipal: principal,
      emi,
      interest,
      principalComponent,
      prepayment: prepayAmount,
      penalty: penaltyAmount,
      totalPayment,
      closingPrincipal,
    });
    totalInterest += interest;
    totalOutflow += totalPayment;
    prepaymentImpact.totalPrepaid += prepayAmount;
    prepaymentImpact.totalPenalty += penaltyAmount;
    principal = closingPrincipal;
    // Recalculate EMI if principal reduced (except last payment)
    if (principal > 0.01 && prepayAmount > 0) {
      let remainingMonths = months - month;
      emi = monthlyRate === 0
        ? principal / remainingMonths
        : (principal * monthlyRate * Math.pow(1 + monthlyRate, remainingMonths)) /
          (Math.pow(1 + monthlyRate, remainingMonths) - 1);
    }
    if (principal <= 0.01) {
      running = false;
      // Fix off-by-one: months used is (month - 1)
      prepaymentImpact.monthsSaved = originalMonths - (month - 1);
      prepaymentImpact.interestSaved = (originalTotalInterest || (function() {
        // Calculate original total interest (no prepayments) using originalEmi
        let p = originalPrincipal;
        let ti = 0;
        let e = originalEmi;
        for (let m = 1; m <= originalMonths; m++) {
          let i = p * monthlyRate;
          let pc = e - i;
          if (pc > p) pc = p;
          ti += i;
          p -= pc;
          if (p <= 0.01) break;
        }
        return ti;
      })()) - totalInterest;
    }
    month++;
  }

  return {
    emi: Math.round(emi * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalOutflow: Math.round((totalOutflow + Number(fee)) * 100) / 100,
    amortizationTable,
    prepaymentImpact,
  };
}
