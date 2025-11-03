import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  Sparkles, Code2, BarChart3, 
  MessageSquare, Code, Mic, 
  CheckCircle, Lightbulb, Zap,
  Shield, BookOpen, History,
  ArrowRight, Brain, Play, Terminal,
  Rocket, Star, TrendingUp, Cpu, Globe, Wifi, Layers
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
      <div className="min-h-screen bg-[#b30000] relative overflow-hidden">
        {/* Animated Background Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                y: [null, Math.random() * window.innerHeight],
                x: [null, Math.random() * window.innerWidth],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Animated Gradient Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-[#b30000] via-[#ff4d4d] to-[#b30000] opacity-30"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            backgroundSize: '200% 200%',
          }}
        />

        {/* Header Section */}
        <motion.div
          className="container mx-auto px-6 py-12 text-center relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="flex items-center justify-center gap-4 mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Rocket className="w-12 h-12 text-white/90" />
            </motion.div>
            <motion.h1
              className="text-6xl md:text-7xl font-bold mb-4 text-white/90 bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white"
              variants={itemVariants}
            >
              Learn
            </motion.h1>
            <motion.div
              animate={{ rotate: [0, -360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Star className="w-12 h-12 text-white/90 fill-white/50" />
            </motion.div>
          </motion.div>
          <motion.p
            className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Practice by coding and learn by seeing. Choose what fits your style.
          </motion.p>

          {/* Navigation Tabs with Enhanced Effects */}
          <motion.div
            className="flex justify-center gap-4 mb-8 flex-wrap"
            variants={itemVariants}
          >
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative flex items-center gap-2 px-6 py-3 rounded-lg font-semibold
                    transition-all duration-300 overflow-hidden
                    ${isActive
                      ? 'bg-white text-[#b30000] shadow-2xl scale-105'
                      : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                    }
                  `}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.1, 
                    boxShadow: '0 10px 30px rgba(255,255,255,0.3)',
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    />
                  )}
                  <motion.div
                    animate={isActive ? { rotate: [0, 360] } : {}}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    <Icon className="w-5 h-5 relative z-10" />
                  </motion.div>
                  <span className="relative z-10">{tab.label}</span>
                </motion.button>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Main Content Area */}
        <div className="container mx-auto px-6 pb-12 relative z-10">
          <motion.div
            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-8 border-2 border-white/20 relative overflow-hidden"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            {/* Animated Border Glow */}
            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{
                background: 'linear-gradient(45deg, #b30000, #ff4d4d, #b30000)',
                backgroundSize: '200% 200%',
                opacity: 0.1,
              }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
            />

            {/* Multi-AI Badge */}
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="flex gap-4 flex-wrap">
                {mainTabs.map((tab, index) => {
                  const Icon = tab.icon;
                  const isActive = activeMainTab === tab.id;
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveMainTab(tab.id)}
                      className={`
                        relative flex items-center gap-2 px-4 py-2 rounded-lg font-medium
                        transition-all duration-300 overflow-hidden
                        ${isActive
                          ? 'bg-gradient-to-r from-[#b30000] to-[#ff4d4d] text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                      `}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ 
                        scale: 1.08,
                        boxShadow: isActive ? '0 8px 20px rgba(179,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.1)',
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 bg-white/20"
                          initial={{ x: '-100%' }}
                          animate={{ x: '100%' }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        />
                      )}
                      <Icon className="w-4 h-4 relative z-10" />
                      <span className="relative z-10">{tab.label}</span>
                    </motion.button>
                  );
                })}
              </div>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <Badge className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-3 py-1 shadow-lg border border-white/10">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    className="inline-block mr-1"
                  >
                    <Sparkles className="w-3 h-3" />
                  </motion.div>
                  Multi-AI Powered
                </Badge>
              </motion.div>
            </div>

            {/* AI Tutor Interface */}
            {activeTab === 'ai-tutor' && (
              <div className="space-y-6 relative z-10">
                {/* Configuration Section with Enhanced Styling */}
                <motion.div
                  className="flex flex-wrap gap-6 items-center p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-3">
                    <Cpu className="w-5 h-5 text-[#b30000]" />
                    <span className="text-sm font-medium text-gray-700">AI Model:</span>
                    <select className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] transition-all bg-white shadow-sm hover:shadow-md">
                      <option>Gemini 2.0 Flash</option>
                      <option>OpenRouter</option>
                      <option>Mistral AI</option>
                    </select>
                    <motion.div
                      className="w-3 h-3 bg-green-500 rounded-full"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.7, 1],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Mic className="w-5 h-5 text-[#b30000]" />
                    <span className="text-sm font-medium text-gray-700">Voice:</span>
                    <select className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] transition-all bg-white shadow-sm hover:shadow-md">
                      <option>Samantha (en-US)</option>
                      <option>Alex (en-US)</option>
                      <option>Victoria (en-US)</option>
                    </select>
                  </div>
                  <motion.label 
                    className="flex items-center gap-2 cursor-pointer group"
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.input
                      type="checkbox"
                      className="w-4 h-4 text-[#b30000] rounded accent-[#b30000] cursor-pointer"
                      whileTap={{ scale: 0.9 }}
                    />
                    <span className="text-sm text-gray-700 group-hover:text-[#b30000] transition-colors">
                      Auto-speak AI responses
                    </span>
                  </motion.label>
                </motion.div>

                {/* Input Mode Selection with Enhanced Icons */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Layers className="w-4 h-4 text-[#b30000]" />
                    <span className="text-sm font-medium text-gray-700">Input Mode:</span>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {inputModes.map((mode, index) => {
                      const Icon = mode.icon;
                      const isActive = mode.id === 'code';
                      return (
                        <motion.button
                          key={mode.id}
                          className={`
                            relative flex items-center gap-2 px-5 py-3 rounded-lg font-medium
                            transition-all duration-300 overflow-hidden
                            ${isActive
                              ? 'bg-gradient-to-r from-[#b30000] to-[#ff4d4d] text-white shadow-lg'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }
                          `}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          whileHover={{ 
                            scale: 1.08,
                            boxShadow: isActive ? '0 8px 20px rgba(179,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.15)',
                          }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {isActive && (
                            <motion.div
                              className="absolute inset-0 bg-white/20"
                              initial={{ x: '-100%' }}
                              animate={{ x: '100%' }}
                              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                            />
                          )}
                          <motion.div
                            animate={isActive ? { 
                              scale: [1, 1.2, 1],
                              rotate: [0, 5, -5, 0],
                            } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Icon className="w-4 h-4 relative z-10" />
                          </motion.div>
                          <span className="relative z-10">{mode.label}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Code Input Area with Enhanced Styling */}
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="relative">
                    <textarea
                      placeholder="Paste your code here for analysis, debugging, or explanation..."
                      className="w-full h-48 p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000] resize-none transition-all bg-gray-50 focus:bg-white font-mono text-sm shadow-inner"
                    />
                    <motion.div
                      className="absolute top-2 right-2 flex gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <motion.button
                        className="p-2 text-gray-500 hover:text-[#b30000] transition-colors bg-white/80 rounded-lg hover:bg-white shadow-sm"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Code className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        className="p-2 text-gray-500 hover:text-[#b30000] transition-colors bg-white/80 rounded-lg hover:bg-white shadow-sm"
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Mic className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Action Prompts with Animated Icons */}
                <motion.div
                  className="flex flex-col gap-3 p-4 bg-gradient-to-r from-green-50 to-yellow-50 rounded-xl border border-green-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.div
                    className="flex items-center gap-3 text-gray-700"
                    whileHover={{ x: 5 }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </motion.div>
                    <span className="text-sm font-medium">Paste code for analysis, debugging, or optimization</span>
                  </motion.div>
                  <motion.div
                    className="flex items-center gap-3 text-gray-700"
                    whileHover={{ x: 5 }}
                  >
                    <motion.div
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Lightbulb className="w-5 h-5 text-yellow-500 fill-yellow-400/30" />
                    </motion.div>
                    <span className="text-sm font-medium">Get suggestions for improvements and best practices</span>
                  </motion.div>
                </motion.div>
              </div>
            )}

            {/* Playground and Visualizer Content */}
            {(activeTab === 'playground' || activeTab === 'visualizer') && (
              <div className="text-center py-12">
                <p className="text-gray-600">This feature is coming soon!</p>
              </div>
            )}
          </motion.div>

          {/* How AI Help Works Card with Enhanced Design */}
          <motion.div
            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border-2 border-white/20 relative overflow-hidden"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.01 }}
          >
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23b30000" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                >
                  <TrendingUp className="w-6 h-6 text-[#b30000]" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900">How AI Help Works</h2>
              </div>
              <p className="text-gray-600 mb-6 text-sm">What will be enabled in the next phase</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={index}
                      className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-gray-50 to-white hover:from-[#b30000]/5 hover:to-[#ff4d4d]/5 transition-all border border-gray-100 hover:border-[#b30000]/20 group"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ 
                        x: 8,
                        scale: 1.02,
                        boxShadow: '0 4px 12px rgba(179,0,0,0.1)',
                      }}
                    >
                      <motion.div
                        className="p-2 rounded-lg bg-[#b30000]/10 group-hover:bg-[#b30000]/20 transition-colors"
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className="w-5 h-5 text-[#b30000]" />
                      </motion.div>
                      <span className="text-gray-700 font-medium group-hover:text-[#b30000] transition-colors">
                        {feature.text}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Explore More Features Section with Enhanced Buttons */}
        <motion.div
          className="text-center py-8 relative z-10"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2
            className="text-3xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Explore More Features
          </motion.h2>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/ai-tutor">
              <motion.button
                className="group relative bg-white text-[#b30000] px-8 py-4 rounded-xl font-semibold flex items-center gap-2 overflow-hidden shadow-lg"
                whileHover={{ 
                  scale: 1.08,
                  boxShadow: '0 15px 35px rgba(255,255,255,0.3)',
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#b30000]/10 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.5 }}
                />
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                  <BarChart3 className="w-5 h-5 relative z-10" />
                </motion.div>
                <span className="relative z-10">Algorithm Visualizations</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-4 h-4 relative z-10" />
                </motion.div>
              </motion.button>
            </Link>
            <Link to="/resources">
              <motion.button
                className="group relative bg-white text-[#b30000] px-8 py-4 rounded-xl font-semibold flex items-center gap-2 overflow-hidden shadow-lg"
                whileHover={{ 
                  scale: 1.08,
                  boxShadow: '0 15px 35px rgba(255,255,255,0.3)',
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#b30000]/10 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.5 }}
                />
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <BookOpen className="w-5 h-5 relative z-10" />
                </motion.div>
                <span className="relative z-10">Learning Resources</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-4 h-4 relative z-10" />
                </motion.div>
              </motion.button>
            </Link>
          </div>
          <motion.p
            className="text-white/80 mt-8 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            © 2025 CodeTutor AI — SEMO Learning Assistance Platform
          </motion.p>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Learn;
