import React, { useState, useMemo } from 'react';
import {
  Table,
  Search,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  BarChart2,
  Calendar,
} from 'lucide-react';
import { CalculationResult } from '../types';
import { formatCurrencyAmount } from '../data/currencies';

interface DailyBreakdownProps {
  result: CalculationResult | null;
}

export const DailyBreakdown: React.FC<DailyBreakdownProps> = ({ result }) => {
  const [pageSize, setPageSize] = useState<number>(15);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filterDayQuery, setFilterDayQuery] = useState<string>('');

  if (!result || result.dailyRecords.length === 0) {
    return null;
  }

  const { dailyRecords, currency, days } = result;

  // Filter by day number if user entered a query
  const filteredRecords = useMemo(() => {
    if (!filterDayQuery.trim()) return dailyRecords;
    const q = filterDayQuery.trim();
    return dailyRecords.filter((r) => r.day.toString().includes(q));
  }, [dailyRecords, filterDayQuery]);

  // Pagination calculation
  const totalPages = pageSize === -1 ? 1 : Math.ceil(filteredRecords.length / pageSize);
  const safeCurrentPage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages));

  const displayedRecords = useMemo(() => {
    if (pageSize === -1) return filteredRecords;
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, safeCurrentPage, pageSize]);

  // Statistics
  const avgDailyProfit = result.totalProfit / result.days;
  const maxDailyProfit = dailyRecords.length > 0 ? dailyRecords[dailyRecords.length - 1].dailyProfit : 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden transition-colors">
      {/* Header section */}
      <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Daily Compound Breakdown</span>
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {days} {days === 1 ? 'Day' : 'Days'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Day-by-day progression showing starting balance, daily accrued profit, and ending balance
          </p>
        </div>

        {/* Filter and Page Size Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Day Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              id="filter-day-input"
              value={filterDayQuery}
              onChange={(e) => {
                setFilterDayQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Find Day #..."
              className="w-28 sm:w-32 pl-8 pr-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Rows Per Page */}
          <select
            id="select-page-size"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value={15}>15 / page</option>
            <option value={30}>30 / page</option>
            <option value={50}>50 / page</option>
            <option value={100}>100 / page</option>
            <option value={-1}>Show All</option>
          </select>
        </div>
      </div>

      {/* Quick Stat Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-3 divide-x divide-slate-100 dark:divide-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 text-xs py-3 px-4">
        <div className="px-2">
          <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
            Day 1 Profit
          </span>
          <span className="font-bold text-slate-800 dark:text-slate-200">
            {dailyRecords.length > 0 ? formatCurrencyAmount(dailyRecords[0].dailyProfit, currency) : '-'}
          </span>
        </div>
        <div className="px-2">
          <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
            Average Daily Profit
          </span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">
            {formatCurrencyAmount(avgDailyProfit, currency)}
          </span>
        </div>
        <div className="px-2 col-span-2 sm:col-span-1 mt-2 sm:mt-0">
          <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
            Final Day Profit
          </span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">
            {formatCurrencyAmount(maxDailyProfit, currency)}
          </span>
        </div>
      </div>

      {/* Table for Mobile & Desktop */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-100/70 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200/80 dark:border-slate-700/80">
            <tr>
              <th className="py-3 px-3 sm:px-4">Day</th>
              <th className="py-3 px-3 sm:px-4 text-right">Starting Balance</th>
              <th className="py-3 px-3 sm:px-4 text-right">Daily Profit</th>
              <th className="py-3 px-3 sm:px-4 text-right">Ending Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {displayedRecords.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-400">
                  No records found matching Day #{filterDayQuery}
                </td>
              </tr>
            ) : (
              displayedRecords.map((record) => (
                <tr
                  key={record.day}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-900 dark:text-white">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-xs">
                      Day {record.day}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-right font-medium text-slate-700 dark:text-slate-300">
                    {formatCurrencyAmount(record.startingBalance, currency)}
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                    +{formatCurrencyAmount(record.dailyProfit, currency)}
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-right font-bold text-slate-900 dark:text-white">
                    {formatCurrencyAmount(record.endingBalance, currency)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {pageSize !== -1 && totalPages > 1 && (
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div>
            Showing {(safeCurrentPage - 1) * pageSize + 1} to{' '}
            {Math.min(safeCurrentPage * pageSize, filteredRecords.length)} of{' '}
            {filteredRecords.length} days
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safeCurrentPage <= 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium">
              {safeCurrentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safeCurrentPage >= totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
