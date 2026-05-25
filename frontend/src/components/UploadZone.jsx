import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, File, Check } from 'lucide-react';

export default function UploadZone({ onFileSelect, onAnalyze, isAnalyzing }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0]);
        onFileSelect(acceptedFiles[0]);
      }
    },
  });

  const handleAnalyzeClick = () => {
    if (selectedFile) {
      onAnalyze();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition ${
            isDragActive
              ? 'border-brand-primary bg-brand-primary/5'
              : 'border-slate-600 bg-slate-900/20 hover:border-slate-500'
          }`}
        >
          <input {...getInputProps()} />
          <motion.div
            animate={{ y: isDragActive ? -5 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-brand-primary opacity-80" />
            <h3 className="text-xl font-semibold text-slate-100 mb-2">
              Drag and drop your PDF
            </h3>
            <p className="text-slate-400 text-sm">
              or click to browse your files (Max 10MB)
            </p>
          </motion.div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900/40 border border-slate-700 rounded-lg p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <File className="w-8 h-8 text-brand-primary" />
              <div className="text-left">
                <p className="text-slate-100 font-medium truncate max-w-xs">
                  {selectedFile.name}
                </p>
                <p className="text-slate-400 text-sm">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5 }}
            >
              <Check className="w-6 h-6 text-green-500" />
            </motion.div>
          </div>

          <button
            onClick={handleAnalyzeClick}
            disabled={isAnalyzing}
            className="w-full bg-gradient-to-r from-brand-primary to-brand-hover text-white font-semibold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Document'}
          </button>

          <button
            onClick={() => setSelectedFile(null)}
            className="w-full mt-3 border border-slate-600 text-slate-300 font-medium py-2 rounded-lg hover:bg-slate-800/30 transition"
          >
            Choose Different File
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
