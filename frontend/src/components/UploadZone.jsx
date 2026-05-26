import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, File, Check, X } from 'lucide-react';

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

  const fileSize = selectedFile ? (selectedFile.size / 1024 / 1024).toFixed(2) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-3xl mx-auto"
    >
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={`group relative cursor-pointer overflow-hidden rounded-2xl transition-all duration-300 ${
            isDragActive
              ? 'ring-2 ring-brand-primary scale-105'
              : 'hover:scale-102'
          }`}
        >
          {/* Gradient background */}
          <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-300 ${
            isDragActive
              ? 'from-brand-primary/20 via-brand-primary/5 to-transparent'
              : 'from-slate-800/50 via-slate-900/50 to-slate-900'
          }`}></div>
          
          {/* Border */}
          <div className={`absolute inset-0 rounded-2xl border-2 transition-all duration-300 ${
            isDragActive
              ? 'border-brand-primary shadow-lg shadow-brand-primary/50'
              : 'border-dashed border-slate-600 group-hover:border-slate-500'
          }`}></div>
          
          {/* Content */}
          <div className="relative p-16 text-center">
            <input {...getInputProps()} />
            
            <motion.div
              animate={{ y: isDragActive ? -10 : 0, scale: isDragActive ? 1.1 : 1 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
              className="mb-6"
            >
              <motion.div
                animate={{ rotate: isDragActive ? 360 : 0 }}
                transition={{ duration: 0.6 }}
                className="inline-block"
              >
                <div className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-r from-brand-primary to-brand-hover rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300 ${
                    isDragActive ? 'opacity-75' : ''
                  }`}></div>
                  <div className="relative bg-gradient-to-br from-brand-primary/20 to-brand-primary/10 p-4 rounded-2xl">
                    <Upload className={`w-16 h-16 transition-all duration-300 ${
                      isDragActive ? 'text-brand-primary scale-125' : 'text-brand-primary/70 group-hover:text-brand-primary group-hover:scale-110'
                    }`} />
                  </div>
                </div>
              </motion.div>
            </motion.div>
            
            <h3 className="text-3xl font-bold text-white mb-3 group-hover:text-brand-primary transition-colors duration-300">
              {isDragActive ? 'Drop your PDF here' : 'Upload Your Document'}
            </h3>
            <p className="text-slate-400 text-lg mb-2">
              Drag and drop a PDF file, or click to browse
            </p>
            <p className="text-slate-500 text-sm font-medium">
              Maximum file size: 10 MB • Supports PDF format
            </p>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, type: "spring" }}
          className="group relative overflow-hidden rounded-2xl"
        >
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800/80 via-slate-900/80 to-slate-900"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Border */}
          <div className="absolute inset-0 rounded-2xl border border-slate-700 group-hover:border-brand-primary/50 transition-colors duration-300"></div>
          
          {/* Content */}
          <div className="relative p-8">
            {/* File info */}
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-4 flex-1">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-brand-hover rounded-lg blur opacity-50"></div>
                  <div className="relative bg-gradient-to-br from-brand-primary to-brand-hover p-3 rounded-lg">
                    <File className="w-6 h-6 text-white" />
                  </div>
                </motion.div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-xl font-bold text-white truncate">
                      {selectedFile.name}
                    </p>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5 }}
                      className="flex-shrink-0"
                    >
                      <div className="bg-green-500/20 border border-green-500/50 rounded-full p-1.5">
                        <Check className="w-4 h-4 text-green-400" />
                      </div>
                    </motion.div>
                  </div>
                  <p className="text-slate-400 text-sm font-medium">
                    {fileSize} MB • Ready to analyze
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAnalyzeClick}
                disabled={isAnalyzing}
                className="w-full relative group/btn overflow-hidden py-4 px-6 rounded-lg font-bold text-lg text-white transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-brand-hover"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-brand-hover to-brand-primary opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-2">
                  {isAnalyzing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Analyzing Document...
                    </>
                  ) : (
                    <>
                      ✨ Start Analysis
                    </>
                  )}
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedFile(null)}
                className="w-full py-3 px-6 rounded-lg font-semibold text-slate-300 border border-slate-600 hover:border-slate-500 hover:bg-slate-800/50 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Choose Different File
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
