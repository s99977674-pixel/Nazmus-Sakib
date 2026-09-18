import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, Check, Globe, Plus, Sparkles } from 'lucide-react';
import { Currency } from '../types';
import { ALL_CURRENCIES, POPULAR_CURRENCIES, searchCurrencies } from '../data/currencies';

interface CurrencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCurrency: Currency;
  onSelectCurrency: (currency: Currency) => void;
}

export const CurrencyModal: React.FC<CurrencyModalProps> = ({
  isOpen,
  onClose,
  selectedCurrency,
  onSelectCurrency,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'browse' | 'custom'>('browse');
  const inputRef = useRef<HTMLInputElement>(null);

  // Custom currency fields
  const [customCode, setCustomCode] = useState('CUSTOM');
  const [customSymbol, setCustomSymbol] = useState('$');
  const [customName, setCustomName] = useState('Custom Unit');
  const [customDecimals, setCustomDecimals] = useState(2);

  useEffect(() => {
    if (isOpen) {
      if (activeTab === 'browse') {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }
    } else {
      setSearchQuery('');
    }
  }, [isOpen, activeTab]);

  const filteredCurrencies = useMemo(() => {
    return searchCurrencies(searchQuery);
  }, [searchQuery]);

  const popularList = useMemo(() => {
    return POPULAR_CURRENCIES.map((code) =>
      ALL_CURRENCIES.find((c) => c.code === code)
    ).filter(Boolean) as Currency[];
  }, []);

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = (customCode.trim() || 'CUSTOM').toUpperCase();
    const cleanSymbol = customSymbol.trim() || '$';
    const cleanName = customName.trim() || 'Custom Currency';

    const customCurr: Currency = {
      code: cleanCode,
      symbol: cleanSymbol,
      name: cleanName,
      decimals: Math.max(0, Math.min(8, customDecimals)),
      isCustom: true,
    };

    onSelectCurrency(customCurr);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg max-h-[88vh] sm:max-h-[82vh] flex flex-col bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Select Display Currency
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                All ISO 4217 currencies + Custom Currency
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Close currency modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 px-4 bg-slate-50/70 dark:bg-slate-950/40">
          <button
            onClick={() => setActiveTab('browse')}
            className={`py-2.5 px-3 text-xs font-bold border-b-2 transition ${
              activeTab === 'browse'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            All Currencies (ISO 4217)
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`py-2.5 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'custom'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Custom Currency</span>
          </button>
        </div>

        {activeTab === 'custom' ? (
          /* Custom Currency Form */
          <form onSubmit={handleApplyCustom} className="p-5 space-y-4 overflow-y-auto">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
              <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                Enter your custom currency symbol and code (e.g., USDT, Points, Gold). It will be formatted across all calculations and PDF sheets.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Currency Symbol
                </label>
                <input
                  type="text"
                  value={customSymbol}
                  onChange={(e) => setCustomSymbol(e.target.value)}
                  placeholder="e.g. ₮, $, ★"
                  maxLength={6}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Currency Code
                </label>
                <input
                  type="text"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                  placeholder="e.g. USDT, PTS"
                  maxLength={8}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Currency Name
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Tether USDT or Custom Account"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Decimal Places
              </label>
              <select
                value={customDecimals}
                onChange={(e) => setCustomDecimals(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value={0}>0 (Whole numbers e.g. $10,000)</option>
                <option value={2}>2 (Standard e.g. $10,000.00)</option>
                <option value={4}>4 (High precision e.g. $10,000.0000)</option>
                <option value={8}>8 (Crypto precision e.g. $10,000.00000000)</option>
              </select>
            </div>

            <div className="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs">
              <span className="text-slate-400 uppercase tracking-wider text-[10px] block font-bold mb-1">Preview Format:</span>
              <span className="text-base font-bold text-slate-900 dark:text-white">
                {customSymbol}10,000{customDecimals > 0 ? '.' + '0'.repeat(customDecimals) : ''} {customCode}
              </span>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('browse')}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md active:scale-95 transition"
              >
                Use Custom Currency
              </button>
            </div>
          </form>
        ) : (
          /* Browse ISO 4217 Currencies */
          <>
            {/* Search Bar */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  ref={inputRef}
                  type="text"
                  id="currency-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by code (e.g. BDT, USD, INR, EUR), name, or symbol..."
                  className="w-full pl-10 pr-9 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Quick Select Popular Currencies */}
              {!searchQuery && (
                <div className="mt-3">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Popular Currencies
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {popularList.map((cur) => {
                      const isSelected = cur.code === selectedCurrency.code;
                      return (
                        <button
                          key={cur.code}
                          onClick={() => {
                            onSelectCurrency(cur);
                            onClose();
                          }}
                          className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                          }`}
                        >
                          <span className="font-bold">{cur.symbol}</span>
                          <span>{cur.code}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Currency List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 p-2">
              {filteredCurrencies.length === 0 ? (
                <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
                  No currencies match "{searchQuery}"
                </div>
              ) : (
                filteredCurrencies.map((cur) => {
                  const isSelected = cur.code === selectedCurrency.code;
                  return (
                    <button
                      key={cur.code}
                      onClick={() => {
                        onSelectCurrency(cur);
                        onClose();
                      }}
                      className={`w-full px-3.5 py-3 rounded-xl text-left flex items-center justify-between transition ${
                        isSelected
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-base text-slate-900 dark:text-white flex-shrink-0">
                          {cur.symbol}
                        </span>
                        <div className="truncate">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 dark:text-white">
                              {cur.code}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              {cur.name}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 dark:text-slate-500">
                            {cur.decimals} decimal places
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </>
        )}

        {/* Footer Note */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950/70 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Display only: Changing currency alters symbol and format notation. No exchange rate conversion is applied.
          </p>
        </div>
      </div>
    </div>
  );
};
