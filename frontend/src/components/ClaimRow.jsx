import { ExternalLink } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function ClaimRow({
  index,
  claim,
  status,
  explanation,
  correct_fact,
  source,
}) {
  return (
    <tr className={`border-b border-slate-700 ${index % 2 === 0 ? 'bg-slate-900/20' : ''} hover:bg-slate-800/30 transition`}>
      <td className="px-4 py-3 text-sm text-slate-400 font-mono">{index + 1}</td>
      <td className="px-4 py-3 text-sm max-w-xs truncate" title={claim}>
        {claim}
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={status} />
      </td>
      <td className="px-4 py-3 text-sm text-slate-300">{explanation}</td>
      <td className="px-4 py-3 text-sm text-slate-400">
        {correct_fact ? correct_fact : '—'}
      </td>
      <td className="px-4 py-3 text-sm">
        {source ? (
          <a
            href={source}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-primary hover:text-brand-hover flex items-center gap-1 transition"
          >
            View Source
            <ExternalLink size={14} />
          </a>
        ) : (
          '—'
        )}
      </td>
    </tr>
  );
}
