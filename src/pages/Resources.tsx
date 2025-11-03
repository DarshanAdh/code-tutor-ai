import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { 
  Brain, BarChart3, Play, ArrowRight,
  BookOpen, FileText, GraduationCap,
  Code2, Video, Network, FileCheck,
  ExternalLink, Sparkles, Star, Zap, Rocket, TrendingUp
} from 'lucide-react';

const resources = [
  { 
    title: 'MDN Web Docs', 
    desc: 'JavaScript, CSS, and web APIs', 
    href: 'https://developer.mozilla.org/', 
    tag: 'Docs',
    icon: FileText,
    color: 'bg-blue-100 text-blue-700'
  },
  { 
    title: 'JavaScript Info', 
    desc: 'Deep JS tutorials from basics to advanced', 
    href: 'https://javascript.info/', 
    tag: 'Practice',
    icon: Code2,
    color: 'bg-purple-100 text-purple-700'
  },
  { 
    title: 'FreeCodeCamp', 
    desc: 'Hands-on coding practice and certificates', 
    href: 'https://www.freecodecamp.org/', 
    tag: 'Practice',
    icon: GraduationCap,
    color: 'bg-green-100 text-green-700'
  },
  { 
    title: 'CS50 Playlist', 
    desc: 'Beginner-friendly computer science lectures', 
    href: 'https://www.youtube.com/cs50', 
    tag: 'Video',
    icon: Video,
    color: 'bg-red-100 text-red-700'
  },
  { 
    title: 'VisuAlgo', 
    desc: 'Algorithm visualizations for study', 
    href: 'https://visualgo.net/en', 
    tag: 'Visualizer',
    icon: BarChart3,
    color: 'bg-orange-100 text-orange-700'
  },
  { 
    title: 'Big-O Cheat Sheet', 
    desc: 'Complexity reference for common structures', 
    href: 'https://www.bigocheatsheet.com/', 
    tag: 'Reference',
    icon: FileCheck,
    color: 'bg-yellow-100 text-yellow-700'
  },
];

const Resources: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.6,
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#b30000] relative overflow-hidden">
        {/* Animated Background Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-white/30 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                y: [null, Math.random() * window.innerHeight],
                x: [null, Math.random() * window.innerWidth],
                opacity: [0.1, 0.8, 0.1],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>

        {/* Animated Gradient Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-[#b30000] via-[#ff4d4d] to-[#b30000] opacity-20"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            backgroundSize: '200% 200%',
          }}
        />

        {/* Header Section */}
        <motion.div
          className="text-center py-12 relative z-10"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="flex items-center justify-center gap-3 mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <BookOpen className="w-10 h-10 text-white/90" />
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-bold text-white/90">
              Resources
            </h1>
            <motion.div
              animate={{ rotate: [0, -360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Star className="w-10 h-10 text-white/90 fill-white/30" />
            </motion.div>
          </motion.div>
          <motion.p
            className="text-xl text-white/80 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Curated learning resources to accelerate your programming journey
          </motion.p>
        </motion.div>

        <div className="container mx-auto px-6 pb-12 relative z-10">
          {/* Resource Cards Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {resources.map((resource, index) => {
              const Icon = resource.icon;
              const isHovered = hoveredCard === index;
              return (
                <motion.div
                  key={resource.title}
                  variants={cardVariants}
                  onHoverStart={() => setHoveredCard(index)}
                  onHoverEnd={() => setHoveredCard(null)}
                  whileHover={{ 
                    scale: 1.08,
                    y: -10,
                    rotateY: isHovered ? 5 : 0,
                    transition: { duration: 0.3 }
                  }}
                  className="h-full"
                >
                  <Card className="h-full bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 border-2 hover:border-[#b30000] relative overflow-hidden group">
                    {/* Animated Gradient Border */}
                    {isHovered && (
                      <motion.div
                        className="absolute inset-0 rounded-lg"
                        style={{
                          background: 'linear-gradient(45deg, #b30000, #ff4d4d, #b30000)',
                          backgroundSize: '200% 200%',
                          opacity: 0.1,
                        }}
                        animate={{
                          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      />
                    )}

                    {/* Shimmer Effect */}
                    {isHovered && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    )}

                    <CardHeader className="relative z-10">
                      <div className="flex items-start justify-between mb-3">
                        <motion.div
                          className={`p-4 rounded-xl ${resource.color} mb-3 relative overflow-hidden`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          {isHovered && (
                            <motion.div
                              className="absolute inset-0 bg-white/30"
                              animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 0, 0.5],
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          )}
                          <motion.div
                            animate={isHovered ? { 
                              rotate: [0, 10, -10, 0],
                              scale: [1, 1.1, 1],
                            } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Icon className="w-7 h-7 relative z-10" />
                          </motion.div>
                        </motion.div>
                        <motion.div
                          animate={isHovered ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <Badge 
                            variant="secondary" 
                            className="bg-gray-100 text-gray-700 text-xs border border-gray-200 group-hover:bg-[#b30000] group-hover:text-white transition-colors"
                          >
                            {resource.tag}
                          </Badge>
                        </motion.div>
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#b30000] transition-colors">
                        {resource.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 text-sm">
                        {resource.desc}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <motion.a
                        href={resource.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#b30000] hover:text-[#8b0000] font-semibold text-sm flex items-center gap-2 group/link"
                        whileHover={{ x: 8 }}
                      >
                        <span>Visit</span>
                        <motion.div
                          animate={isHovered ? { x: [0, 5, 0] } : {}}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <ExternalLink className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                        </motion.div>
                      </motion.a>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Footer Section with Enhanced Design */}
          <motion.div
            className="bg-gradient-to-br from-[#8b0000] to-[#b30000] rounded-2xl p-8 text-center relative overflow-hidden shadow-2xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div 
                className="absolute inset-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}
              ></div>
            </div>

            <div className="relative z-10">
              <motion.p
                className="text-white/90 mb-6 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Want curated course-specific resources?{' '}
                <Link to="/login" className="text-white font-semibold underline hover:text-white/80 transition-colors">
                  Sign in
                </Link>{' '}
                to see your track.
              </motion.p>
              
              <motion.div
                className="flex items-center justify-center gap-3 mb-3"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.6 }}
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                  <Rocket className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Ready to Practice?
                </h2>
                <motion.div
                  animate={{ rotate: [0, -360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                  <Zap className="w-8 h-8 text-white fill-white/50" />
                </motion.div>
              </motion.div>
              <motion.p
                className="text-white/80 mb-8 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Use these resources and start coding with our interactive tools
              </motion.p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  whileHover={{ scale: 1.08 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/learn">
                    <Button className="group relative bg-white text-[#b30000] hover:bg-white/95 px-8 py-6 rounded-xl font-semibold flex items-center gap-2 shadow-xl overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-[#b30000]/10 to-transparent"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.5 }}
                      />
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                      >
                        <Brain className="w-5 h-5 relative z-10" />
                      </motion.div>
                      <span className="relative z-10">AI Chat & Learning</span>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="w-4 h-4 relative z-10" />
                      </motion.div>
                    </Button>
                  </Link>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  whileHover={{ scale: 1.08 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/ai-tutor">
                    <Button className="group relative bg-white text-[#b30000] hover:bg-white/95 px-8 py-6 rounded-xl font-semibold flex items-center gap-2 shadow-xl overflow-hidden">
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
                        <BarChart3 className="w-5 h-5 relative z-10" />
                      </motion.div>
                      <span className="relative z-10">Visualizations</span>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="w-4 h-4 relative z-10" />
                      </motion.div>
                    </Button>
                  </Link>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 }}
                  whileHover={{ scale: 1.08 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/about">
                    <Button className="group relative bg-white text-[#b30000] hover:bg-white/95 px-8 py-6 rounded-xl font-semibold flex items-center gap-2 shadow-xl overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-[#b30000]/10 to-transparent"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.5 }}
                      />
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Play className="w-5 h-5 relative z-10" />
                      </motion.div>
                      <span className="relative z-10">About Us</span>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="w-4 h-4 relative z-10" />
                      </motion.div>
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Copyright with Animation */}
          <motion.p
            className="text-center text-white/80 mt-8 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            © 2025 CodeTutor AI — Built for learners with{' '}
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="inline-block"
            >
              ❤️
            </motion.span>
          </motion.p>
        </div>
      </div>
    </Layout>
  );
};

export default Resources;
