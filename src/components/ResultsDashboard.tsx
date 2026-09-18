import React, { useState } from 'react';
import {
  TrendingUp,
  Wallet,
  Calendar,
  Percent,
  FileDown,
  Printer,
  Share2,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';
import { CalculationResult } from '../types';
import { formatCurrencyAmount } from '../data/currencies';
import { generateResultPDF, triggerPrintResultSheet } from '../utils/pdfGenerator';

interface ResultsDashboardProps {
  result: CalculationResult | null;
  userLogo?: string | null;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result, userLogo }) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSharingPDF, setIsSharingPDF] = useState(false);
  const [pdfSuccessToast, setPdfSuccessToast] = useState(false);

  if (!result) {
    return (
      <div className="bg-slate-100/60 dark:bg-slate-900/40 rounded-2xl p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 text-center">
        <div className="w-12 h-12 mx-auto rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-3">
          <TrendingUp className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">
          Awaiting Calculation Input
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
          Please enter valid investment parameters above to view projected compound returns and breakdown.
        </p>
      </div>
    );
  }

  const {
    initialInvestment,
    dailyRate,
    days,
    currency,
    totalProfit,
    finalBalance,
  } = result;

  const returnPercentage = initialInvestment > 0 ? (totalProfit / initialInvestment) * 100 : 0;

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      await generateResultPDF(result, userLogo || undefined, 'download');
      setPdfSuccessToast(true);
      setTimeout(() => setPdfSuccessToast(false), 3500);
    } catch (err) {
      console.error('Error generating PDF:', err);
      triggerPrintResultSheet();
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleSharePDF = async () => {
    setIsSharingPDF(true);
    try {
      await generateResultPDF(result, userLogo || undefined, 'share');
    } catch (err) {
      console.error('Error sharing PDF:', err);
    } finally {
      setIsSharingPDF(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header with Title and PDF Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-5 sm:p-6 rounded-2xl shadow-xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <Sparkles className="w-3 h-3" />
              Mathematical Projection
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Projection Overview
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Compounded over {days} {days === 1 ? 'day' : 'days'} at {dailyRate}% daily target
          </p>
        </div>

        {/* Primary Download Result PDF Action & Share */}
        <div className="relative z-10 flex flex-wrap sm:flex-nowrap items-center gap-2">
          <button
            id="btn-download-pdf"
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 shadow-lg shadow-emerald-500/25 transition disabled:opacity-50 active:scale-95 cursor-pointer"
          >
            {isGeneratingPDF ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4" />
                <span>Download Result PDF</span>
              </>
            )}
          </button>

          {/* Share PDF Button */}
          <button
            id="btn-share-pdf"
            onClick={handleSharePDF}
            disabled={isSharingPDF}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/10 transition active:scale-95 flex items-center gap-1.5"
            title="Share PDF via Android Share Sheet"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>

          <button
            id="btn-print-sheet"
            onClick={triggerPrintResultSheet}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/10 transition active:scale-95"
            title="Print or Save via Android Print Service"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Success Toast */}
      {pdfSuccessToast && (
        <div className="flex items-center gap-2 p-3 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 rounded-xl border border-emerald-300 dark:border-emerald-800 text-xs font-medium animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span>PDF Result Sheet successfully generated and downloaded with logo watermark!</span>
        </div>
      )}

      {/* Result Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {/* Card 1: Initial Investment */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Initial Investment</span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
              <Wallet className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {formatCurrencyAmount(initialInvestment, currency)}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Starting principal capital
            </p>
          </div>
        </div>

        {/* Card 2: Daily Target Profit */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Daily Target Profit</span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
              <Percent className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {dailyRate.toFixed(2)}%
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Compounded every 24 hours
            </p>
          </div>
        </div>

        {/* Card 3: Investment Duration */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Investment Duration</span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {days} {days === 1 ? 'Day' : 'Days'}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Continuous compound cycle
            </p>
          </div>
        </div>

        {/* Card 4: Total Profit (Highlighted) */}
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/40 dark:to-emerald-900/20 p-4 sm:p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Projected Profit</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-300 tracking-tight">
              +{formatCurrencyAmount(totalProfit, currency)}
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                +{returnPercentage.toFixed(2)}%
              </span>
              <span className="text-[11px] text-emerald-600/80 dark:text-emerald-400/70">
                total growth
              </span>
            </div>
          </div>
        </div>

        {/* Card 5: Final Balance (Hero Metric) */}
        <div className="sm:col-span-2 bg-gradient-to-br from-blue-50 via-indigo-50/40 to-slate-50 dark:from-slate-900 dark:via-indigo-950/30 dark:to-slate-900 p-5 sm:p-6 rounded-2xl border border-blue-200/80 dark:border-indigo-900/60 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-blue-900 dark:text-indigo-300 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Projected Final Balance</span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-indigo-950 text-blue-800 dark:text-indigo-300">
              Principal + Profit
            </span>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-blue-900 dark:text-white tracking-tight">
              {formatCurrencyAmount(finalBalance, currency)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
              Accumulated balance after {days} days of compounding returns
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
