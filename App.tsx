import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, Pressable, Animated, Easing, StyleSheet, Dimensions, ScrollView, Platform } from "react-native";
import { calculateEMI } from "./src/utils/emiCalculator";
import {
  validateLoanAmount,
  validateInterest,
  validateTenure,
  validateFee,
  validatePrepaymentMonth,
  validatePrepaymentAmount
} from "./src/utils/validation";


const { width, height } = Dimensions.get("window");

// Define a single primary green color for the whole project
const PRIMARY_GREEN = "#22c55e"; // Tailwind emerald-500

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
  backgroundColor: isActive ? PRIMARY_GREEN : isDark ? "#14532d" : "#e0fce9",
  borderRadius: 8,
  paddingVertical: 10,
  alignItems: "center"
});
const buttonText = (isActive, isDark) => ({
  color: isActive ? "#fff" : isDark ? "#fff" : "#111",
  fontWeight: "bold"
});
const resetButton = isDark => ({
  backgroundColor: PRIMARY_GREEN,
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
  backgroundColor: PRIMARY_GREEN,
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
  backgroundColor: isActive ? PRIMARY_GREEN : isDark ? "#14532d" : "#e0fce9",
  borderRadius: 8,
  paddingVertical: 12,
  alignItems: "center",
  marginHorizontal: 2
});
const uniformButtonText = (isActive, isDark) => ({
  color: isActive ? "#fff" : isDark ? "#fff" : "#111",
  fontWeight: "bold",
  fontSize: 16
});
const uniformButtonSolid = {
  flex: 1,
  backgroundColor: PRIMARY_GREEN,
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
        backgroundColor: isDark ? PRIMARY_GREEN : "#bbf7d0", opacity: 0.18,
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
               style={{ backgroundColor: tab === t ? PRIMARY_GREEN : isDark ? "#14532d" : "#e0fce9", borderRadius: 12, paddingVertical: 8, paddingHorizontal: 32, marginHorizontal: 4 }}
             >
               <Text style={{ color: tab === t ? "#fff" : isDark ? "#fff" : "#111", fontWeight: "bold" }}>{t}</Text>
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
                <Text style={{ color: isDark ? "#4ade80" : PRIMARY_GREEN, fontSize: 13, marginTop: 2 }}>Enter the principal amount for GST calculation</Text>
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
                 <Text style={{ color: isDark ? "#4ade80" : PRIMARY_GREEN, fontSize: 13, marginTop: 2 }}>Enter the GST rate as a percentage (e.g., 18)</Text>
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

  // Advanced Prepayment UI State
  const [prepayments, setPrepayments] = useState([]); // Array of {month, amount, frequency, penalty}
  const [showAddPrepay, setShowAddPrepay] = useState(false);
  const [newPrepayMonth, setNewPrepayMonth] = useState("");
  const [newPrepayAmt, setNewPrepayAmt] = useState("");
  const [newPrepayFreq, setNewPrepayFreq] = useState("one-time"); // one-time, monthly, yearly
  const [newPrepayPenalty, setNewPrepayPenalty] = useState("");

  // --- Validations (centralized) ---
  const isLoanAmountValid = validateLoanAmount(loanAmount);
  const isInterestValid = validateInterest(interest);
  const isTenureValid = validateTenure(tenure, tenureType);
  const isFeeValid = validateFee(fee);
  const isPrepayMonthValid = validatePrepaymentMonth(prepayMonth, tenure);
  const isPrepayAmtValid = validatePrepaymentAmount(prepayAmt);
  const allRequiredValid = isLoanAmountValid && isInterestValid && isTenureValid && isFeeValid && isPrepayMonthValid && isPrepayAmtValid;

  // --- Calculations (centralized) ---
  const emiResult = calculateEMI({
    loanAmount,
    interestRate: interest,
    tenure,
    tenureType,
    fee,
    prepayments: prepaymentOn
      ? (prepayments.length > 0
        ? prepayments
        : (isPrepayMonthValid && isPrepayAmtValid && prepayMonth && prepayAmt
          ? [{ startMonth: prepayMonth, amount: prepayAmt, frequency: 'one-time' }]
          : []))
      : []
  });
  const emi = emiResult.emi;
  const emiUnrounded = emiResult.emi;
  const n = emiResult.amortizationTable?.length ? emiResult.amortizationTable.length : 0;
  const procFee = emiResult.procFee || 0;
  const newN = emiResult.prepaymentImpact?.newTenure || n;
  const interestSaved = emiResult.prepaymentImpact?.interestSaved || 0;
  const amort = emiResult.amortizationTable?.slice(0, 6) || [];
  const prepay = emiResult.prepaymentImpact?.prepaymentApplied || 0;
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
            style={{ ...uniformButton(!prepaymentOn, isDark), marginRight: 4, paddingVertical: 10 }}
          >
            <Text style={uniformButtonText(!prepaymentOn, isDark)}>Prepayment: Off</Text>
          </Pressable>
          <Pressable
            onPress={() => setPrepaymentOn(true)}
            style={{ ...uniformButton(prepaymentOn, isDark), marginLeft: 4, paddingVertical: 10 }}
          >
            <Text style={uniformButtonText(prepaymentOn, isDark)}>Prepayment: On</Text>
          </Pressable>
        </View>
      </View>
      {/* Advanced Prepayment Management UI */}
      {prepaymentOn && (
        <View style={{ backgroundColor: isDark ? '#0f172a' : '#f1f5f9', borderRadius: 8, padding: 8, marginTop: 8, marginBottom: 8 }}>
          <Text style={{ color: '#fff', fontWeight: 'bold', marginBottom: 4 }}>Advanced Prepayments</Text>
          {/* List existing prepayments */}
          {prepayments.length > 0 ? (
            prepayments.map((pp, idx) => (
              <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Text style={{ flex: 1, color: isDark ? '#fff' : '#111', fontSize: 14 }}>
                  Month: {pp.startMonth || pp.month}, Amount: ₹{pp.amount}, Freq: {pp.frequency || 'one-time'}{pp.penalty ? `, Penalty: ₹${pp.penalty}` : ''}
                </Text>
                <Pressable
                  onPress={() => setPrepayments(prepayments.filter((_, i) => i !== idx))}
                  style={{ marginLeft: 8, padding: 4, backgroundColor: '#f87171', borderRadius: 6 }}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Delete</Text>
                </Pressable>
              </View>
            ))
          ) : (
            <Text style={{ color: isDark ? '#64748b' : '#64748b', fontSize: 13 }}>No prepayments added yet.</Text>
          )}
          {/* Add new prepayment form */}
          {showAddPrepay ? (
            <View style={{ marginTop: 8, marginBottom: 4 }}>
                    <TextInput
                      value={newPrepayMonth}
                      onChangeText={setNewPrepayMonth}
                      keyboardType="numeric"
                      style={{ backgroundColor: 'transparent', color: isDark ? '#fff' : '#111', borderRadius: 8, padding: 8, marginBottom: 4, fontSize: 14, borderWidth: 1, borderColor: '#cbd5e1' }}
                      placeholder="Month (e.g., 3)"
                      placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                      fontSize={14}
                    />
                    <TextInput
                      value={newPrepayAmt}
                      onChangeText={setNewPrepayAmt}
                      keyboardType="numeric"
                      style={{ backgroundColor: 'transparent', color: isDark ? '#fff' : '#111', borderRadius: 8, padding: 8, marginBottom: 4, fontSize: 14, borderWidth: 1, borderColor: '#cbd5e1' }}
                      placeholder="Amount (e.g., 100000)"
                      placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                      fontSize={14}
                    />
                    <TextInput
                      value={newPrepayPenalty}
                      onChangeText={setNewPrepayPenalty}
                      keyboardType="numeric"
                      style={{ backgroundColor: 'transparent', color: isDark ? '#fff' : '#111', borderRadius: 8, padding: 8, marginBottom: 4, fontSize: 14, borderWidth: 1, borderColor: '#cbd5e1' }}
                      placeholder="Penalty (optional)"
                      placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                      fontSize={14}
                    />
              <View style={{ flexDirection: 'row', marginBottom: 4 }}>
                {['one-time', 'monthly', 'yearly'].map(freq => (
                   <Pressable
                     key={freq}
                     onPress={() => setNewPrepayFreq(freq)}
                     style={{ ...uniformButton(newPrepayFreq === freq, isDark), flex: undefined, borderRadius: 6, paddingVertical: 6, paddingHorizontal: 12, marginRight: 8, minWidth: 80 }}
                   >
                     <Text style={uniformButtonText(newPrepayFreq === freq, isDark)}>{freq.charAt(0).toUpperCase() + freq.slice(1)}</Text>
                   </Pressable>
                ))}
              </View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Pressable
                   onPress={() => {
                     if (newPrepayMonth && newPrepayAmt) {
                       setPrepayments([
                         ...prepayments,
                         {
                           startMonth: Number(newPrepayMonth),
                           amount: Number(newPrepayAmt),
                           frequency: newPrepayFreq,
                           penalty: newPrepayPenalty ? Number(newPrepayPenalty) : 0
                         }
                       ]);
                       setNewPrepayMonth("");
                       setNewPrepayAmt("");
                       setNewPrepayPenalty("");
                       setNewPrepayFreq("one-time");
                       setShowAddPrepay(false);
                     }
                   }}
                   style={{ ...uniformButton(true, isDark), flex: undefined, borderRadius: 6, paddingVertical: 8, paddingHorizontal: 16, minWidth: 80 }}
                 >
                   <Text style={uniformButtonText(true, isDark)}>Add</Text>
                </Pressable>
                <Pressable
                   onPress={() => {
                     setShowAddPrepay(false);
                     setNewPrepayMonth("");
                     setNewPrepayAmt("");
                     setNewPrepayPenalty("");
                     setNewPrepayFreq("one-time");
                   }}
                   style={{ ...uniformButton(false, isDark), flex: undefined, borderRadius: 6, paddingVertical: 8, paddingHorizontal: 16, minWidth: 80 }}
                 >
                   <Text style={uniformButtonText(false, isDark)}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <Pressable
              onPress={() => setShowAddPrepay(true)}
              style={{ ...uniformButton(true, isDark), flex: undefined, borderRadius: 6, paddingVertical: 8, paddingHorizontal: 16, marginTop: 8, minWidth: 120 }}
            >
              <Text style={uniformButtonText(true, isDark)}>Add Prepayment</Text>
            </Pressable>
          )}
        </View>
      )}
      <Text style={{ color: isDark ? "#fff" : "#111", fontWeight: "bold", fontSize: 20 }}>EMI Calculator</Text>
      {/* Inputs */}
      <View style={{ backgroundColor: isDark ? "#0f172a" : "#f1f5f9", borderRadius: 8, padding: 8, marginTop: 8, marginBottom: 8, minHeight: 60 }}>
        <Text style={{ color: isDark ? "#cbd5e1" : "#334155" }}>Loan Amount (INR)</Text>
        <TextInput
          value={loanAmount}
          onChangeText={setLoanAmount}
          keyboardType="numeric"
          style={{ backgroundColor: 'transparent', color: isDark ? "#fff" : "#111", borderRadius: 8, padding: 12, marginTop: 4, fontSize: 14, fontWeight: "bold" }}
          placeholder="e.g., 500000"
          placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
        />
        <Text style={{ color: isDark ? "#4ade80" : PRIMARY_GREEN, fontSize: 13, marginTop: 2 }}>Enter the principal loan amount</Text>
        {!isLoanAmountValid && loanAmount !== "" && (
          <Text style={{ color: 'red', fontSize: 12, marginTop: 2 }}>Enter a valid loan amount &gt; 0</Text>
        )}
      </View>
      <View style={{ backgroundColor: isDark ? "#0f172a" : "#f1f5f9", borderRadius: 8, padding: 8, marginTop: 8, marginBottom: 8, minHeight: 60 }}>
        <Text style={{ color: isDark ? "#cbd5e1" : "#334155" }}>Annual Interest (%)</Text>
        <TextInput
          value={interest}
          onChangeText={setInterest}
          keyboardType="numeric"
          style={{ backgroundColor: 'transparent', color: isDark ? "#fff" : "#111", borderRadius: 8, padding: 12, marginTop: 4, fontSize: 14, fontWeight: "bold" }}
          placeholder="e.g., 8.5"
          placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
        />
        <Text style={{ color: isDark ? "#4ade80" : PRIMARY_GREEN, fontSize: 13, marginTop: 2 }}>Enter the annual interest rate</Text>
        {!isInterestValid && interest !== "" && (
          <Text style={{ color: 'red', fontSize: 12, marginTop: 2 }}>Enter a valid interest rate (0 or more)</Text>
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
         <Text style={{ color: isDark ? "#4ade80" : PRIMARY_GREEN, fontSize: 13, marginLeft: 8 }}>
           Select tenure unit
         </Text>
       </View>
        <View style={{ backgroundColor: isDark ? "#0f172a" : "#f1f5f9", borderRadius: 8, padding: 8, marginTop: 8, marginBottom: 8, minHeight: 60 }}>
        <Text style={{ color: isDark ? "#cbd5e1" : "#334155" }}>
          {tenureType === "years" ? "Tenure (Years)" : "Tenure (Months)"}
        </Text>
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
            marginTop: 4,
            fontSize: 14,
            fontWeight: "bold"
          }}
          placeholder={tenureType === "years" ? "e.g., 20" : "e.g., 240"}
          placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
        />
        <Text style={{ color: isDark ? "#4ade80" : PRIMARY_GREEN, fontSize: 13, marginTop: 2 }}>
          Enter the loan tenure in {tenureType}
        </Text>
        {!isTenureValid && tenure !== "" && (
          <Text style={{ color: 'red', fontSize: 12, marginTop: 2 }}>
            {tenureType === "years"
              ? "Enter a valid tenure (1-200 years)"
              : "Enter a valid tenure (1-2400 months)"}
          </Text>
        )}
      </View>
      <View style={{ backgroundColor: isDark ? "#0f172a" : "#f1f5f9", borderRadius: 8, padding: 8, marginTop: 8, marginBottom: 8, minHeight: 60 }}>
        <Text style={{ color: isDark ? "#cbd5e1" : "#334155" }}>Processing Fee (%)</Text>
        <TextInput
          value={fee}
          onChangeText={setFee}
          keyboardType="numeric"
          style={{ backgroundColor: 'transparent', color: isDark ? "#fff" : "#111", borderRadius: 8, padding: 12, marginTop: 4, fontSize: 14, fontWeight: "bold" }}
          placeholder="e.g., 1.5"
          placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
        />
        <Text style={{ color: isDark ? "#4ade80" : PRIMARY_GREEN, fontSize: 13, marginTop: 2 }}>Enter the processing fee percentage (if any)</Text>
      </View>
       {/* Prepayment fields below processing fee are now always hidden for clarity and consistency. */}
       {/* EMI Results - only show if all required fields are valid */}
      {allRequiredValid && (
        <View style={{ backgroundColor: isDark ? "#0f172a" : "#f1f5f9", borderRadius: 12, padding: 12, marginVertical: 8 }}>
          <Text style={{ color: isDark ? "#fff" : "#111", fontWeight: "bold", marginBottom: 4, fontSize: 16 }}>Monthly EMI</Text>
          {/* Displayed EMI is rounded for clarity */}
          <Text style={{ color: "#38bdf8", fontWeight: "bold", fontSize: 18, marginBottom: 6 }}>₹{(typeof emi === 'number' && !isNaN(emi) ? emi : 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ color: isDark ? "#cbd5e1" : "#334155" }}>Loan Tenure</Text>
            <Text style={{ color: isDark ? "#fff" : "#111" }}>{typeof n === 'number' && !isNaN(n) ? n : 0} months</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ color: isDark ? "#cbd5e1" : "#334155" }}>Total Interest</Text>
            <Text style={{ color: isDark ? "#fff" : "#111" }}>₹{(typeof emiUnrounded === 'number' && typeof n === 'number' && !isNaN(emiUnrounded) && !isNaN(n) ? emiUnrounded * n - (parseFloat(loanAmount) || 0) : 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ color: isDark ? "#cbd5e1" : "#334155" }}>Total Repayment</Text>
            <Text style={{ color: isDark ? "#fff" : "#111" }}>₹{(typeof emiUnrounded === 'number' && typeof n === 'number' && !isNaN(emiUnrounded) && !isNaN(n) ? emiUnrounded * n : 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ color: isDark ? "#cbd5e1" : "#334155" }}>Processing Fee</Text>
            <Text style={{ color: isDark ? "#fff" : "#111" }}>₹{(typeof procFee === 'number' && !isNaN(procFee) ? procFee : 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 4 }}>
            <Text style={{ color: "#22d3ee", fontWeight: "bold" }}>Total Outflow</Text>
            <Text style={{ color: "#22d3ee", fontWeight: "bold", fontSize: 16 }}>₹{(typeof emiUnrounded === 'number' && typeof n === 'number' && typeof procFee === 'number' && !isNaN(emiUnrounded) && !isNaN(n) && !isNaN(procFee) ? emiUnrounded * n + procFee : 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
          </View>
          {(typeof emiUnrounded === 'number' && typeof n === 'number' && typeof procFee === 'number' && !isNaN(emiUnrounded) && !isNaN(n) && !isNaN(procFee) && (emiUnrounded * n + procFee) > 0) && (
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
                <Text style={{ color: isDark ? "#fff" : "#111" }}>₹{(typeof prepay === 'number' && !isNaN(prepay) ? prepay : 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ color: isDark ? "#cbd5e1" : "#334155" }}>New Tenure</Text>
                <Text style={{ color: isDark ? "#fff" : "#111" }}>{typeof newN === 'number' && !isNaN(newN) ? Math.round(newN) : 0} months</Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ color: isDark ? "#cbd5e1" : "#334155" }}>Tenure Saved</Text>
                <Text style={{ color: isDark ? "#fff" : "#111" }}>{typeof n === 'number' && typeof newN === 'number' && !isNaN(n) && !isNaN(newN) ? Math.round(n - newN) : 0} months</Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ color: isDark ? "#cbd5e1" : "#334155" }}>Interest Saved</Text>
                <Text style={{ color: "#38bdf8", fontWeight: "bold" }}>₹{(typeof interestSaved === 'number' && !isNaN(interestSaved) ? interestSaved : 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
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
            <Text style={{ color: isDark ? "#fff" : "#111", width: 60 }}>M{row?.month ?? idx + 1}</Text>
            {/* Show EMI as rounded for display in amortization table */}
            <Text style={{ color: isDark ? "#fff" : "#111", width: 80 }}>₹{(typeof row?.emi === 'number' && !isNaN(row.emi) ? Math.round(row.emi * 100) / 100 : 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
            <Text style={{ color: isDark ? "#fff" : "#111", width: 60 }}>₹{(typeof row?.interest === 'number' && !isNaN(row.interest) ? row.interest : 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
            <Text style={{ color: isDark ? "#fff" : "#111", width: 80 }}>₹{(typeof row?.closingPrincipal === 'number' && !isNaN(row.closingPrincipal) ? row.closingPrincipal : 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
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
      <Text style={{ color: isDark ? "#fff" : "#111", fontWeight: "bold", fontSize: 20, marginBottom: 8 }}>Tax Estimator</Text>
      {/* Inputs */}
      <View style={{ backgroundColor: isDark ? "#0f172a" : "#f1f5f9", borderRadius: 8, padding: 8, marginTop: 8, marginBottom: 8, minHeight: 60 }}>
        <Text style={{ color: isDark ? "#cbd5e1" : "#334155" }}>Total Income (INR)</Text>
        <TextInput value={income} onChangeText={setIncome} keyboardType="numeric" style={{ backgroundColor: 'transparent', color: isDark ? "#fff" : "#111", borderRadius: 8, padding: 12, marginTop: 4, fontSize: 18, fontWeight: "bold" }} />
        <Text style={{ color: isDark ? "#4ade80" : PRIMARY_GREEN, fontSize: 13, marginTop: 2 }}>Enter your total taxable income</Text>
        {!isIncomeValid && income !== "" && (
          <Text style={{ color: 'red', fontSize: 12 }}>Enter a valid income &gt; 0</Text>
        )}
      </View>
      <View style={{ backgroundColor: isDark ? "#0f172a" : "#f1f5f9", borderRadius: 8, padding: 8, marginTop: 8, marginBottom: 8, minHeight: 60 }}>
        <Text style={{ color: isDark ? "#cbd5e1" : "#334155" }}>Deductions (Only NPS employer contribution allowed in New Regime)</Text>
        <TextInput
          value={deductions}
          onChangeText={text => {
            // Allow only numbers and commas
            const sanitized = text.replace(/[^0-9,]/g, '');
            setDeductions(sanitized);
          }}
          style={{ backgroundColor: 'transparent', color: isDark ? "#fff" : "#111", borderRadius: 8, padding: 12, marginTop: 4, fontSize: 14, fontWeight: "bold" }}
        />
        <Text style={{ color: isDark ? "#4ade80" : PRIMARY_GREEN, fontSize: 13, marginTop: 2 }}>Enter eligible deductions (comma-separated, e.g., 50000,20000)</Text>
        {!deductionsValid && deductions !== "" && (
          <Text style={{ color: 'red', fontSize: 12 }}>Enter valid deduction(s) (comma-separated, each ≥ 0)</Text>
        )}
      </View>
      {/* Results section - only show if all required fields are valid */}
      {allTaxValid && (
        <View style={{ backgroundColor: isDark ? "#0f172a" : "#f1f5f9", borderRadius: 12, padding: 12, marginTop: 16, minHeight: 120 }}>
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
            <Text style={{ color: isDark ? "#4ade80" : PRIMARY_GREEN, fontWeight: "bold", fontSize: 22 }}>₹{netIncome.toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
          </View>
          {/* Net Income in Words removed as per request */}
        </View>
      )}
      {/* If you have more UI below, keep it here */}
    </View>
  );
}
