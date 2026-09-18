import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';

export const DisclaimerCard: React.FC = () => {
  return (
    <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 rounded-2xl p-4 sm:p-5 text-amber-900 dark:text-amber-200 text-xs leading-relaxed transition-colors">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
          <ShieldAlert className="w-4 h-4" />
        </div>
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
            Important Disclaimer / দাবিত্যাগ
          </h4>
          <p className="font-medium text-slate-800 dark:text-slate-200">
            এই ফলাফল ব্যবহারকারীর দেওয়া তথ্যের ভিত্তিতে গাণিতিক হিসাব মাত্র। এটি নিশ্চিত মুনাফার নিশ্চয়তা বা আর্থিক পরামর্শ নয়।
          </p>
          <p className="text-slate-600 dark:text-slate-400">
            These results are mathematical projections based on the entered assumptions and are not guaranteed returns or financial advice.
          </p>
        </div>
      </div>
    </div>
  );
};
