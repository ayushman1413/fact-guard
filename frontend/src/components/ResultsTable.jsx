import { motion } from 'framer-motion';
import ClaimRow from './ClaimRow';

export default function ResultsTable({ claims }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full bg-slate-900/40 rounded-lg border border-slate-700 overflow-hidden shadow-xl"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-slate-800/80 border-b border-slate-700">
            <tr>
              <th className="px-4 py-4 text-sm font-semibold text-slate-200">#</th>
              <th className="px-4 py-4 text-sm font-semibold text-slate-200">
                Claim
              </th>
              <th className="px-4 py-4 text-sm font-semibold text-slate-200">
                Status
              </th>
              <th className="px-4 py-4 text-sm font-semibold text-slate-200">
                Explanation
              </th>
              <th className="px-4 py-4 text-sm font-semibold text-slate-200">
                Correct Fact
              </th>
              <th className="px-4 py-4 text-sm font-semibold text-slate-200">
                Source
              </th>
            </tr>
          </thead>
          <tbody>
            {claims.map((claim, idx) => (
              <ClaimRow
                key={idx}
                index={idx}
                claim={claim.claim}
                status={claim.status}
                explanation={claim.explanation}
                correct_fact={claim.correct_fact}
                source={claim.source}
              />
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
