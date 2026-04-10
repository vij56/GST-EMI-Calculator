import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, Pressable, Animated, Easing, StyleSheet, Dimensions, ScrollView, Platform } from "react-native";


const { width, height } = Dimensions.get("window");

const GST_RATES = [3, 5, 12, 18, 28];

function amountInWords(num) {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  if (num === 0) return "Zero";
  if (num > 99999999) return "Amount too large";
  let words = "";
  const intPart = Math.floor(num);
  const decimalPart = Math.round((num - intPart) * 100);
  let n = intPart;
  // Handle crores
  if (Math.floor(n / 10000000) > 0) {
    const crores = Math.floor(n / 10000000);
    if (crores < 20) {
      words += ones[crores] + " Crore ";
    } else {
      words += tens[Math.floor(crores / 10)];
      if (crores % 10 > 0) words += " " + ones[crores % 10];
      words += " Crore ";
    }
    n %= 10000000;
  }
  // Handle lakhs
  if (Math.floor(n / 100000) > 0) {
    const lakhs = Math.floor(n / 100000);
    if (lakhs < 20) {
      words += ones[lakhs] + " Lakh ";
    } else {
      words += tens[Math.floor(lakhs / 10)];
      if (lakhs % 10 > 0) words += " " + ones[lakhs % 10];
      words += " Lakh ";
    }
    n %= 100000;
  }
  // Handle thousands (including tens of thousands)
  if (Math.floor(n / 1000) > 0) {
    const thousands = Math.floor(n / 1000);
    if (thousands < 20) {
      words += ones[thousands] + " Thousand ";
    } else {
      words += tens[Math.floor(thousands / 10)];
      if (thousands % 10 > 0) words += " " + ones[thousands % 10];
      words += " Thousand ";
    }
    n %= 1000;
  }
  if (Math.floor(n / 100) > 0) {
    words += ones[Math.floor(n / 100)] + " Hundred ";
    n %= 100;
  }
  if (n > 0) {
    if (n < 20) words += ones[n];
    else {
      words += tens[Math.floor(n / 10)];
      if (n % 10 > 0) words += " " + ones[n % 10];
    }
  }
  words = words.trim();
  if (decimalPart > 0) {
    return words + " Rupees and " + (decimalPart < 20 ? ones[decimalPart] : tens[Math.floor(decimalPart / 10)] + (decimalPart % 10 > 0 ? " " + ones[decimalPart % 10] : "")) + " Paise Only";
  }
  return words + " Rupees Only";
}

// Shared button styles for consistency
const buttonBase = (isActive, isDark) => ({
  flex: 1,
  backgroundColor: isActive ? "#38bdf8" : isDark ? "#1e293b" : "#e0e7ef",
  borderRadius: 8,
  paddingVertical: 10,
  alignItems: "center"
});
const buttonText = (isActive, isDark) => ({
  color: isActive ? "#111" : isDark ? "#fff" : "#111",
  fontWeight: "bold"
});
const resetButton = isDark => ({
  backgroundColor: isDark ? "#0ea5e9" : "#38bdf8",
  borderRadius: 8,
  paddingVertical: 12,
  alignItems: "center",
  marginTop: 8
});
const resetButtonText = {
  color: "#fff",
  fontWeight: "bold"
};
const exportButton = {
  flex: 1,
  backgroundColor: "#38bdf8",
  borderRadius: 8,
  paddingVertical: 10,
  alignItems: "center"
};
const exportButtonText = {
  color: "#fff",
  fontWeight: "bold"
};

// Strictly uniform button styles for all major action buttons
const uniformButton = (isActive, isDark) => ({
  flex: 1,
  backgroundColor: isActive ? "#38bdf8" : isDark ? "#1e293b" : "#e0e7ef",
  borderRadius: 8,
  paddingVertical: 12,
  alignItems: "center",
  marginHorizontal: 2
});
const uniformButtonText = (isActive, isDark) => ({
  color: isActive ? "#111" : isDark ? "#fff" : "#111",
  fontWeight: "bold",
  fontSize: 16
});
const uniformButtonSolid = {
  flex: 1,
  backgroundColor: "#38bdf8",
  borderRadius: 8,
  paddingVertical: 12,
  alignItems: "center",
  marginHorizontal: 2
};
const uniformButtonSolidText = {
  color: "#fff",
  fontWeight: "bold",
  fontSize: 16
};



export default function App() {
  // Animated background
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 4000, easing: Easing.inOut(Easing.cubic), useNativeDriver: false }),
        Animated.timing(anim, { toValue: 0, duration: 4000, easing: Easing.inOut(Easing.cubic), useNativeDriver: false })
      ])
    ).start();
  }, []);
  const bgTranslate = anim.interpolate({ inputRange: [0, 1], outputRange: [-height * 0.2, height * 0.2] });

  // Theme
  const [theme, setTheme] = useState("dark");
  const isDark = theme === "dark";

  // Tabs
  const [tab, setTab] = useState("GST");

  // GST Calculator state
  const [amount, setAmount] = useState("");
  const [gstRate, setGstRate] = useState("");
  const [gstType, setGstType] = useState("add"); // add or incl
  const [splitType, setSplitType] = useState("none"); // none, igst, or cgst
  // GST validation
  const amountNum = parseFloat(amount);
  const gstRateNum = parseFloat(gstRate);
  const isAmountValid = !isNaN(amountNum) && amountNum > 0;
  const isGstRateValid = !isNaN(gstRateNum) && gstRateNum > 0;
  const isGstTypeValid = gstType === "add" || gstType === "incl";
  const isSplitTypeValid = ["none", "igst", "cgst"].includes(splitType);
  const allGSTValid = isAmountValid && isGstRateValid && isGstTypeValid && isSplitTypeValid;

  // Export count (mocked)
  const [exportsLeft, setExportsLeft] = useState(2);

  // Calculations
  const amt = isAmountValid ? amountNum : 0;
  const gstR = isGstRateValid ? gstRateNum : 0;
  let taxable = gstType === "add" ? amt : (gstR > 0 ? amt / (1 + gstR / 100) : 0);
  let gstAmt = taxable * (gstR / 100);
  let igst = splitType === "igst" ? gstAmt : splitType === "cgst" ? gstAmt / 2 : 0;
  let cgst = splitType === "cgst" ? gstAmt / 2 : 0;
  let sgst = splitType === "cgst" ? gstAmt / 2 : 0;
  let finalAmt = gstType === "add" ? taxable + gstAmt : amt;

  // Reset
  function resetGST() {
    setAmount("");
    setGstRate(28);
    setGstType("add");
    setSplitType("igst");
  }



  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#111827" : "#f3f4f6" }}>
      {/* Animated BG */}
      <Animated.View style={{
        position: "absolute", top: bgTranslate, right: -width * 0.2, width: width * 1.2, height: width * 1.2, borderRadius: width * 0.6,
        backgroundColor: isDark ? "#2563eb" : "#a5b4fc", opacity: 0.18,
        zIndex: 0,
      }} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View style={{ marginTop: 48, marginBottom: 8, alignItems: "flex-start", paddingHorizontal: 24 }}>
          <Text style={{ fontSize: 32, fontWeight: "bold", color: isDark ? "#fff" : "#111" }}>{`GST + EMI\nCalculator`}</Text>
          <Text style={{ color: isDark ? "#cbd5e1" : "#334155", fontSize: 16, marginTop: 4 }}>
            Fast, accurate, and built for Indian billing + loan planning.
          </Text>
        </View>
        {/* Light/Dark toggle */}
        <Pressable
          style={{ position: "absolute", top: 48, right: 24, backgroundColor: isDark ? "#1e293b" : "#e0e7ef", borderRadius: 16, padding: 12 }}
          onPress={() => setTheme(isDark ? "light" : "dark")}
        >
          <Text style={{ color: isDark ? "#fff" : "#111", fontWeight: "bold" }}>{isDark ? "Light" : "Dark"}</Text>
        </Pressable>
        {/* Free Plan Card */}
        <View style={{ backgroundColor: isDark ? "#1e293b" : "#fff", borderRadius: 16, margin: 24, marginTop: 16, padding: 16, borderWidth: 1, borderColor: isDark ? "#2563eb33" : "#a5b4fc", shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ color: isDark ? "#fff" : "#111", fontWeight: "bold" }}>Free Plan</Text>
            <Text style={{ color: "#2dd4bf", fontWeight: "bold" }}>{exportsLeft} exports left today</Text>
          </View>
          <Text style={{ color: isDark ? "#cbd5e1" : "#334155", marginTop: 4, marginBottom: 12 }}>
            Free exports include first 24 rows. Upgrade for unlimited full exports and ad-free use.
          </Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <Pressable style={{ backgroundColor: "#38bdf8", borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16, marginRight: 8 }} onPress={() => {}}>
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Upgrade to Pro</Text>
            </Pressable>
            <Pressable style={{ backgroundColor: isDark ? "#334155" : "#e0e7ef", borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16 }} onPress={() => {}}>
              <Text style={{ color: isDark ? "#fff" : "#111", fontWeight: "bold" }}>Restore</Text>
            </Pressable>
          </View>
        </View>
        {/* Tabs */}
        <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 12, gap: 8 }}>
           {['GST', 'EMI', 'TAX'].map(t => (
             <Pressable
               key={t}
               onPress={() => setTab(t)}
               style={{ backgroundColor: tab === t ? "#38bdf8" : isDark ? "#1e293b" : "#e0e7ef", borderRadius: 12, paddingVertical: 8, paddingHorizontal: 32, marginHorizontal: 4 }}
             >
               <Text style={{ color: tab === t ? "#111" : isDark ? "#fff" : "#111", fontWeight: "bold" }}>{t}</Text>
             </Pressable>
           ))}
         </View>

         {/* GST Calculator */}
         {tab === "GST" && (
           <View style={{ backgroundColor: isDark ? "#1e293b" : "#fff", borderRadius: 16, margin: 24, marginTop: 0, padding: 16, borderWidth: 1, borderColor: isDark ? "#2563eb33" : "#a5b4fc", shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8 }}>
             <Text style={{ color: isDark ? "#fff" : "#111", fontWeight: "bold", fontSize: 20 }}>GST Calculator</Text>
             {/* Inputs */}
              <View style={{ backgroundColor: isDark ? "#0f172a" : "#f1f5f9", borderRadius: 8, padding: 8, marginTop: 8, marginBottom: 8, minHeight: 60 }}>
                <Text style={{ color: isDark ? "#cbd5e1" : "#334155" }}>Amount (INR)</Text>
                <TextInput value={amount} onChangeText={setAmount} keyboardType="numeric" style={{ backgroundColor: 'transparent', color: isDark ? "#fff" : "#111", borderRadius: 8, padding: 12, marginTop: 4, fontSize: 18, fontWeight: "bold" }} />
                {!isAmountValid && amount !== "" && (
                  <Text style={{ color: 'red', fontSize: 12 }}>Enter a valid amount &gt; 0</Text>
                )}
              </View>
               <View style={{ backgroundColor: isDark ? "#0f172a" : "#f1f5f9", borderRadius: 8, padding: 8, marginTop: 8, marginBottom: 8, minHeight: 60 }}>
                 <Text style={{ color: isDark ? "#cbd5e1" : "#334155" }}>GST Rate (%)</Text>
                 <TextInput
                   value={gstRate}
                   onChangeText={text => {
                     // Allow only numbers and max 3 digits
                     const sanitized = text.replace(/[^0-9]/g, '').slice(0, 3);
                     setGstRate(sanitized);
                   }}
                   keyboardType="numeric"
                   maxLength={3}
                   style={{ backgroundColor: 'transparent', color: isDark ? "#fff" : "#111", borderRadius: 8, padding: 12, marginTop: 4, fontSize: 18, fontWeight: "bold" }}
                 />
                 {!isGstRateValid && gstRate !== "" && (
                   <Text style={{ color: 'red', fontSize: 12 }}>Enter a valid GST rate &gt; 0</Text>
                 )}
               </View>
             <View style={{ backgroundColor: isDark ? "#0f172a" : "#f1f5f9", borderRadius: 8, padding: 8, marginTop: 8, marginBottom: 8, minHeight: 60 }}>
               <Text style={{ color: isDark ? "#cbd5e1" : "#334155" }}>GST Type</Text>
               <View style={{ flexDirection: "row", gap: 8, marginTop: 4 }}>
                 <Pressable onPress={() => setGstType("add")} style={buttonBase(gstType === "add", isDark)}>
                   <Text style={buttonText(gstType === "add", isDark)}>Add</Text>
                 </Pressable>
                 <Pressable onPress={() => setGstType("incl")} style={buttonBase(gstType === "incl", isDark)}>
                   <Text style={buttonText(gstType === "incl", isDark)}>Included</Text>
                 </Pressable>
               </View>
             </View>
              <View style={{ backgroundColor: isDark ? "#0f172a" : "#f1f5f9", borderRadius: 8, padding: 8, marginTop: 8, marginBottom: 8, minHeight: 60 }}>
                <Text style={{ color: isDark ? "#cbd5e1" : "#334155" }}>Split Type</Text>
                <View style={{ flexDirection: "row", gap: 8, marginTop: 4 }}>
                  <Pressable onPress={() => setSplitType("none")} style={buttonBase(splitType === "none", isDark)}>
                    <Text style={buttonText(splitType === "none", isDark)}>No Split</Text>
                  </Pressable>
                  <Pressable onPress={() => setSplitType("igst")} style={buttonBase(splitType === "igst", isDark)}>
                    <Text style={buttonText(splitType === "igst", isDark)}>IGST</Text>
                  </Pressable>
                  <Pressable onPress={() => setSplitType("cgst")} style={buttonBase(splitType === "cgst", isDark)}>
                    <Text style={buttonText(splitType === "cgst", isDark)}>CGST+SGST</Text>
                  </Pressable>
                </View>
              </View>
              {/* Results - only show if all required fields are valid */}
              {allGSTValid && (
                <View style={{ backgroundColor: isDark ? "#0f172a" : "#f1f5f9", borderRadius: 12, padding: 12, marginTop: 16, minHeight: 180 }}>
                  <Text style={{ color: isDark ? "#fff" : "#111", fontWeight: "bold", marginBottom: 4, fontSize: 16 }}>GST Calculation</Text>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                    <Text style={{ color: isDark ? "#cbd5e1" : "#334155" }}>Taxable Amount</Text>
                    <Text style={{ color: isDark ? "#fff" : "#111", fontWeight: "bold" }}>₹{taxable.toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
                  </View>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                    <Text style={{ color: isDark ? "#cbd5e1" : "#334155" }}>GST Amount</Text>
                    <Text style={{ color: isDark ? "#fff" : "#111", fontWeight: "bold" }}>₹{gstAmt.toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
                  </View>
                  {splitType === "igst" && (
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                      <Text style={{ color: isDark ? "#cbd5e1" : "#334155" }}>IGST</Text>
                      <Text style={{ color: isDark ? "#fff" : "#111", fontWeight: "bold" }}>₹{igst.toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
                    </View>
                  )}
                  {splitType === "cgst" && (
                    <>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                        <Text style={{ color: isDark ? "#cbd5e1" : "#334155" }}>CGST</Text>
                        <Text style={{ color: isDark ? "#fff" : "#111", fontWeight: "bold" }}>₹{cgst.toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
                      </View>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                        <Text style={{ color: isDark ? "#cbd5e1" : "#334155" }}>SGST</Text>
                        <Text style={{ color: isDark ? "#fff" : "#111", fontWeight: "bold" }}>₹{sgst.toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
                      </View>
                    </>
                  )}
                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                    <Text style={{ color: isDark ? "#cbd5e1" : "#334155" }}>Final Amount</Text>
                    <Text style={{ color: isDark ? "#fff" : "#111", fontWeight: "bold" }}>₹{finalAmt.toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
                  </View>
                  {finalAmt > 0 && (
                    <Text style={{ color: "#22d3ee", fontStyle: "italic", marginTop: 2, fontSize: 13 }}>
                      {amountInWords(finalAmt)}
                    </Text>
                  )}
                </View>
              )}
             {/* Reset Button */}
             <Pressable onPress={resetGST} style={resetButton(isDark)}>
               <Text style={resetButtonText}>Reset GST Fields</Text>
             </Pressable>
           </View>
         )}
         {/* EMI Calculator */}
                {tab === "EMI" && (
                   <EMICalculatorCard isDark={isDark} />
                )}
         {/* Tax Estimator */}
         {tab === "TAX" && (
           <TaxEstimatorCard isDark={isDark} />
         )}
       </ScrollView>
     </View>
   );
  }

    // EMI Calculator Card Component
    function EMICalculatorCard({ isDark }) {
                  // Prepayment toggle state
                  const [prepaymentOn, setPrepaymentOn] = useState(false);
      // Validation state
      const [errors, setErrors] = useState({});
  // State
  const [loanAmount, setLoanAmount] = useState("");
  const [interest, setInterest] = useState("");
  const [tenure, setTenure] = useState("");
  const [tenureType, setTenureType] = useState("years");
  const [fee, setFee] = useState("");
  const [prepayMonth, setPrepayMonth] = useState("");
  const [prepayAmt, setPrepayAmt] = useState("");

  // --- Validations ---
  const loanAmountNum = parseFloat(loanAmount);
  const interestNum = parseFloat(interest);
  const tenureNum = parseInt(tenure);
  const feeNum = parseFloat(fee);
  const prepayMonthNum = parseInt(prepayMonth);
  const prepayAmtNum = parseFloat(prepayAmt);
  const isLoanAmountValid = !isNaN(loanAmountNum) && loanAmountNum > 0;
  const isInterestValid = !isNaN(interestNum) && interestNum >= 0;
  const isTenureValid = !isNaN(tenureNum) && tenureNum > 0 && tenureNum <= (tenureType === "years" ? 200 : 2400);
  const isFeeValid = fee === "" || (!isNaN(feeNum) && feeNum >= 0);
  const isPrepayMonthValid = prepayMonth === "" || (!isNaN(prepayMonthNum) && prepayMonthNum > 0 && prepayMonthNum < tenureNum);
  const isPrepayAmtValid = prepayAmt === "" || (!isNaN(prepayAmtNum) && prepayAmtNum >= 0);
  const allRequiredValid = isLoanAmountValid && isInterestValid && isTenureValid && isFeeValid && isPrepayMonthValid && isPrepayAmtValid;

  // --- Calculations always up-to-date with latest state ---
  // Only calculate if all required fields are valid
  const P = isLoanAmountValid ? loanAmountNum : 0;
  const annualRate = isInterestValid ? interestNum : 0;
  const n = isTenureValid ? (tenureNum * (tenureType === "years" ? 12 : 1)) : 0;
  const r = annualRate / 12 / 100;
  const procFee = isFeeValid && fee !== "" ? (feeNum / 100 * P) : 0;
  // EMI Formula (unrounded for totals)
  let emiUnrounded = 0;
  if (P > 0 && n > 0) {
    emiUnrounded = r === 0 ? (P / n) : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }
  // Displayed EMI (rounded for clarity)
  const emi = Math.round(emiUnrounded * 100) / 100;

  // Prepayment logic
  const prepay = isPrepayAmtValid && prepayAmt !== "" ? prepayAmtNum : 0;
  const prepayM = isPrepayMonthValid && prepayMonth !== "" ? prepayMonthNum : 0;
  let newN = n;
  let interestSaved = 0;
  if (prepay > 0 && prepayM > 0 && prepayM < n) {
    let balance = P;
    for (let i = 1; i <= prepayM; i++) {
      const intPart = balance * r;
      const prinPart = emiUnrounded - intPart;
      balance -= prinPart;
    }
    balance -= prepay;
    let tempN = 0;
    let tempBal = balance;
    while (tempBal > 0 && tempN < 1000) {
      const intPart = tempBal * r;
      const prinPart = emiUnrounded - intPart;
      tempBal -= prinPart;
      tempN++;
    }
    newN = prepayM + tempN;
    interestSaved = emiUnrounded * n - emiUnrounded * newN;
  }

  // Amortization Table (first 6 months)
  let amort = [];
  if (P > 0 && n > 0) {
    let bal = P;
    for (let i = 1; i <= 6; i++) {
      const intPart = bal * r;
      const prinPart = emiUnrounded - intPart;
      bal -= prinPart;
      amort.push({
        m: i,
        emi: emiUnrounded,
        int: intPart,
        prin: prinPart,
        bal: Math.max(bal, 0),
      });
    }
  }
  // Reset
  function resetEMI() {
    setLoanAmount("");
    setInterest("");
    setTenure("");
    setTenureType("years");
    setFee("");
    setPrepayMonth("");
    setPrepayAmt("");
    setErrors({});
  }
  return (
    <View style={{ backgroundColor: isDark ? "#1e293b" : "#fff", borderRadius: 16, margin: 24, marginTop: 0, padding: 16, borderWidth: 1, borderColor: isDark ? "#2563eb33" : "#a5b4fc", shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8 }}>
      {/* Prepayment On/Off Toggle - always visible at the top */}
      <View style={{ alignItems: 'center', marginVertical: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
          <Pressable
            onPress={() => setPrepaymentOn(false)}
            style={{
              flex: 1,
              backgroundColor: !prepaymentOn ? '#38bdf8' : (isDark ? '#1e293b' : '#e0e7ef'),
              borderRadius: 8,
              paddingVertical: 10,
              alignItems: 'center',
              marginRight: 4,
              borderWidth: !prepaymentOn ? 2 : 1,
              borderColor: !prepaymentOn ? '#2563eb' : (isDark ? '#334155' : '#cbd5e1')
            }}
          >
            <Text style={{ color: !prepaymentOn ? '#111' : (isDark ? '#fff' : '#111'), fontWeight: 'bold' }}>Prepayment: Off</Text>
          </Pressable>
          <Pressable
            onPress={() => setPrepaymentOn(true)}
            style={{
              flex: 1,
              backgroundColor: prepaymentOn ? '#38bdf8' : (isDark ? '#1e293b' : '#e0e7ef'),
              borderRadius: 8,
              paddingVertical: 10,
              alignItems: 'center',
              marginLeft: 4,
              borderWidth: prepaymentOn ? 2 : 1,
              borderColor: prepaymentOn ? '#2563eb' : (isDark ? '#334155' : '#cbd5e1')
            }}
          >
            <Text style={{ color: prepaymentOn ? '#111' : (isDark ? '#fff' : '#111'), fontWeight: 'bold' }}>Prepayment: On</Text>
          </Pressable>
        </View>
        {/* DEBUG: Show prepaymentOn state */}
        <Text style={{ color: '#f87171', marginTop: 4, fontSize: 12 }}>DEBUG: prepaymentOn = {String(prepaymentOn)}</Text>
      </View>
      <Text style={{ color: isDark ? "#fff" : "#111", fontWeight: "bold", fontSize: 20 }}>EMI Calculator</Text>
      {/* Inputs */}
      <View style={{ backgroundColor: isDark ? "#0f172a" : "#f1f5f9", borderRadius: 8, padding: 8, marginTop: 8, marginBottom: 8, minHeight: 60 }}>
        <Text style={{ color: isDark ? "#cbd5e1" : "#334155" }}>Loan Amount (INR)</Text>
        <TextInput value={loanAmount} onChangeText={setLoanAmount} keyboardType="numeric" style={{ backgroundColor: 'transparent', color: isDark ? "#fff" : "#111", borderRadius: 8, padding: 12, marginTop: 4, fontSize: 18, fontWeight: "bold" }} placeholder="" />
        {!isLoanAmountValid && loanAmount !== "" && (
          <Text style={{ color: 'red', fontSize: 12 }}>Enter a valid loan amount &gt; 0</Text>
        )}
      </View>
      <View style={{ backgroundColor: isDark ? "#0f172a" : "#f1f5f9", borderRadius: 8, padding: 8, marginTop: 8, marginBottom: 8, minHeight: 60 }}>
        <Text style={{ color: isDark ? "#cbd5e1" : "#334155" }}>Annual Interest (%)</Text>
        <TextInput value={interest} onChangeText={setInterest} keyboardType="numeric" style={{ backgroundColor: 'transparent', color: isDark ? "#fff" : "#111", borderRadius: 8, padding: 12, marginTop: 4, fontSize: 18, fontWeight: "bold" }} placeholder="" />
        {!isInterestValid && interest !== "" && (
          <Text style={{ color: 'red', fontSize: 12 }}>Enter a valid interest rate (0 or more)</Text>
        )}
      </View>
       {/* Years/Months toggle - moved above Tenure input */}
       <View style={{ flexDirection: "row", gap: 8, marginVertical: 8 }}>
         <Pressable onPress={() => setTenureType("years")} style={uniformButton(tenureType === "years", isDark)}>
           <Text style={uniformButtonText(tenureType === "years", isDark)}>Years</Text>
         </Pressable>
         <Pressable onPress={() => setTenureType("months")} style={uniformButton(tenureType === "months", isDark)}>
           <Text style={uniformButtonText(tenureType === "months", isDark)}>Months</Text>
         </Pressable>
       </View>
       <View style={{ backgroundColor: isDark ? "#0f172a" : "#f1f5f9", borderRadius: 8, padding: 8, marginTop: 8, marginBottom: 8, minHeight: 60 }}>
         <View style={{ minHeight: 88, justifyContent: 'flex-start' }}>
           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
             <Text style={{ color: isDark ? "#cbd5e1" : "#334155" }}>
               {tenureType === "years" ? "Tenure (Years)" : "Tenure (Months)"}
             </Text>
             {!isTenureValid && tenure !== "" && (
               <Text style={{ color: 'red', marginLeft: 8, fontSize: 12 }}>
                 {tenureType === "years"
                   ? "Enter a valid tenure (1-200 years)"
                   : "Enter a valid tenure (1-2400 months)"}
               </Text>
             )}
           </View>
           <View style={{ flex: 1, justifyContent: 'center' }}>
             <TextInput
               value={tenure}
               onChangeText={text => {
                 // Allow only numbers and max 3 digits
                 const sanitized = text.replace(/[^0-9]/g, '').slice(0, 4);
                 setTenure(sanitized);
               }}
               keyboardType="numeric"
               maxLength={4}
               style={{
                 backgroundColor: 'transparent',
                 color: isDark ? "#fff" : "#111",
                 borderRadius: 8,
                 padding: 12,
                 fontSize: 18,
                 fontWeight: "bold"
               }}
               placeholder=""
             />
           </View>
         </View>
       </View>
      <View style={{ backgroundColor: isDark ? "#0f172a" : "#f1f5f9", borderRadius: 8, padding: 8, marginTop: 8, marginBottom: 8, minHeight: 60 }}>
        <Text style={{ color: isDark ? "#cbd5e1" : "#334155" }}>Processing Fee (%)</Text>
        <TextInput value={fee} onChangeText={setFee} keyboardType="numeric" style={{ backgroundColor: 'transparent', color: isDark ? "#fff" : "#111", borderRadius: 8, padding: 12, marginTop: 4, fontSize: 18, fontWeight: "bold" }} placeholder="" />
      </View>
      {/* Show prepayment fields only if prepaymentOn is true */}
      {prepaymentOn && (
        <>
          <View style={{ backgroundColor: isDark ? "#0f172a" : "#f1f5f9", borderRadius: 8, padding: 8, marginTop: 8, marginBottom: 8, minHeight: 60 }}>
            <Text style={{ color: isDark ? "#cbd5e1" : "#334155" }}>One-time Prepayment Month</Text>
            <Text style={{ color: isDark ? "#38bdf8" : "#2563eb", fontSize: 13, marginTop: 2, marginBottom: 2 }}>
              add a month number when you plan to make an extra payment [eg., 3. it means you’ll make the extra payment in March (3rd month)]
            </Text>
            <TextInput value={prepayMonth} onChangeText={setPrepayMonth} keyboardType="numeric" style={{ backgroundColor: 'transparent', color: isDark ? "#fff" : "#111", borderRadius: 8, padding: 12, marginTop: 4, fontSize: 18, fontWeight: "bold" }} placeholder="" />
          </View>
          <View style={{ backgroundColor: isDark ? "#0f172a" : "#f1f5f9", borderRadius: 8, padding: 8, marginTop: 8, marginBottom: 8, minHeight: 60 }}>
            <Text style={{ color: isDark ? "#cbd5e1" : "#334155" }}>One-time Prepayment Amount (INR)</Text>
            <TextInput value={prepayAmt} onChangeText={setPrepayAmt} keyboardType="numeric" style={{ backgroundColor: 'transparent', color: isDark ? "#fff" : "#111", borderRadius: 8, padding: 12, marginTop: 4, fontSize: 18, fontWeight: "bold" }} placeholder="" />
          </View>
        </>
      )}
       {/* ...existing code... */}
      {/* EMI Results - only show if all required fields are valid */}
      {allRequiredValid && (
        <View style={{ backgroundColor: isDark ? "#0f172a" : "#f1f5f9", borderRadius: 12, padding: 12, marginVertical: 8 }}>
          <Text style={{ color: isDark ? "#fff" : "#111", fontWeight: "bold", marginBottom: 4, fontSize: 16 }}>Monthly EMI</Text>
          {/* Displayed EMI is rounded for clarity */}
          <Text style={{ color: "#38bdf8", fontWeight: "bold", fontSize: 18, marginBottom: 6 }}>₹{emi.toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ color: isDark ? "#cbd5e1" : "#334155" }}>Loan Tenure</Text>
            <Text style={{ color: isDark ? "#fff" : "#111" }}>{n} months</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ color: isDark ? "#cbd5e1" : "#334155" }}>Total Interest</Text>
            <Text style={{ color: isDark ? "#fff" : "#111" }}>₹{(emiUnrounded * n - P).toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ color: isDark ? "#cbd5e1" : "#334155" }}>Total Repayment</Text>
            <Text style={{ color: isDark ? "#fff" : "#111" }}>₹{(emiUnrounded * n).toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ color: isDark ? "#cbd5e1" : "#334155" }}>Processing Fee</Text>
            <Text style={{ color: isDark ? "#fff" : "#111" }}>₹{procFee.toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 4 }}>
            <Text style={{ color: "#22d3ee", fontWeight: "bold" }}>Total Outflow</Text>
            <Text style={{ color: "#22d3ee", fontWeight: "bold", fontSize: 16 }}>₹{(emiUnrounded * n + procFee).toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
          </View>
          {(emiUnrounded * n + procFee) > 0 && (
            <Text style={{ color: "#22d3ee", fontStyle: "italic", marginTop: 2, fontSize: 13 }}>
              {amountInWords(emiUnrounded * n + procFee)}
            </Text>
          )}
        </View>
      )}
      {/* Prepayment Impact - show if prepaymentOn is true, show message if fields missing */}
      {prepaymentOn && (
        <View style={{ backgroundColor: isDark ? "#0f172a" : "#f1f5f9", borderRadius: 12, padding: 12, marginVertical: 8 }}>
          <Text style={{ color: isDark ? "#fff" : "#111", fontWeight: "bold", marginBottom: 4 }}>Prepayment Impact</Text>
          {allRequiredValid ? (
            <>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ color: isDark ? "#cbd5e1" : "#334155" }}>Prepayment Applied</Text>
                <Text style={{ color: isDark ? "#fff" : "#111" }}>₹{prepay.toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ color: isDark ? "#cbd5e1" : "#334155" }}>New Tenure</Text>
                <Text style={{ color: isDark ? "#fff" : "#111" }}>{Math.round(newN)} months</Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ color: isDark ? "#cbd5e1" : "#334155" }}>Tenure Saved</Text>
                <Text style={{ color: isDark ? "#fff" : "#111" }}>{Math.round(n - newN)} months</Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ color: isDark ? "#cbd5e1" : "#334155" }}>Interest Saved</Text>
                <Text style={{ color: "#38bdf8", fontWeight: "bold" }}>₹{interestSaved.toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
              </View>
            </>
          ) : (
            <Text style={{ color: '#f87171', marginTop: 8 }}>
              Please fill all required fields to see prepayment impact.
            </Text>
          )}
        </View>
      )}
      {/* Export Buttons */}
      <View style={{ flexDirection: "row", gap: 8, marginVertical: 8 }}>
        <Pressable
          style={uniformButtonSolid}
          onPress={async () => {
            // TODO: Insert CSV export logic here
          }}
        >
          <Text style={uniformButtonSolidText}>Export CSV</Text>
        </Pressable>
        <Pressable
          style={uniformButtonSolid}
          onPress={async () => {
            // TODO: Insert PDF export logic here
          }}
        >
          <Text style={uniformButtonSolidText}>Export PDF</Text>
        </Pressable>
      </View>
      {/* Amortization Table */}
      <View style={{ backgroundColor: isDark ? "#0f172a" : "#f1f5f9", borderRadius: 12, padding: 12, marginVertical: 8 }}>
        <Text style={{ color: isDark ? "#fff" : "#111", fontWeight: "bold", marginBottom: 4, fontSize: 16 }}>First 6 Months Amortization</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
          <Text style={{ color: isDark ? "#cbd5e1" : "#334155", width: 60 }}>Month</Text>
          <Text style={{ color: isDark ? "#cbd5e1" : "#334155", width: 80 }}>Payment</Text>
          <Text style={{ color: isDark ? "#cbd5e1" : "#334155", width: 60 }}>Interest</Text>
          <Text style={{ color: isDark ? "#cbd5e1" : "#334155", width: 80 }}>Balance</Text>
        </View>
        {amort.map((row, idx) => (
          <View key={idx} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
            <Text style={{ color: isDark ? "#fff" : "#111", width: 60 }}>M{row.m}</Text>
            {/* Show EMI as rounded for display in amortization table */}
            <Text style={{ color: isDark ? "#fff" : "#111", width: 80 }}>₹{(Math.round(row.emi * 100) / 100).toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
            <Text style={{ color: isDark ? "#fff" : "#111", width: 60 }}>₹{row.int.toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
            <Text style={{ color: isDark ? "#fff" : "#111", width: 80 }}>₹{row.bal.toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
          </View>
        ))}
      </View>
      {/* Reset Button */}
      <Pressable onPress={resetEMI} style={resetButton(isDark)}>
        <Text style={resetButtonText}>Reset EMI Fields</Text>
      </Pressable>
    </View>
  );
}

// Tax Estimator Card Component
function TaxEstimatorCard({ isDark }) {
  // State
  const [income, setIncome] = useState("");
  const [deductions, setDeductions] = useState("");
  // Validation
  const incomeNum = parseFloat(income);
  const isIncomeValid = !isNaN(incomeNum) && incomeNum > 0;
  // Deductions: allow empty, or comma-separated numbers >= 0
  let deductionsValid = true;
  if (deductions !== "") {
    deductionsValid = deductions.split(',').every(d => {
      const n = parseFloat(d);
      return !isNaN(n) && n >= 0;
    });
  }
  const allTaxValid = isIncomeValid && deductionsValid;

  // FY 2023-24 New Regime Tax Slabs
  const taxSlabs = [
    { from: 0, to: 300000, rate: 0 },
    { from: 300000, to: 600000, rate: 0.05 },
    { from: 600000, to: 900000, rate: 0.1 },
    { from: 900000, to: 1200000, rate: 0.15 },
    { from: 1200000, to: 1500000, rate: 0.2 },
    { from: 1500000, rate: 0.3 },
  ];
  // For new regime, just use total income field
  const totalIncome = isIncomeValid ? incomeNum : 0;
  // Robust deduction parsing (clarify only NPS employer contribution allowed in new regime)
  const totalDeductions = deductionsValid && deductions !== "" ? (deductions.match(/\d+/g) || []).reduce((a, b) => parseFloat(a) + parseFloat(b), 0) : 0;
  const taxableIncome = Math.max(0, totalIncome - totalDeductions);
  let taxAmount = 0;
  let prevTo = 0;
  for (const slab of taxSlabs) {
    if (taxableIncome <= slab.from) break;
    const to = slab.to || taxableIncome;
    taxAmount += (Math.min(to, taxableIncome) - Math.max(prevTo, slab.from)) * slab.rate;
    prevTo = to;
  }
  // Section 87A rebate: If taxable income <= 7 lakh, tax = 0
  let rebate = 0;
  if (taxableIncome <= 700000) {
    rebate = taxAmount;
    taxAmount = 0;
  }
  // 4% Health & Education Cess
  const cess = taxAmount * 0.04;
  const totalTax = taxAmount + cess;
  const netIncome = totalIncome - totalTax;

  // Reset
  function resetTax() {
    setIncome("");
    setDeductions("");
  }

  return (
    <View style={{ backgroundColor: isDark ? "#1e293b" : "#fff", borderRadius: 16, margin: 24, marginTop: 0, padding: 16, borderWidth: 1, borderColor: isDark ? "#2563eb33" : "#a5b4fc", shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8 }}>
      <Text style={{ color: isDark ? "#fff" : "#111", fontWeight: "bold", fontSize: 20 }}>Tax Estimator</Text>
      {/* Inputs */}
      <Text style={{ color: isDark ? "#cbd5e1" : "#334155", marginTop: 8 }}>Total Income (INR)</Text>
      <TextInput value={income} onChangeText={setIncome} keyboardType="numeric" style={{ backgroundColor: isDark ? "#0f172a" : "#f1f5f9", color: isDark ? "#fff" : "#111", borderRadius: 8, padding: 12, marginTop: 4, fontSize: 18, fontWeight: "bold" }} />
      {!isIncomeValid && income !== "" && (
        <Text style={{ color: 'red', fontSize: 12 }}>Enter a valid income &gt; 0</Text>
      )}
      <Text style={{ color: isDark ? "#cbd5e1" : "#334155", marginTop: 8 }}>Deductions (Only NPS employer contribution allowed in New Regime)</Text>
      <TextInput
        value={deductions}
        onChangeText={text => {
          // Allow only numbers and commas
          const sanitized = text.replace(/[^0-9,]/g, '');
          setDeductions(sanitized);
        }}
        style={{ backgroundColor: isDark ? "#0f172a" : "#f1f5f9", color: isDark ? "#fff" : "#111", borderRadius: 8, padding: 12, marginTop: 4, fontSize: 14, fontWeight: "bold" }}
        placeholder="Enter NPS deduction (eg., 50000)"
        placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
      />
      {!deductionsValid && deductions !== "" && (
        <Text style={{ color: 'red', fontSize: 12 }}>Enter valid deduction(s) (comma-separated, each ≥ 0)</Text>
      )}
      {/* Results section - only show if all required fields are valid */}
      {allTaxValid && (
        <View style={{ gap: 16, marginTop: 16 }}>
          {/* Main scenario results (tax only) */}
          <Text style={{ color: isDark ? "#fff" : "#111", fontWeight: "bold", marginBottom: 4, fontSize: 16 }}>Tax Calculation</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
            <Text style={{ color: isDark ? "#cbd5e1" : "#334155" }}>Taxable Income</Text>
            <Text style={{ color: isDark ? "#fff" : "#111", fontWeight: "bold" }}>₹{taxableIncome.toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
            <Text style={{ color: isDark ? "#cbd5e1" : "#334155" }}>Total Tax</Text>
            <Text style={{ color: isDark ? "#fff" : "#111", fontWeight: "bold" }}>₹{totalTax.toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 2, marginTop: 8 }}>
            <Text style={{ color: isDark ? "#cbd5e1" : "#334155", fontSize: 18, fontWeight: "bold" }}>Net Income</Text>
            <Text style={{ color: isDark ? "#38bdf8" : "#2563eb", fontWeight: "bold", fontSize: 22 }}>₹{netIncome.toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
          </View>
          {/* Net Income in Words removed as per request */}
        </View>
      )}
      {/* If you have more UI below, keep it here */}
    </View>
  );
}
