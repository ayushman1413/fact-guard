import { CheckCircle, AlertCircle, XCircle, HelpCircle } from 'lucide-react';

export default function StatusBadge({ status }) {
  const statusConfig = {
    Verified: {
      bg: 'bg-green-900/30',
      text: 'text-green-400',
      icon: CheckCircle,
      label: '✅ Verified',
    },
    Inaccurate: {
      bg: 'bg-amber-900/30',
      text: 'text-amber-400',
      icon: AlertCircle,
      label: '⚠️ Inaccurate',
    },
    False: {
      bg: 'bg-red-900/30',
      text: 'text-red-400',
      icon: XCircle,
      label: '❌ False',
    },
    Unverifiable: {
      bg: 'bg-slate-700/30',
      text: 'text-slate-400',
      icon: HelpCircle,
      label: '❓ Unverifiable',
    },
  };

  const config = statusConfig[status] || statusConfig.Unverifiable;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
      <Icon size={16} />
      {config.label}
    </span>
  );
}
