import React from 'react';
import {
  DollarSign,
  Percent,
  Calendar,
  ChevronDown,
  RotateCcw,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { Currency } from '../types';
import { ValidationErrors } from '../utils/calculator';

interface CalculatorCardProps {
  investmentStr: string;
  dailyRateStr: string;
  daysStr: string;
  currency: Currency;
  errors: ValidationErrors;
  onChangeInvestment: (val: string) => void;
  onChangeDailyRate: (val: string) => void;
  onChangeDays: (val: string) => void;
  onOpenCurrencyModal: () => void;
  onReset: () => void;
  onCalculate?: () => void;
}

export const CalculatorCard: React.FC<CalculatorCardProps> = ({
  investmentStr,
  dailyRateStr,
  daysStr,
  currency,
  errors,
  onChangeInvestment,
  onChangeDailyRate,
  onChangeDays,
  onOpenCurrencyModal,
  onReset,
  onCalculate,
}) => {
  const quickRates = ['1.0', '1.5', '2.0', '2.5', '3.0', '5.0'];
  const quickDurations = ['7', '15', '30', '60', '90', '180', '365'];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Projection Parameters</span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              Compound
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure capital, daily growth rate, duration, and display currency
          </p>
        </div>

        <button
          onClick={onReset}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title="Reset values to default"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      <div className="mt-5 space-y-5">
        {/* Row: Currency Picker */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
            Display Currency
          </label>
          <button
            type="button"
            id="currency-selector-btn"
            onClick={onOpenCurrencyModal}
            className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-emerald-500 dark:hover:border-emerald-500 transition text-left group"
          >
            <div className="flex items-center gap-3 truncate">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-base flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/20">
                {currency.symbol}
              </span>
              <div className="truncate">
                <span className="font-bold text-sm text-slate-900 dark:text-white mr-2">
                  {currency.code}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {currency.name}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 group-hover:text-emerald-500 transition flex-shrink-0">
              <span>Change</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </button>
        </div>

        {/* Input A: Investment Amount */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="input-investment"
              className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300"
            >
              Investment Amount <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400 font-medium">
              Numeric • Decimals allowed
            </span>
          </div>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-emerald-600 dark:text-emerald-400 text-base pointer-events-none select-none">
              {currency.symbol}
            </div>
            <input
              id="input-investment"
              type="number"
              step="any"
              min="0"
              inputMode="decimal"
              value={investmentStr}
              onChange={(e) => onChangeInvestment(e.target.value)}
              placeholder="e.g. 10000"
              className={`w-full pl-10 pr-4 py-3 text-base font-semibold bg-slate-50 dark:bg-slate-800/80 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-800 transition ${
                errors.investment
                  ? 'border-rose-300 dark:border-rose-700 bg-rose-50/30'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            />
          </div>
          {errors.investment && (
            <p className="mt-1.5 text-xs text-rose-500 dark:text-rose-400 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.investment}</span>
            </p>
          )}
        </div>

        {/* Input B: Daily Target Profit % */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="input-daily-rate"
              className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300"
            >
              Daily Target Profit (%) <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400 font-medium">
              Compound daily percentage
            </span>
          </div>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none select-none">
              <Percent className="w-4 h-4" />
            </div>
            <input
              id="input-daily-rate"
              type="number"
              step="0.01"
              min="0"
              inputMode="decimal"
              value={dailyRateStr}
              onChange={(e) => onChangeDailyRate(e.target.value)}
              placeholder="e.g. 2.5"
              className={`w-full pl-10 pr-12 py-3 text-base font-semibold bg-slate-50 dark:bg-slate-800/80 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-800 transition ${
                errors.dailyRate
                  ? 'border-rose-300 dark:border-rose-700 bg-rose-50/30'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
              %/day
            </span>
          </div>
          {errors.dailyRate && (
            <p className="mt-1.5 text-xs text-rose-500 dark:text-rose-400 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.dailyRate}</span>
            </p>
          )}

          {/* Quick Rate Presets */}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-400 font-semibold mr-1">Presets:</span>
            {quickRates.map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => onChangeDailyRate(rate)}
                className={`px-2 py-0.5 text-xs rounded-md transition font-medium ${
                  dailyRateStr === rate
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {rate}%
              </button>
            ))}
          </div>
        </div>

        {/* Input C: Investment Duration */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="input-duration"
              className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300"
            >
              Investment Duration (Days) <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400 font-medium">
              Integer number of days
            </span>
          </div>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none select-none">
              <Calendar className="w-4 h-4" />
            </div>
            <input
              id="input-duration"
              type="number"
              step="1"
              min="1"
              max="3650"
              inputMode="numeric"
              value={daysStr}
              onChange={(e) => onChangeDays(e.target.value)}
              placeholder="e.g. 30"
              className={`w-full pl-10 pr-14 py-3 text-base font-semibold bg-slate-50 dark:bg-slate-800/80 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-800 transition ${
                errors.days
                  ? 'border-rose-300 dark:border-rose-700 bg-rose-50/30'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
              Days
            </span>
          </div>
          {errors.days && (
            <p className="mt-1.5 text-xs text-rose-500 dark:text-rose-400 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.days}</span>
            </p>
          )}

          {/* Quick Duration Presets */}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-400 font-semibold mr-1">Presets:</span>
            {quickDurations.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => onChangeDays(d)}
                className={`px-2 py-0.5 text-xs rounded-md transition font-medium ${
                  daysStr === d
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons: Calculate & Reset */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            id="btn-calculate-projection"
            onClick={onCalculate}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 active:scale-[0.98] transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Calculate Projection</span>
          </button>
          <button
            type="button"
            id="btn-reset-calculator"
            onClick={onReset}
            className="w-full sm:w-auto py-3.5 px-5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm border border-slate-200 dark:border-slate-700 transition flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
