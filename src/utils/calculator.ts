import { CalculationResult, CalculatorInputs, DailyRecord } from '../types';
import { getCurrency } from '../data/currencies';

export interface ValidationErrors {
  investment?: string;
  dailyRate?: string;
  days?: string;
}

export function validateInputs(
  investmentStr: string,
  dailyRateStr: string,
  daysStr: string
): { isValid: boolean; errors: ValidationErrors; parsed: { investment: number; dailyRate: number; days: number } } {
  const errors: ValidationErrors = {};

  const cleanInv = investmentStr.trim().replace(/,/g, '');
  const cleanRate = dailyRateStr.trim().replace(/%/g, '');
  const cleanDays = daysStr.trim();

  const investment = parseFloat(cleanInv);
  const dailyRate = parseFloat(cleanRate);
  const days = parseInt(cleanDays, 10);

  if (!cleanInv || isNaN(investment)) {
    errors.investment = 'Investment amount is required and must be a valid number.';
  } else if (investment <= 0) {
    errors.investment = 'Investment amount must be greater than 0.';
  } else if (!isFinite(investment) || investment > 1e14) {
    errors.investment = 'Investment amount is too large to calculate accurately.';
  }

  if (!cleanRate || isNaN(dailyRate)) {
    errors.dailyRate = 'Daily target profit percentage is required.';
  } else if (dailyRate < 0) {
    errors.dailyRate = 'Daily profit rate cannot be negative.';
  } else if (dailyRate > 1000) {
    errors.dailyRate = 'Daily profit rate exceeds reasonable bounds (max 1,000%).';
  }

  if (!cleanDays || isNaN(days)) {
    errors.days = 'Duration in days is required.';
  } else if (days <= 0) {
    errors.days = 'Duration must be at least 1 day.';
  } else if (!Number.isInteger(Number(cleanDays))) {
    errors.days = 'Duration must be a whole number of days.';
  } else if (days > 3650) {
    errors.days = 'Maximum duration limit is 3,650 days (10 years).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    parsed: {
      investment: isNaN(investment) ? 0 : investment,
      dailyRate: isNaN(dailyRate) ? 0 : dailyRate,
      days: isNaN(days) ? 0 : days,
    },
  };
}

export function calculateCompoundProfit(inputs: CalculatorInputs): CalculationResult | null {
  const { investment, dailyRate, days, currencyCode, currency: overrideCurrency } = inputs;
  const currency = overrideCurrency || getCurrency(currencyCode);

  if (investment <= 0 || dailyRate < 0 || days <= 0 || !isFinite(investment) || !isFinite(dailyRate) || !isFinite(days)) {
    return null;
  }

  const dailyRecords: DailyRecord[] = [];
  let currentBalance = investment;

  for (let day = 1; day <= days; day++) {
    const startingBalance = currentBalance;
    const dailyProfit = (startingBalance * dailyRate) / 100;
    const endingBalance = startingBalance + dailyProfit;

    // Guard against Infinity overflow
    if (!isFinite(endingBalance) || endingBalance > Number.MAX_SAFE_INTEGER * 1000) {
      dailyRecords.push({
        day,
        startingBalance,
        dailyProfit: isFinite(dailyProfit) ? dailyProfit : 0,
        endingBalance: isFinite(endingBalance) ? endingBalance : startingBalance,
      });
      break;
    }

    dailyRecords.push({
      day,
      startingBalance,
      dailyProfit,
      endingBalance,
    });

    currentBalance = endingBalance;
  }

  const finalBalance = currentBalance;
  const totalProfit = finalBalance - investment;

  const calculationDate = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return {
    initialInvestment: investment,
    dailyRate,
    days,
    currency,
    totalProfit,
    finalBalance,
    dailyRecords,
    calculationDate,
  };
}
