export interface Currency {
  code: string;
  name: string;
  symbol: string;
  decimals: number;
  isCustom?: boolean;
}

export interface CalculatorInputs {
  investment: number;
  dailyRate: number;
  days: number;
  currencyCode: string;
  currency?: Currency;
}

export interface DailyRecord {
  day: number;
  startingBalance: number;
  dailyProfit: number;
  endingBalance: number;
}

export interface CalculationResult {
  initialInvestment: number;
  dailyRate: number;
  days: number;
  currency: Currency;
  totalProfit: number;
  finalBalance: number;
  dailyRecords: DailyRecord[];
  calculationDate: string;
}

export type ThemeMode = 'light' | 'dark';
