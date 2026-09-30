import React from 'react';
import { Info, Cpu } from 'lucide-react';
import { PROTOTYPE_DISCLAIMER_TEXT } from '../../utils/constants';

export const PrototypeDisclaimer = ({ compact = false }) => {
  if (compact) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-medium text-amber-800">
        <Cpu className="h-3.5 w-3.5 text-amber-600" />
        Prototype Simulated Downscaling
      </span>
    );
  }

  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-xs sm:text-sm text-amber-900 shadow-sm">
      <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
      <div>
        <span className="font-semibold text-amber-950">
          
        </span>
        <span></span>
      </div>
    </div>
  );
};
