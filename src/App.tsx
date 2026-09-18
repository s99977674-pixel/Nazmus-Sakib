import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Currency, ThemeMode } from './types';
import { ALL_CURRENCIES, getCurrency } from './data/currencies';
import { calculateCompoundProfit, validateInputs } from './utils/calculator';
import { Header } from './components/Header';
import { CalculatorCard } from './components/CalculatorCard';
import { ResultsDashboard } from './components/ResultsDashboard';
import { DailyBreakdown } from './components/DailyBreakdown';
import { DisclaimerCard } from './components/DisclaimerCard';
import { CurrencyModal } from './components/CurrencyModal';
import { AndroidAppInfoModal } from './components/AndroidAppInfoModal';
import { SplashScreen } from './components/SplashScreen';

const DEFAULT_INVESTMENT = '10000';
const DEFAULT_DAILY_RATE = '2.5';
const DEFAULT_DAYS = '30';
const DEFAULT_CURRENCY_CODE = 'BDT';

export default function App() {
  // Splash screen state
  const [showSplash, setShowSplash] = useState<boolean>(true);

  // Theme state (localStorage persisted)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('sakib_calc_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  // User custom logo (localStorage persisted)
  const [userLogo, setUserLogo] = useState<string | null>(() => {
    try {
      return localStorage.getItem('sakib_calc_user_logo');
    } catch {
      return null;
    }
  });

  // Currency state (localStorage persisted, supports custom currencies)
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(() => {
    try {
      const savedCustom = localStorage.getItem('sakib_calc_custom_currency');
      if (savedCustom) {
        const parsed = JSON.parse(savedCustom);
        if (parsed && parsed.code) return parsed;
      }
      const savedCode = localStorage.getItem('sakib_calc_currency');
      if (savedCode) return getCurrency(savedCode);
    } catch {
      // ignore
    }
    return getCurrency(DEFAULT_CURRENCY_CODE);
  });

  // Calculator inputs state (localStorage persisted)
  const [investmentStr, setInvestmentStr] = useState<string>(() => {
    try {
      return localStorage.getItem('sakib_calc_investment') || DEFAULT_INVESTMENT;
    } catch {
      return DEFAULT_INVESTMENT;
    }
  });

  const [dailyRateStr, setDailyRateStr] = useState<string>(() => {
    try {
      return localStorage.getItem('sakib_calc_rate') || DEFAULT_DAILY_RATE;
    } catch {
      return DEFAULT_DAILY_RATE;
    }
  });

  const [daysStr, setDaysStr] = useState<string>(() => {
    try {
      return localStorage.getItem('sakib_calc_days') || DEFAULT_DAYS;
    } catch {
      return DEFAULT_DAYS;
    }
  });

  // Modals state
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState<boolean>(false);
  const [isAndroidGuideOpen, setIsAndroidGuideOpen] = useState<boolean>(false);

  // Sync theme class to documentElement
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('sakib_calc_theme', theme);
    } catch {}
  }, [theme]);

  // Persist currency
  useEffect(() => {
    try {
      localStorage.setItem('sakib_calc_currency', selectedCurrency.code);
    } catch {}
  }, [selectedCurrency]);

  // Persist calculator inputs
  useEffect(() => {
    try {
      localStorage.setItem('sakib_calc_investment', investmentStr);
      localStorage.setItem('sakib_calc_rate', dailyRateStr);
      localStorage.setItem('sakib_calc_days', daysStr);
    } catch {}
  }, [investmentStr, dailyRateStr, daysStr]);

  // Android back button handling: close modals first if open
  useEffect(() => {
    const handlePopState = () => {
      if (isCurrencyModalOpen) {
        setIsCurrencyModalOpen(false);
      } else if (isAndroidGuideOpen) {
        setIsAndroidGuideOpen(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isCurrencyModalOpen, isAndroidGuideOpen]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // Validation
  const validation = useMemo(() => {
    return validateInputs(investmentStr, dailyRateStr, daysStr);
  }, [investmentStr, dailyRateStr, daysStr]);

  // Logo upload and reset handlers
  const handleUploadLogo = useCallback((dataUrl: string) => {
    setUserLogo(dataUrl);
    try {
      localStorage.setItem('sakib_calc_user_logo', dataUrl);
    } catch (e) {
      console.warn('Could not save logo to localStorage:', e);
    }
  }, []);

  const handleResetLogo = useCallback(() => {
    setUserLogo(null);
    try {
      localStorage.removeItem('sakib_calc_user_logo');
    } catch {}
  }, []);

  // Currency select handler
  const handleSelectCurrency = useCallback((currency: Currency) => {
    setSelectedCurrency(currency);
    try {
      if (currency.isCustom) {
        localStorage.setItem('sakib_calc_custom_currency', JSON.stringify(currency));
      }
      localStorage.setItem('sakib_calc_currency', currency.code);
    } catch {}
  }, []);

  // Calculation Result (updates dynamically when inputs or currency change)
  const calculationResult = useMemo(() => {
    if (!validation.isValid) return null;
    return calculateCompoundProfit({
      investment: validation.parsed.investment,
      dailyRate: validation.parsed.dailyRate,
      days: validation.parsed.days,
      currencyCode: selectedCurrency.code,
      currency: selectedCurrency,
    });
  }, [validation, selectedCurrency]);

  // Explicit Calculate Button Handler
  const handleCalculate = useCallback(() => {
    const resultsElem = document.getElementById('results-section');
    if (resultsElem) {
      resultsElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Reset functionality
  const handleReset = useCallback(() => {
    setInvestmentStr(DEFAULT_INVESTMENT);
    setDailyRateStr(DEFAULT_DAILY_RATE);
    setDaysStr(DEFAULT_DAYS);
    setSelectedCurrency(getCurrency(DEFAULT_CURRENCY_CODE));
    try {
      localStorage.removeItem('sakib_calc_investment');
      localStorage.removeItem('sakib_calc_rate');
      localStorage.removeItem('sakib_calc_days');
      localStorage.removeItem('sakib_calc_custom_currency');
    } catch {}
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Splash Screen */}
      {showSplash && <SplashScreen userLogo={userLogo} onFinish={() => setShowSplash(false)} />}

      {/* App Header */}
      <Header
        theme={theme}
        userLogo={userLogo}
        onToggleTheme={toggleTheme}
        onReset={handleReset}
        onOpenAndroidGuide={() => setIsAndroidGuideOpen(true)}
        onUploadLogo={handleUploadLogo}
        onResetLogo={handleResetLogo}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Calculator Card */}
        <section aria-label="Investment Inputs">
          <CalculatorCard
            investmentStr={investmentStr}
            dailyRateStr={dailyRateStr}
            daysStr={daysStr}
            currency={selectedCurrency}
            errors={validation.errors}
            onChangeInvestment={setInvestmentStr}
            onChangeDailyRate={setDailyRateStr}
            onChangeDays={setDaysStr}
            onOpenCurrencyModal={() => setIsCurrencyModalOpen(true)}
            onReset={handleReset}
            onCalculate={handleCalculate}
          />
        </section>

        {/* Results Section */}
        <section id="results-section" aria-label="Projection Results">
          <ResultsDashboard result={calculationResult} userLogo={userLogo} />
        </section>

        {/* Daily Breakdown Table */}
        {calculationResult && (
          <section aria-label="Daily Progression Breakdown">
            <DailyBreakdown result={calculationResult} />
          </section>
        )}

        {/* Disclaimer Section */}
        <section aria-label="Legal and Financial Disclaimer">
          <DisclaimerCard />
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">Nazmus Sakib</span>
            <span>•</span>
            <span>Investment Calculator</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAndroidGuideOpen(true)}
              className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
            >
              Android APK Build Guide
            </button>
            <span>•</span>
            <span className="font-mono text-[11px] text-slate-400">com.nazmussakib.investmentcalculator</span>
          </div>
        </div>
      </footer>

      {/* Searchable Currency Modal */}
      <CurrencyModal
        isOpen={isCurrencyModalOpen}
        onClose={() => setIsCurrencyModalOpen(false)}
        selectedCurrency={selectedCurrency}
        onSelectCurrency={handleSelectCurrency}
      />

      {/* Android APK Compilation Info Modal */}
      <AndroidAppInfoModal
        isOpen={isAndroidGuideOpen}
        onClose={() => setIsAndroidGuideOpen(false)}
      />
    </div>
  );
}
