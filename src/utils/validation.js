// Centralized validation logic for all input fields

export function validateLoanAmount(value) {
  const num = parseFloat(value);
  return !isNaN(num) && num > 0;
}

export function validateInterest(value) {
  const num = parseFloat(value);
  return !isNaN(num) && num >= 0;
}

export function validateTenure(value, tenureType) {
  const num = parseInt(value);
  return !isNaN(num) && num > 0 && num <= (tenureType === "years" ? 200 : 2400);
}

export function validateFee(value) {
  if (value === "") return true;
  const num = parseFloat(value);
  return !isNaN(num) && num >= 0;
}

export function validatePrepaymentMonth(value, tenure) {
  if (value === "") return true;
  const num = parseInt(value);
  const tenureNum = parseInt(tenure);
  return !isNaN(num) && num > 0 && num < tenureNum;
}

export function validatePrepaymentAmount(value) {
  if (value === "") return true;
  const num = parseFloat(value);
  return !isNaN(num) && num >= 0;
}

