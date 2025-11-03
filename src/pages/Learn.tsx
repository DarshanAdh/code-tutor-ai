import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, Code2, BarChart3, 
  MessageSquare, Code, Mic, 
  CheckCircle, Lightbulb, Zap,
  Shield, BookOpen, History,
  ArrowRight, Brain, Play, Terminal
} from 'lucide-react';
import { EnhancedAITutorInterface } from '../components/EnhancedAITutorInterface';

const Learn: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ai-tutor' | 'playground' | 'visualizer'>('ai-tutor');
  const [activeMainTab, setActiveMainTab] = useState<'chat' | 'code' | 'playground'>('chat');

  const tabs = [
    { id: 'ai-tutor' as const, label: 'AI Tutor', icon: Sparkles },
    { id: 'playground' as const, label: 'Playground', icon: Code2 },
    { id: 'visualizer' as const, label: 'Visualizer', icon: BarChart3 },
  ];

  const mainTabs = [
    { id: 'chat' as const, label: 'Chat', icon: MessageSquare },
    { id: 'code' as const, label: 'Code Editor', icon: Code },
    { id: 'playground' as const, label: 'Playground', icon: Terminal },
  ];

  const inputModes = [
    { id: 'chat' as const, label: 'Chat', icon: MessageSquare },
    { id: 'code' as const, label: 'Code', icon: Code },
    { id: 'voice' as const, label: 'Voice', icon: Mic },
  ];

  const aiFeatures = [
    { icon: Shield, text: 'Secure sign-in with SEMO accounts' },
    { icon: BookOpen, text: 'Context-aware answers based on selected course' },
    { icon: Code, text: 'Code execution and feedback loop' },
    { icon: History, text: 'Saved chat history per user' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#b30000]">
        {/* Header Section */}
        <motion.div
          className="container mx-auto px-6 py-12 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-6xl md:text-7xl font-bold mb-4 text-white/90"
            variants={itemVariants}
          >
            Learn
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Practice by coding and learn by seeing. Choose what fits your style.
          </motion.p>

          {/* Navigation Tabs */}
          <motion.div
            className="flex justify-center gap-4 mb-8"
            variants={itemVariants}
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-lg font-semibold
                    transition-all duration-300
                    ${isActive
                      ? 'bg-white text-[#b30000] shadow-lg scale-105'
                      : 'bg-white/10 text-white hover:bg-white/20'
                    }
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </motion.button>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Main Content Area */}
        <div className="container mx-auto px-6 pb-12">
          <motion.div
            className="bg-white rounded-2xl shadow-2xl p-8 mb-8"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Multi-AI Badge */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-4">
                {mainTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeMainTab === tab.id;
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveMainTab(tab.id)}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-lg font-medium
                        transition-all duration-300
                        ${isActive
                          ? 'bg-[#b30000] text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                      `}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </motion.button>
                  );
                })}
              </div>
              <Badge className="bg-gray-800 text-white px-3 py-1">
                <Sparkles className="w-3 h-3 mr-1" />
                Multi-AI Powered
              </Badge>
            </div>

            {/* AI Tutor Interface */}
            {activeTab === 'ai-tutor' && (
              <div className="space-y-6">
                {/* Configuration Section */}
                <div className="flex flex-wrap gap-6 items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">AI Model:</span>
                    <select className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#b30000]">
                      <option>Gemini 2.0 Flash</option>
                      <option>OpenRouter</option>
                      <option>Mistral AI</option>
                    </select>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">Voice:</span>
                    <select className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#b30000]">
                      <option>Samantha (en-US)</option>
                      <option>Alex (en-US)</option>
                      <option>Victoria (en-US)</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-[#b30000] rounded" />
                    <span className="text-sm text-gray-700">Auto-speak AI responses</span>
                  </label>
                </div>

                {/* Input Mode Selection */}
                <div>
                  <span className="text-sm font-medium text-gray-700 mb-3 block">Input Mode:</span>
                  <div className="flex gap-3">
                    {inputModes.map((mode) => {
                      const Icon = mode.icon;
                      const isActive = mode.id === 'code';
                      return (
                        <motion.button
                          key={mode.id}
                          className={`
                            flex items-center gap-2 px-4 py-2 rounded-lg font-medium
                            transition-all duration-300
                            ${isActive
                              ? 'bg-[#b30000] text-white shadow-md'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }
                          `}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Icon className="w-4 h-4" />
                          {mode.label}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Code Input Area */}
                <div className="relative">
                  <textarea
                    placeholder="Paste your code here for analysis, debugging, or explanation..."
                    className="w-full h-48 p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b30000] focus:border-transparent resize-none"
                  />
                  <div className="absolute bottom-3 right-3 flex gap-2">
                    <button className="p-2 text-gray-500 hover:text-[#b30000] transition-colors">
                      <Code className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-[#b30000] transition-colors">
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Action Prompts */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Paste code for analysis, debugging, or optimization</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Lightbulb className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm">Get suggestions for improvements and best practices</span>
                  </div>
                </div>
              </div>
            )}

            {/* Playground and Visualizer Content */}
            {(activeTab === 'playground' || activeTab === 'visualizer') && (
              <div className="text-center py-12">
                <p className="text-gray-600">This feature is coming soon!</p>
              </div>
            )}
          </motion.div>

          {/* How AI Help Works Card */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-8 mb-8"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-2xl font-bold mb-2 text-gray-900">How AI Help Works</h2>
            <p className="text-gray-600 mb-6 text-sm">What will be enabled in the next phase</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    <Icon className="w-5 h-5 text-[#b30000] flex-shrink-0" />
                    <span className="text-gray-700">{feature.text}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Explore More Features Section */}
        <motion.div
          className="text-center py-8"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Explore More Features</h2>
          <div className="flex justify-center gap-4">
            <Link to="/ai-tutor">
              <motion.button
                className="bg-white text-[#b30000] px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
                whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}
                whileTap={{ scale: 0.95 }}
              >
                <BarChart3 className="w-5 h-5" />
                Algorithm Visualizations
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
            <Link to="/resources">
              <motion.button
                className="bg-white text-[#b30000] px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
                whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}
                whileTap={{ scale: 0.95 }}
              >
                <BookOpen className="w-5 h-5" />
                Learning Resources
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
          <p className="text-white/80 mt-8 text-sm">
            © 2025 CodeTutor AI — SEMO Learning Assistance Platform
          </p>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Learn;
