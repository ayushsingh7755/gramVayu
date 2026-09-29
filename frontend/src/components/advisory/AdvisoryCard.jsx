import React from 'react';
import {
  Sprout,
  MapPin,
  CloudSun,
  Calendar,
  CheckCircle2,
  Paperclip,
  Trash2,
} from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';
import { formatDate } from '../../utils/formatters';

export const AdvisoryCard = ({ advisory, canManage = false, onDelete }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
              <Sprout className="h-3.5 w-3.5 text-emerald-600" />
              {advisory.crop}
            </span>
            <span className="rounded-md bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-xs font-medium text-blue-800 capitalize">
              {advisory.category?.replace('_', ' ')}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-0.5 text-xs text-slate-700">
              <CloudSun className="h-3.5 w-3.5 text-amber-600" />
              {advisory.weatherCondition}
            </span>
          </div>

          <RiskBadge level={advisory.severity} />
        </div>

        <h3 className="text-base font-bold text-slate-900 mt-2">
          {advisory.title}
        </h3>
        <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
          {advisory.description}
        </p>

        {advisory.recommendations?.length > 0 && (
          <div className="mt-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 p-3.5">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-2">
              Actionable Farmer Recommendations:
            </p>
            <ul className="space-y-1.5">
              {advisory.recommendations.map((rec, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-xs sm:text-sm text-slate-800"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {advisory.attachments?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {advisory.attachments.map((att, idx) => (
              <a
                key={idx}
                href={att.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-50"
              >
                <Paperclip className="h-3.5 w-3.5" />
                {att.name || 'View Advisory Attachment'}
              </a>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            {advisory.panchayat?.name
              ? `${advisory.panchayat.name} (${advisory.block?.name || 'Block'})`
              : `All Panchayats in ${advisory.block?.name || 'Block'}`}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            {formatDate(advisory.createdAt)}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {advisory.createdBy?.name && (
            <span className="text-slate-500">
              Issued by: <strong>{advisory.createdBy.name}</strong>
            </span>
          )}
          {canManage && onDelete && (
            <button
              onClick={() => onDelete(advisory._id)}
              className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 font-medium"
              title="Delete Advisory"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
