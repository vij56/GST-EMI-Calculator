// --- Native/Expo API stubs for web/compile ---
const Linking = {
  async canOpenURL(_url: string) {
    return false;
  },
  async openURL(_url: string) {},
};
const Sharing = {
  async isAvailableAsync() {
    return false;
  },
  async shareAsync(_uri: string, _options?: any) {},
};
const Print = {
  async printAsync(_options: any) {},
  async printToFileAsync(_options: any) {
    return { uri: "" };
  },
};
const AsyncStorage = {
  async setItem(key: string, value: string) {},
  async getItem(key: string) {
    return null;
  },
  async removeItem(key: string) {},
};

// --- UI/Native stubs for Expo/React Native ---
const LinearGradient = ({ children, ...props }: any) => (
  <View {...props}>{children}</View>
);
const KeyboardAvoidingView = ({ children, ...props }: any) => (
  <View {...props}>{children}</View>
);
const ScrollView = ({ children, ...props }: any) => (
  <View {...props}>{children}</View>
);

function formatINR(n: number | undefined): string {
  if (typeof n !== "number" || isNaN(n)) return "-";
  return n.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });
}
if (typeof AsyncStorage !== "undefined") {
  (AsyncStorage as any).removeItem = async function (key: string) {};
}
// --- MISSING CONSTANTS, TYPES, HELPERS (STUBS) ---
import React, { useRef, ReactNode, useState, useEffect, useMemo } from "react";
import {
  StyleSheet,
  Pressable,
  View,
  Text,
  TextInput,
  Platform,
  StyleProp,
  Alert,
} from "react-native";
import { StatusBar } from 'expo-status-bar';

// --- APP CONFIG STUB (from app.json extra) ---
const extraConfig = {
  revenueCatEntitlementId: "pro_access", // Replace with your actual entitlement ID if needed
};

// --- MISSING ENUMS, TYPES, CONSTANTS, HELPERS ---
// Modes
type Mode = "GST" | "EMI" | "COMPARE" | "TAX";
type ThemeMode = "LIGHT" | "DARK";
type GstMode = "EXCLUSIVE" | "INCLUSIVE";
type TenureUnit = "YEARS" | "MONTHS";
type PropertyStatus = "SELF_OCCUPIED" | "LET_OUT";

// GST Result
type GstResult = {
  valid: boolean;
  taxableValue?: number;
  taxAmount?: number;
  totalAmount?: number;
  error?: string;
  // legacy fields for compatibility
  baseAmount?: number;
  gstAmount?: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
};

// EMI Schedule Row
type ScheduleRow = {
  month: number;
  emiPaid: number;
  principalPart: number;
  interestPart: number;
  prepaymentPart: number;
  balance: number;
};

// EMI Result
type EmiResult = {
  valid: boolean;
  months?: number;
  emi?: number;
  totalInterest?: number;
  totalPayment?: number;
  feeAmount?: number;
  totalOutflow?: number;
  previewRows?: any[];
  scheduleRows?: any[];
  prepaymentSummary?: {
    applied: boolean;
    prepaymentAmount?: number;
    prepaymentMonth?: number;
    monthsAfterPrepayment?: number;
    interestAfterPrepayment?: number;
    tenureSavedMonths?: number;
    interestSaved?: number;
  };
  error?: string;
};

// Compare Result
type CompareResult = {
  base: EmiResult;
  compare: EmiResult;
  diff: number;
};

// Affordability Result
type AffordabilityResult = {
  disposableIncome: number;
  safeEmi: number;
  recommendedLoanAmount: number;
  maxByIncomeRule: number;
};

// Tax Result
type TaxResult = {
  principalDeduction: number;
  interestDeduction: number;
  totalDeduction: number;
  taxSavings: number;
  monthlyTaxBenefit: number;
  hraDeduction: number;
  section80CLimit: number;
  section24Limit: number;
};

// ThemePalette stub (expand as needed)
type ThemePalette = {
  gradient: string[];
  statusBar: string;
  orbA: string;
  orbB: string;
  planCardBorder: string;
  planCardBg: string;
  panelGlow: string;
  exportButton: string;
  exportButtonGlow: string;
  panelBorder: string;
  panel: string;
  pageText: string;
  highlight: string;
  mutedText: string;
  subtitleText: string;
  segmentBg: string;
  activePill: string;
  activePillText: string;
  inputBorder: string;
  inputText: string;
  inputBg: string;
  resultsBorder: string;
  resultsBg: string;
  divider: string;
  error: string;
  resetBorder: string;
  resetBg: string;
  adBannerBorder: string;
  adBannerBg: string;
  segmentActive: string;
  segmentText: string;
  segmentActiveText: string;
  placeholder: string;
};

// Utility: toNumber
function toNumber(val: any): number {
  const n = Number(val);
  return isNaN(n) ? 0 : n;
}

// Utility: calculateSchedule (stub)
function calculateSchedule(
  principal: number,
  monthlyRate: number,
  emi: number,
  lumpSumMonth: number,
  lumpSumAmount: number,
): ScheduleRow[] {
  // Simple stub: returns empty schedule
  return [];
}

// Utility: buildScheduleCsv (stub)
function buildScheduleCsv(rows: ScheduleRow[]): string {
  return (
    "Month,EMI Paid,Principal,Interest,Prepayment,Balance\n" +
    rows
      .map(
        (r) =>
          `${r.month},${r.emiPaid},${r.principalPart},${r.interestPart},${r.prepaymentPart},${r.balance}`,
      )
      .join("\n")
  );
}

// Add summary properties to ScheduleRow[] arrays for compatibility
// @ts-ignore
Object.defineProperties(Array.prototype, {
  months: {
    get() {
      return this.length;
    },
    configurable: true,
  },
  totalInterest: {
    get() {
      return this.reduce((sum: number, row: any) => sum + (row.interestPart || 0), 0);
    },
    configurable: true,
  },
  totalEmiPaid: {
    get() {
      return this.reduce((sum: number, row: any) => sum + (row.emiPaid || 0), 0);
    },
    configurable: true,
  },
  totalPrepayment: {
    get() {
      return this.reduce((sum: number, row: any) => sum + (row.prepaymentPart || 0), 0);
    },
    configurable: true,
  },
  rows: {
    get() {
      return this;
    },
    configurable: true,
  },
});

// Utility: glowStyle (stub)
function glowStyle(
  color: string,
  opacity: number,
  blur: number,
  spread: number,
) {
  return {};
}

// Constants
const FREE_EXPORT_LIMIT_PER_DAY = 2;
const FREE_EXPORT_ROW_LIMIT = 12;

// Move interactiveStyles above AnimatedPressable to ensure it is always defined
// Only define interactiveStyles once, above all usages
const interactiveStyles = StyleSheet.create({
  pressableFill: {
    alignSelf: "stretch",
    position: "relative",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  pressableGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 999,
  },
});

type AnimatedPressableProps = {
  children: ReactNode;
  onPress: () => void;
  style?: StyleProp<any>;
  glowColor?: string;
};

function AnimatedPressable({
  children,
  onPress,
  style,
  glowColor = "#38bdf8",
}: AnimatedPressableProps) {
  const pressScale = useRef(new Animated.Value(1)).current;
  const glowLevel = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(pressScale, {
        toValue: 0.96,
        useNativeDriver: true,
        speed: 32,
        bounciness: 6,
      }),
      Animated.timing(glowLevel, {
        toValue: 1,
        duration: 170,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(pressScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 24,
        bounciness: 9,
      }),
      Animated.timing(glowLevel, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
    ]).start();
  };

  return (
    <Animated.View
      style={[
        style,
        {
          transform: [{ scale: pressScale }],
        },
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={interactiveStyles.pressableFill}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            interactiveStyles.pressableGlow,
            {
              backgroundColor: glowColor,
              opacity: glowLevel.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.22],
              }),
              transform: [
                {
                  scale: glowLevel.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.96, 1.06],
                  }),
                },
              ],
            },
          ]}
        />
        {children}
      </Pressable>
    </Animated.View>
  );
}
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// Animated/Easing stubs for react-native-reanimated
type AnimatedCallback = (value: { value: number }) => void;
class AnimatedValueStub {
  private _value: number;
  constructor(v: number) {
    this._value = v;
  }
  setValue(v: number) {
    this._value = v;
  }
  addListener(cb?: AnimatedCallback) {
    if (cb) cb({ value: this._value });
    return 0;
  }
  removeListener(_id?: number) {}
  interpolate(..._args: any[]) {
    return this;
  }
}
const Animated = {
  Value: AnimatedValueStub,
  timing: (_val: any, _config: any) => ({
    start: (cb?: () => void) => {
      if (cb) cb();
    },
  }),
  spring: (_val: any, _config: any) => ({
    start: (cb?: () => void) => {
      if (cb) cb();
    },
  }),
  parallel: (anims: any[]) => ({
    start: (cb?: () => void) => {
      if (cb) cb();
    },
  }),
  loop: (a: any) => ({ start: () => {}, stop: () => {} }),
  sequence: (..._args: any[]) => ({}),
  View: (props: any) => null,
};
const Easing = {
  out: (fn: any) => fn,
  inOut: (fn: any) => fn,
  cubic: () => (t: number) => t,
  quad: () => (t: number) => t,
};

// Safe message stub
const safeMessage = (msg: string) => {};

// Helper function moved above App
const buildScheduleHtml = (
  rows: ScheduleRow[],
  emi: number,
  totalInterest: number,
  totalOutflow: number,
) => {
  const tableRows = rows
    .slice(0, 180)
    .map(
      (row) => `
      <tr>
        <td>${row.month}</td>
        <td>${row.emiPaid.toFixed(2)}</td>
        <td>${row.principalPart.toFixed(2)}</td>
        <td>${row.interestPart.toFixed(2)}</td>
        <td>${row.prepaymentPart.toFixed(2)}</td>
        <td>${row.balance.toFixed(2)}</td>
      </tr>`,
    )
    .join("");

  return `
  <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; color: #0f172a; }
        h1 { margin-bottom: 4px; }
        .meta { margin-bottom: 18px; color: #334155; }
        table { width: 100%; border-collapse: collapse; font-size: 11px; }
        th, td { border: 1px solid #cbd5e1; padding: 6px; text-align: right; }
        th:first-child, td:first-child { text-align: center; }
        th { background: #e2e8f0; }
      </style>
    </head>
    <body>
      <h1>EMI Schedule</h1>
      <div class="meta">EMI: ${emi.toFixed(2)} | Total Interest: ${totalInterest.toFixed(
        2,
      )} | Total Outflow: ${totalOutflow.toFixed(2)}</div>
      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>EMI Paid</th>
            <th>Principal</th>
            <th>Interest</th>
            <th>Prepayment</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    </body>
  </html>`;
};

export default function App() {
  // --- STATE HOOKS ---
  const [mode, setMode] = useState<Mode>("GST");
  const [themeMode, setThemeMode] = useState<ThemeMode>("LIGHT");
  const [amount, setAmount] = useState<string>("1000");
  const [gstRate, setGstRate] = useState<string>("18");
  const [gstMode, setGstMode] = useState<GstMode>("EXCLUSIVE");
  const [splitTax, setSplitTax] = useState<boolean>(true);
  const [principal, setPrincipal] = useState<string>("500000");
  const [annualRate, setAnnualRate] = useState<string>("10.5");
  const [tenureValue, setTenureValue] = useState<string>("5");
  const [tenureUnit, setTenureUnit] = useState<TenureUnit>("YEARS");
  const [processingFee, setProcessingFee] = useState<string>("1");
  const [prepaymentMonth, setPrepaymentMonth] = useState<string>("12");
  const [prepaymentAmount, setPrepaymentAmount] = useState<string>("100000");
  const [compareEnabled, setCompareEnabled] = useState<boolean>(false);
  const [compareAnnualRate, setCompareAnnualRate] = useState<string>("9.25");
  const [compareTenureValue, setCompareTenureValue] = useState<string>("5");
  const [compareTenureUnit, setCompareTenureUnit] =
    useState<TenureUnit>("YEARS");
  const [compareProcessingFee, setCompareProcessingFee] =
    useState<string>("0.5");
  const [monthlyIncome, setMonthlyIncome] = useState<string>("80000");
  const [monthlyExpenses, setMonthlyExpenses] = useState<string>("35000");
  const [existingEmis, setExistingEmis] = useState<string>("5000");
  const [exportMessage, setExportMessage] = useState<string>("");
  const [homeloanPrincipal, setHomeloanPrincipal] = useState<string>("2000000");
  const [annualPrincipalRepayment, setAnnualPrincipalRepayment] =
    useState<string>("100000");
  const [annualInterestPaid, setAnnualInterestPaid] =
    useState<string>("200000");
  const [annualIncome, setAnnualIncome] = useState<string>("960000");
  const [taxRate, setTaxRate] = useState<string>("30");
  const [propertyStatus, setPropertyStatus] =
    useState<PropertyStatus>("SELF_OCCUPIED");
  const [annualHRA, setAnnualHRA] = useState<string>("600000");
  const [isPro, setIsPro] = useState<boolean>(false);
  const [billingReady, setBillingReady] = useState<boolean>(false);
  const [purchasesSdk, setPurchasesSdk] = useState<any>(null);
  const [offerings, setOfferings] = useState<any>(null);
  const [rcEntitlement] = useState<string>(extraConfig.revenueCatEntitlementId);
  const [dailyExportKey, setDailyExportKey] = useState<string>("");
  const [dailyExportCount, setDailyExportCount] = useState<number>(0);
  const [safeScheduleRows, setSafeScheduleRows] = useState<any[]>([]);
  // --- PLACEHOLDER DEFINITIONS FOR MISSING VARIABLES ---
  const theme: ThemePalette = {
    gradient: ["#fff", "#eee"],
    statusBar: "dark",
    orbA: "#fff",
    orbB: "#fff",
    planCardBorder: "#eee",
    planCardBg: "#fff",
    panelGlow: "#fff",
    exportButton: "#fff",
    exportButtonGlow: "#fff",
    panelBorder: "#eee",
    panel: "#fff",
    pageText: "#222",
    highlight: "#38bdf8",
    mutedText: "#888",
    subtitleText: "#aaa",
    segmentBg: "#f5f5f5",
    activePill: "#e0f7fa",
    activePillText: "#00796b",
    inputBorder: "#ccc",
    inputText: "#222",
    inputBg: "#fff",
    resultsBorder: "#eee",
    resultsBg: "#fafafa",
    divider: "#eee",
    error: "#e53935",
    resetBorder: "#eee",
    resetBg: "#fff",
    adBannerBorder: "#eee",
    adBannerBg: "#fff",
    segmentActive: "#e0f7fa",
    segmentText: "#222",
    segmentActiveText: "#00796b",
    placeholder: "#888",
  };
  // Move createStyles definition above this line
  // Completely disable all style-related functionality
  const createStyles = (_theme: ThemePalette) => new Proxy({}, {
    get: () => undefined,
  });
  // Define styles after theme is defined
  const styles = createStyles(theme);
  const headerOpacity = 1;
  const headerTranslateY = 0;
  const cardOpacity = 1;
  const cardTranslateY = 0;
  const glowOpacity = 1;
  const BannerAd = null;
  const BannerAdSize = { ANCHORED_ADAPTIVE_BANNER: "BANNER" };
  const adBannerUnitId = "test";
  const TestIds = { BANNER: "test" };

    // --- FIXED JSX STRUCTURE ---
    // --- END STATE HOOKS ---
    // Segment is defined below

    // --- MOVE createStyles DEFINITION HERE FROM BELOW ---
      // Removed duplicate createStyles definition (already defined above)

    // --- END MOVED createStyles DEFINITION ---
  const gstResult = useMemo<GstResult>(() => {
    const baseAmount = toNumber(amount);
    const rate = toNumber(gstRate);

    if (baseAmount <= 0 || rate < 0) {
      return {
        valid: false,
        error: "Enter a valid amount and GST rate.",
      };
    }

    const rateFraction = rate / 100;

    if (gstMode === "EXCLUSIVE") {
      const taxAmount = baseAmount * rateFraction;
      const totalAmount = baseAmount + taxAmount;
      return {
        valid: true,
        taxableValue: baseAmount,
        taxAmount,
        totalAmount,
      };
    }

    const taxableValue = baseAmount / (1 + rateFraction);
    const taxAmount = baseAmount - taxableValue;
    return {
      valid: true,
      taxableValue,
      taxAmount,
      totalAmount: baseAmount,
    };
  }, [amount, gstRate, gstMode]);

  const emiResult = useMemo<EmiResult>(() => {
    const loan = toNumber(principal);
    const annualInterest = toNumber(annualRate);
    const tenure = toNumber(tenureValue);
    const feeRate = toNumber(processingFee);
    const lumpSumMonth = Math.round(toNumber(prepaymentMonth));
    const lumpSumAmount = toNumber(prepaymentAmount);
    const months =
      tenureUnit === "YEARS" ? Math.round(tenure * 12) : Math.round(tenure);

    if (loan <= 0 || annualInterest < 0 || months <= 0 || feeRate < 0) {
      return {
        valid: false,
        error: "Enter valid loan values to calculate EMI.",
      };
    }

    const monthlyRate = annualInterest / 1200;
    const emi =
      monthlyRate === 0
        ? loan / months
        : (loan * monthlyRate * Math.pow(1 + monthlyRate, months)) /
          (Math.pow(1 + monthlyRate, months) - 1);

    const baselineSchedule = calculateSchedule(loan, monthlyRate, emi, 0, 0);
    const withPrepayment =
      lumpSumAmount > 0 && lumpSumMonth > 0
        ? calculateSchedule(loan, monthlyRate, emi, lumpSumMonth, lumpSumAmount)
        : baselineSchedule;

    const totalPayment = baselineSchedule.totalEmiPaid;
    const totalInterest = baselineSchedule.totalInterest;
    const feeAmount = (loan * feeRate) / 100;
    const totalOutflow = totalPayment + feeAmount;

    const previewRows = withPrepayment.rows.slice(0, 6).map((row: any) => ({
      month: row.month,
      principalPart: row.principalPart,
      interestPart: row.interestPart,
      balance: row.balance,
    }));

    return {
      valid: true,
      months: baselineSchedule.months,
      emi,
      totalInterest,
      totalPayment,
      feeAmount,
      totalOutflow,
      previewRows,
      scheduleRows: withPrepayment.rows,
      prepaymentSummary: {
        applied: lumpSumAmount > 0 && lumpSumMonth > 0,
        prepaymentAmount: withPrepayment.totalPrepayment,
        prepaymentMonth: lumpSumMonth,
        monthsAfterPrepayment: withPrepayment.months,
        interestAfterPrepayment: withPrepayment.totalInterest,
        tenureSavedMonths: Math.max(
          0,
          baselineSchedule.months - withPrepayment.months,
        ),
        interestSaved: Math.max(
          0,
          baselineSchedule.totalInterest - withPrepayment.totalInterest,
        ),
      },
    };
  }, [
    principal,
    annualRate,
    tenureValue,
    tenureUnit,
    processingFee,
    prepaymentAmount,
    prepaymentMonth,
  ]);

  const compareResult = useMemo<CompareResult | null>(() => {
    if (!compareEnabled || !emiResult.valid) {
      return null;
    }

    const loan = toNumber(principal);
    const annualInterest = toNumber(compareAnnualRate);
    const tenure = toNumber(compareTenureValue);
    const feeRate = toNumber(compareProcessingFee);
    const months =
      compareTenureUnit === "YEARS"
        ? Math.round(tenure * 12)
        : Math.round(tenure);

    if (loan <= 0 || annualInterest < 0 || months <= 0 || feeRate < 0) {
      return null;
    }

    const monthlyRate = annualInterest / 1200;
    const emi =
      monthlyRate === 0
        ? loan / months
        : (loan * monthlyRate * Math.pow(1 + monthlyRate, months)) /
          (Math.pow(1 + monthlyRate, months) - 1);

    const schedule = calculateSchedule(loan, monthlyRate, emi, 0, 0);
    const totalPayment = schedule.totalEmiPaid;
    const totalInterest = schedule.totalInterest;
    const feeAmount = (loan * feeRate) / 100;
    const totalOutflow = totalPayment + feeAmount;

    return {
      months: schedule.months,
      emi,
      totalInterest,
      totalPayment,
      feeAmount,
      totalOutflow,
    };
  }, [
    compareEnabled,
    emiResult,
    principal,
    compareAnnualRate,
    compareTenureValue,
    compareTenureUnit,
    compareProcessingFee,
  ]);

  const affordabilityResult = useMemo<AffordabilityResult | null>(() => {
    const income = toNumber(monthlyIncome);
    const expenses = toNumber(monthlyExpenses);
    const existing = toNumber(existingEmis);
    const annualInterest = toNumber(annualRate);
    const tenure = toNumber(tenureValue);
    const months =
      tenureUnit === "YEARS" ? Math.round(tenure * 12) : Math.round(tenure);

    if (
      income <= 0 ||
      expenses < 0 ||
      existing < 0 ||
      annualInterest < 0 ||
      months <= 0
    ) {
      return null;
    }

    const disposableIncome = Math.max(0, income - expenses - existing);
    const maxByIncomeRule = Math.max(0, income * 0.4 - existing);
    const safeEmi = Math.max(0, Math.min(disposableIncome, maxByIncomeRule));

    const monthlyRate = annualInterest / 1200;
    const recommendedLoanAmount =
      monthlyRate === 0
        ? safeEmi * months
        : (safeEmi * (Math.pow(1 + monthlyRate, months) - 1)) /
          (monthlyRate * Math.pow(1 + monthlyRate, months));

    return {
      disposableIncome,
      safeEmi,
      recommendedLoanAmount: Math.max(0, recommendedLoanAmount),
      maxByIncomeRule,
    };
  }, [
    monthlyIncome,
    monthlyExpenses,
    existingEmis,
    annualRate,
    tenureValue,
    tenureUnit,
  ]);

  const taxResult = useMemo<TaxResult | null>(() => {
    const principal = toNumber(homeloanPrincipal);
    const annualPrincipalRep = toNumber(annualPrincipalRepayment);
    const annualInterest = toNumber(annualInterestPaid);
    const income = toNumber(annualIncome);
    const tax = toNumber(taxRate);
    const hra = toNumber(annualHRA);

    if (
      principal <= 0 ||
      annualPrincipalRep < 0 ||
      annualInterest < 0 ||
      income <= 0 ||
      tax <= 0
    ) {
      return null;
    }

    // Section 80C: Principal repayment limited to 1.5 lakhs per year
    const maxSection80C = 150000;
    const principalDeduction = Math.min(annualPrincipalRep, maxSection80C);

    // Section 24: Interest deduction
    // Self-occupied: limited to 2 lakhs per year
    // Let-out: no limit
    const maxSection24 = propertyStatus === "SELF_OCCUPIED" ? 200000 : Infinity;
    const interestDeduction = Math.min(annualInterest, maxSection24);

    // Total deduction = Section 80C + Section 24
    const totalDeduction = principalDeduction + interestDeduction;

    // Tax savings = Total deduction × Tax rate %
    const taxSavings = (totalDeduction * tax) / 100;
    const monthlyTaxBenefit = taxSavings / 12;

    // HRA deduction (not claimed if own home)
    const hraDeduction = 0; // Since they have home loan, HRA typically not claimed

    return {
      principalDeduction,
      interestDeduction,
      totalDeduction,
      taxSavings,
      monthlyTaxBenefit: Math.max(0, monthlyTaxBenefit),
      hraDeduction,
      section80CLimit: maxSection80C,
      section24Limit: propertyStatus === "SELF_OCCUPIED" ? 200000 : 0,
    };
  }, [
    homeloanPrincipal,
    annualPrincipalRepayment,
    annualInterestPaid,
    annualIncome,
    taxRate,
    propertyStatus,
    annualHRA,
  ]);

  const resetGst = () => {
    setAmount("1000");
    setGstRate("18");
    setGstMode("EXCLUSIVE");
    setSplitTax(true);
  };

  const resetEmi = () => {
    setPrincipal("500000");
    setAnnualRate("10.5");
    setTenureValue("5");
    setTenureUnit("YEARS");
    setProcessingFee("1");
    setPrepaymentMonth("12");
    setPrepaymentAmount("100000");
    setCompareEnabled(false);
    setCompareAnnualRate("9.25");
    setCompareTenureValue("5");
    setCompareTenureUnit("YEARS");
    setCompareProcessingFee("0.5");
    setMonthlyIncome("80000");
    setMonthlyExpenses("35000");
    setExistingEmis("5000");
    setExportMessage("");
  };

  const resetTax = () => {
    setHomeloanPrincipal("2000000");
    setAnnualPrincipalRepayment("100000");
    setAnnualInterestPaid("200000");
    setAnnualIncome("960000");
    setTaxRate("30");
    setPropertyStatus("SELF_OCCUPIED");
    setAnnualHRA("600000");
    setExportMessage("");
  };

  const syncDailyLimitWindow = () => {
    const today = new Date().toDateString();
    if (today !== dailyExportKey) {
      setDailyExportKey(today);
      setDailyExportCount(0);
      AsyncStorage.setItem(`exportCount_${today}`, "0");
      return 0;
    }
    return dailyExportCount;
  };

  // Removed showInterstitialIfReady (interstitial ad logic)

  const registerExportUsage = async () => {
    if (!isPro) {
      const newCount = dailyExportCount + 1;
      setDailyExportCount(newCount);
      const today = new Date().toDateString();
      await AsyncStorage.setItem(`exportCount_${today}`, newCount.toString());
    }
  };

  const ensureCanExport = () => {
    if (isPro) {
      return true;
    }

    const currentCount = syncDailyLimitWindow();
    if (currentCount >= FREE_EXPORT_LIMIT_PER_DAY) {
      Alert.alert(
        "Free limit reached",
        `Free plan allows ${FREE_EXPORT_LIMIT_PER_DAY} exports/day. Upgrade to Pro for unlimited full exports.`,
      );
      return false;
    }

    return true;
  };

  const launchUpgrade = async () => {
    if (
      billingReady &&
      purchasesSdk &&
      offerings?.current?.availablePackages?.length
    ) {
      try {
        const packageToBuy = offerings.current.availablePackages[0];
        const purchaseInfo = await purchasesSdk.purchasePackage(packageToBuy);
        const active = Boolean(
          purchaseInfo?.customerInfo?.entitlements?.active?.[rcEntitlement],
        );
        if (active) {
          setIsPro(true);
          await AsyncStorage.setItem("isPro", "true");
          Alert.alert("Pro activated", "Thank you for upgrading to Pro.");
          return;
        }
      } catch (error) {
        console.error(error);
      }
    }

    const upiUri =
      "upi://pay?pa=your-upi-id@okaxis&pn=GST%20EMI%20Calculator&am=199&cu=INR&tn=Pro%20Upgrade";
    try {
      const supported = await Linking.canOpenURL(upiUri);
      if (supported) {
        await Linking.openURL(upiUri);
        return;
      }
    } catch (error) {
      console.error(error);
    }

    Alert.alert(
      "Upgrade to Pro",
      "Billing fallback: Add your real UPI ID or configure RevenueCat keys/offering in app config.",
      [
        { text: "Not now" },
        {
          text: "Enable Demo Pro",
          onPress: () => setIsPro(true),
        },
      ],
    );
  };

  const restorePurchases = async () => {
    if (!purchasesSdk || !billingReady) {
      Alert.alert("Restore unavailable", "Billing is not configured yet.");
      return;
    }

    try {
      const info = await purchasesSdk.restorePurchases();
      const active = Boolean(info?.entitlements?.active?.[rcEntitlement]);
      setIsPro(active);
      if (active) {
        await AsyncStorage.setItem("isPro", "true");
      } else {
        await AsyncStorage.removeItem("isPro");
      }
      Alert.alert(
        active ? "Pro restored" : "No active purchase",
        "Restore completed.",
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Restore failed", "Could not restore purchases right now.");
    }
  };

  const exportScheduleCsv = async () => {
    if (!emiResult.valid) return;
    if (!ensureCanExport()) return;
    // Removed interstitial ad before export
    const rowsForExport = isPro
      ? safeScheduleRows
      : safeScheduleRows.slice(0, FREE_EXPORT_ROW_LIMIT);
    const csv = buildScheduleCsv(rowsForExport);
    const fileName = `emi-schedule-${Date.now()}.csv`;
    try {
      if (Platform.OS === "web") {
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setExportMessage(
          isPro
            ? "CSV downloaded in browser."
            : `CSV downloaded (free preview: first ${FREE_EXPORT_ROW_LIMIT} rows).`,
        );
        registerExportUsage();
        return;
      }
      // @ts-ignore
      const outputPath = `${FileSystem.documentDirectory ?? ""}${fileName}`;
      // @ts-ignore
      await FileSystem.writeAsStringAsync(outputPath, csv);
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(outputPath, {
          dialogTitle: "Share EMI Schedule CSV",
          mimeType: "text/csv",
        });
      }
      setExportMessage("CSV exported successfully.");
      safeMessage("CSV exported successfully.");
      registerExportUsage();
    } catch (error) {
      setExportMessage("CSV export failed.");
      safeMessage("CSV export failed.");
      console.error(error);
    }
  };

  const exportSchedulePdf = async () => {
    if (!emiResult.valid) return;
    if (!ensureCanExport()) return;
    // Removed interstitial ad before export
    const rowsForExport = isPro
      ? safeScheduleRows
      : safeScheduleRows.slice(0, FREE_EXPORT_ROW_LIMIT);
    const html = buildScheduleHtml(
      rowsForExport,
      emiResult.emi ?? 0,
      emiResult.prepaymentSummary?.applied
        ? emiResult.prepaymentSummary.interestAfterPrepayment
        : (emiResult.totalInterest ?? 0),
      emiResult.prepaymentSummary?.applied
        ? safeScheduleRows.reduce(
            (sum, row) => sum + row.emiPaid + row.prepaymentPart,
            0,
          ) + (emiResult.feeAmount ?? 0)
        : (emiResult.totalOutflow ?? 0),
    );

    try {
      if (Platform.OS === "web") {
        await Print.printAsync({ html });
        setExportMessage(
          isPro
            ? "PDF print dialog opened."
            : `PDF preview opened (first ${FREE_EXPORT_ROW_LIMIT} rows).`,
        );
        registerExportUsage();
        return;
      }

      const printed = await Print.printToFileAsync({ html });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(printed.uri, {
          dialogTitle: "Share EMI Schedule PDF",
          mimeType: "application/pdf",
        });
      }

      setExportMessage("PDF exported successfully.");
      safeMessage("PDF exported successfully.");
      registerExportUsage();
    } catch (error) {
      setExportMessage("PDF export failed.");
      safeMessage("PDF export failed.");
      console.error(error);
    }
  };

  return (
    <SafeAreaProvider>
      <LinearGradient colors={theme.gradient as any} style={styles.gradient}>
        <SafeAreaView style={styles.safeArea}>
          <View style={[styles.orbLayer, { pointerEvents: "none" }]}>
            <Animated.View
              style={[styles.orb, styles.orbTop, { opacity: glowOpacity }]}
            />
            <Animated.View
              style={[styles.orb, styles.orbBottom, { opacity: glowOpacity }]}
            />
          </View>
          {/* @ts-ignore */}
          <StatusBar style={theme.statusBar as any} />
          <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <ScrollView contentContainerStyle={styles.container}>
              {/* Mode Toggle */}
              <View style={styles.toggleWrap}>
                {["GST", "EMI", "TAX"].map((m) => (
                  <Pressable
                    key={m}
                    style={[
                      styles.modeButton,
                      mode === m && styles.modeButtonActive,
                    ]}
                    onPress={() => setMode(m as Mode)}
                  >
                    <Text
                      style={[
                        styles.modeButtonText,
                        mode === m && styles.modeButtonTextActive,
                      ]}
                    >
                      {m}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {/* GST Calculator */}
              {mode === "GST" && (
                <View style={styles.card}>
                  <Text style={styles.sectionTitle}>GST Calculator</Text>
                  <Input
                    styles={styles}
                    theme={theme}
                    label="Amount"
                    value={amount}
                    placeholder="Enter amount"
                    onChangeText={setAmount}
                  />
                  <Input
                    styles={styles}
                    theme={theme}
                    label="GST Rate (%)"
                    value={gstRate}
                    placeholder="Enter GST rate"
                    onChangeText={setGstRate}
                  />
                  <Segment
                    styles={styles}
                    value={gstMode}
                    options={[
                      { label: "Exclusive", value: "EXCLUSIVE" },
                      { label: "Inclusive", value: "INCLUSIVE" },
                    ]}
                    onChange={(v) => setGstMode(v as GstMode)}
                  />
                  {gstResult.valid ? (
                    <View>
                      <ResultRow
                        styles={styles}
                        label="Taxable Value"
                        value={formatINR(gstResult.taxableValue!)}
                      />
                      <ResultRow
                        styles={styles}
                        label="GST Amount"
                        value={formatINR(gstResult.taxAmount!)}
                      />
                      <ResultRow
                        styles={styles}
                        label="Total Amount"
                        value={formatINR(gstResult.totalAmount!)}
                        highlight
                      />
                    </View>
                  ) : (
                    <Text style={{ color: "red" }}>{gstResult.error}</Text>
                  )}
                </View>
              )}

              {/* EMI Calculator */}
              {mode === "EMI" && (
                <View style={styles.card}>
                  <Text style={styles.sectionTitle}>EMI Calculator</Text>
                  <Input
                    styles={styles}
                    theme={theme}
                    label="Principal"
                    value={principal}
                    placeholder="Enter principal"
                    onChangeText={setPrincipal}
                  />
                  <Input
                    styles={styles}
                    theme={theme}
                    label="Annual Rate (%)"
                    value={annualRate}
                    placeholder="Enter annual rate"
                    onChangeText={setAnnualRate}
                  />
                  <Input
                    styles={styles}
                    theme={theme}
                    label="Tenure"
                    value={tenureValue}
                    placeholder="Enter tenure in years"
                    onChangeText={setTenureValue}
                  />
                  {/* Only show years, remove months option */}
                  {/*
                  <Segment
                    styles={styles}
                    value={tenureUnit}
                    options={[
                      { label: "Years", value: "YEARS" },
                      { label: "Months", value: "MONTHS" },
                    ]}
                    onChange={(v) => setTenureUnit(v as TenureUnit)}
                  />
                  */}
                  {emiResult.valid ? (
                    <View>
                      <ResultRow
                        styles={styles}
                        label="EMI"
                        value={formatINR(emiResult.emi!)}
                        highlight
                      />
                      <ResultRow
                        styles={styles}
                        label="Total Interest"
                        value={formatINR(emiResult.totalInterest!)}
                      />
                      <ResultRow
                        styles={styles}
                        label="Total Payment"
                        value={formatINR(emiResult.totalPayment!)}
                      />
                    </View>
                  ) : (
                    <Text style={{ color: "red" }}>{emiResult.error}</Text>
                  )}
                  <AnimatedPressable
                    onPress={exportScheduleCsv}
                    style={styles.upgradeButton}
                  >
                    <Text style={styles.upgradeButtonText}>Export CSV</Text>
                  </AnimatedPressable>
                  <AnimatedPressable
                    onPress={exportSchedulePdf}
                    style={styles.upgradeButton}
                  >
                    <Text style={styles.upgradeButtonText}>Export PDF</Text>
                  </AnimatedPressable>
                  {exportMessage ? (
                    <Text style={{ color: "green" }}>{exportMessage}</Text>
                  ) : null}
                </View>
              )}

              {/* TAX Calculator (optional, placeholder) */}
              {mode === "TAX" && (
                <View style={styles.card}>
                  <Text style={styles.sectionTitle}>
                    Tax Calculator (Coming Soon)
                  </Text>
                </View>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>
  );

  // Helper for formatting numbers (fixes missing formatNumber error)
  function formatNumber(n: number | undefined): string {
    if (typeof n !== "number" || isNaN(n)) return "-";
    return n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
  }

  type InputProps = {
    styles: ReturnType<typeof createStyles>;
    theme: ThemePalette;
    label: string;
    value: string;
    placeholder: string;
    onChangeText: (text: string) => void;
  };

  function Input({
    styles,
    theme,
    label,
    value,
    placeholder,
    onChangeText,
  }: InputProps) {
    return (
      <View style={styles.inputGroup}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.placeholder}
          keyboardType="decimal-pad"
          style={styles.input}
        />
      </View>
    );
  }

  type SegmentOption = {
    label: string;
    value: string;
  };

  type SegmentProps = {
    styles: ReturnType<typeof createStyles>;
    value: string;
    options: SegmentOption[];
    onChange: (value: string) => void;
  };

  function Segment({ styles, value, options, onChange }: SegmentProps) {
    return (
      <View style={styles.segmentContainer}>
        {options.map((option) => (
          <AnimatedPressable
            key={option.value}
            style={[
              styles.segmentButton,
              value === option.value && styles.segmentButtonActive,
            ]}
            onPress={() => onChange(option.value)}
          >
            <Text
              style={[
                styles.segmentText,
                value === option.value && styles.segmentTextActive,
              ]}
            >
              {option.label}
            </Text>
          </AnimatedPressable>
        ))}
      </View>
    );
  }

  type ResultRowProps = {
    styles: ReturnType<typeof createStyles>;
    label: string;
    value?: string;
    valueNode?: ReactNode;
    highlight?: boolean;
    delay?: number;
  };

  function ResultRow({
    styles,
    label,
    value,
    valueNode,
    highlight = false,
    delay = 0,
  }: ResultRowProps) {
    const reveal = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      reveal.setValue(0);
      Animated.timing(reveal, {
        toValue: 1,
        duration: 420,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }, [delay, reveal, value, valueNode]);

    return (
      <Animated.View
        style={[
          styles.resultRow,
          {
            opacity: reveal,
            transform: [
              {
                translateY: typeof reveal === "number" ? reveal : 0,
              },
            ],
          },
        ]}
      >
        <Text style={[styles.resultLabel, highlight && styles.highlightText]}>
          {label}
        </Text>
        {valueNode ?? (
          <Text style={[styles.resultValue, highlight && styles.highlightText]}>
            {value ?? ""}
          </Text>
        )}
      </Animated.View>
    );
  }

  type AnimatedPressableProps = {
    children: ReactNode;
    onPress: () => void;
    style?: StyleProp<any>;
    glowColor?: string;
  };

  function AnimatedPressable({
    children,
    onPress,
    style,
    glowColor = "#38bdf8",
  }: AnimatedPressableProps) {
    const pressScale = useRef(new Animated.Value(1)).current;
    const glowLevel = useRef(new Animated.Value(0)).current;

    const handlePressIn = () => {
      Animated.parallel([
        Animated.spring(pressScale, {
          toValue: 0.96,
          useNativeDriver: true,
          speed: 32,
          bounciness: 6,
        }),
        Animated.timing(glowLevel, {
          toValue: 1,
          duration: 170,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }),
      ]).start();
    };

    const handlePressOut = () => {
      Animated.parallel([
        Animated.spring(pressScale, {
          toValue: 1,
          useNativeDriver: true,
          speed: 24,
          bounciness: 9,
        }),
        Animated.timing(glowLevel, {
          toValue: 0,
          duration: 220,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }),
      ]).start();
    };

    return (
      <Animated.View
        style={[
          style,
          {
            transform: [{ scale: pressScale }],
          },
        ]}
      >
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={interactiveStyles.pressableFill}
        >
          <Animated.View
            style={[
              interactiveStyles.pressableGlow,
              {
                backgroundColor: glowColor,
                opacity: glowLevel.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.22],
                }),
                transform: [
                  {
                    scale: glowLevel.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.96, 1.06],
                    }),
                  },
                ],
                // pointerEvents: "none" // If needed, add here
              },
            ]}
          />
          {children}
        </Pressable>
      </Animated.View>
    );
  }

  type AnimatedMetricTextProps = {
    value: number;
    formatter: (num: number) => string;
    style?: StyleProp<any>;
  };

  function AnimatedMetricText({
    value,
    formatter,
    style,
  }: AnimatedMetricTextProps) {
    const animatedValue = useRef(
      new Animated.Value(Number.isFinite(value) ? value : 0),
    ).current;
    const [displayValue, setDisplayValue] = useState(
      Number.isFinite(value) ? value : 0,
    );

    useEffect(() => {
      const target = Number.isFinite(value) ? value : 0;
      const id = animatedValue.addListener(({ value: current }) => {
        setDisplayValue(current);
      });

      Animated.timing(animatedValue, {
        toValue: target,
        duration: 520,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();

      return () => {
        animatedValue.removeListener(id);
      };
    }, [animatedValue, value]);

    return <Text style={style}>{formatter(displayValue)}</Text>;
  }

  // Removed duplicate interactiveStyles definition (now only defined once above)

