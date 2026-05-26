import { motion } from 'framer-motion';
import { Filter, Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import ClaimRow from './ClaimRow';

export default function ResultsTable({ claims }) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClaims = useMemo(() => {
    return claims.filter((claim) => {
      const statusMatch = filterStatus === 'all' || claim.status === filterStatus;
      const searchMatch = claim.claim.toLowerCase().includes(searchQuery.toLowerCase());
      return statusMatch && searchMatch;
    });
  }, [claims, filterStatus, searchQuery]);

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

  const statusOptions = [
    { value: 'all', label: 'All Claims', count: claims.length },
    { value: 'Verified', label: 'Verified', count: claims.filter((c) => c.status === 'Verified').length },
    { value: 'Inaccurate', label: 'Inaccurate', count: claims.filter((c) => c.status === 'Inaccurate').length },
    { value: 'False', label: 'False', count: claims.filter((c) => c.status === 'False').length },
    { value: 'Unverifiable', label: 'Unverifiable', count: claims.filter((c) => c.status === 'Unverifiable').length },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full space-y-6"
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">🔍 Detailed Fact Check Results</h2>
        <p className="text-slate-400">Analysis of {claims.length} claim{claims.length !== 1 ? 's' : ''} • Showing {filteredClaims.length} result{filteredClaims.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search claims..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <Filter size={18} className="text-slate-400 flex-shrink-0 mt-1" />
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilterStatus(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filterStatus === option.value
                  ? 'bg-brand-primary text-white shadow-lg'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {option.label}{' '}
              <span className={`font-bold ${filterStatus === option.value ? 'text-white' : 'text-slate-400'}`}>
                ({option.count})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Claims List */}
      <div className="space-y-3">
        {filteredClaims.length > 0 ? (
          filteredClaims.map((claim, idx) => (
            <ClaimRow
              key={idx}
              index={idx}
              claim={claim.claim}
              status={claim.status}
              explanation={claim.explanation}
              correct_fact={claim.correct_fact}
              source={claim.source}
            />
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 bg-slate-900/50 border border-slate-700 rounded-xl"
          >
            <p className="text-slate-400 text-lg">No claims match your filter</p>
            <button
              onClick={() => {
                setFilterStatus('all');
                setSearchQuery('');
              }}
              className="mt-3 px-4 py-2 bg-brand-primary/20 hover:bg-brand-primary/30 text-brand-primary rounded-lg text-sm transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
