import React from 'react';
import { Layout } from '../components/Layout';
import { EnhancedAITutorInterface } from '../components/EnhancedAITutorInterface';
import { motion } from 'framer-motion';
import { Sparkles, Code, Brain } from 'lucide-react';

const AITutor: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-white to-[#fff6f6]">
        <motion.div
          className="container mx-auto px-6 py-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center gap-3 mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <Sparkles className="w-8 h-8 text-[#b30000]" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                AI Tutor
              </h1>
            </motion.div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get help with your coding questions from our intelligent AI tutors powered by Gemini, OpenRouter, and Mistral AI
            </p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <EnhancedAITutorInterface />
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default AITutor;
