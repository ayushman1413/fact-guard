import { motion } from 'framer-motion';
import { FileText, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

export default function SummaryCards({
  filename,
  total_claims,
  verified,
  inaccurate,
  false_count,
  processed_at,
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const cards = [
    {
      label: 'Total Claims',
      value: total_claims,
      icon: FileText,
      bg: 'from-slate-600 to-slate-700',
      iconColor: 'text-slate-300',
    },
    {
      label: 'Verified',
      value: verified,
      icon: CheckCircle,
      bg: 'from-green-600 to-emerald-700',
      iconColor: 'text-green-300',
    },
    {
      label: 'Inaccurate',
      value: inaccurate,
      icon: AlertCircle,
      bg: 'from-amber-600 to-orange-700',
      iconColor: 'text-amber-300',
    },
    {
      label: 'False',
      value: false_count,
      icon: XCircle,
      bg: 'from-red-600 to-rose-700',
      iconColor: 'text-red-300',
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full space-y-4"
    >
      <div className="bg-slate-900/40 border border-slate-700 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <p className="text-sm text-slate-400">File</p>
            <p className="text-lg font-semibold text-slate-100 truncate">
              {filename}
            </p>
          </div>
          <div className="text-sm text-slate-400">
            {new Date(processed_at).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={idx}
              variants={cardVariants}
              className={`bg-gradient-to-br ${card.bg} rounded-lg p-4 shadow-lg border border-opacity-20 border-white`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm text-white/80 font-medium">
                    {card.label}
                  </p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {card.value}
                  </p>
                </div>
                <Icon className={`${card.iconColor} opacity-80`} size={28} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
