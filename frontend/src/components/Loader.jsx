import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Loader() {
  const messages = [
    '📄 Extracting text from PDF...',
    '🔍 Identifying factual claims...',
    '🌐 Searching the web for each claim...',
    '⚖️ Generating verification report...',
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center gap-8 py-20"
    >
      {/* Animated spinner */}
      <div className="relative w-16 h-16">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 border-4 border-transparent border-t-brand-primary border-r-brand-primary rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-2 border-4 border-transparent border-b-brand-hover rounded-full opacity-60"
        />
      </div>

      {/* Animated message */}
      <motion.div
        key={currentMessageIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <p className="text-lg text-slate-200 font-medium">
          {messages[currentMessageIndex]}
        </p>
      </motion.div>

      {/* Progress dots */}
      <div className="flex gap-2">
        {messages.map((_, idx) => (
          <motion.div
            key={idx}
            animate={{
              scale: idx === currentMessageIndex ? 1.2 : 1,
              backgroundColor:
                idx === currentMessageIndex ? '#6366F1' : '#475569',
            }}
            transition={{ duration: 0.3 }}
            className="w-2 h-2 rounded-full"
          />
        ))}
      </div>
    </motion.div>
  );
}
