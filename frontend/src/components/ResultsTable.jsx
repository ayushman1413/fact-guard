import { motion } from 'framer-motion';
import ClaimRow from './ClaimRow';

export default function ResultsTable({ claims }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full space-y-3"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Fact Check Results</h2>
        <p className="text-slate-400">Detailed analysis of {claims.length} claim{claims.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="space-y-3">
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
      </div>
    </motion.div>
  );
}
