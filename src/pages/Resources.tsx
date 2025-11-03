import React from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Brain, BarChart3, Play, ArrowRight,
  BookOpen, FileText, GraduationCap,
  Code2, Video, Network, FileCheck,
  ExternalLink, Sparkles
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
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#b30000]">
        <div className="container mx-auto px-6 py-12">
          {/* Resource Cards Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {resources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <motion.div
                  key={resource.title}
                  variants={cardVariants}
                  whileHover={{ 
                    scale: 1.05,
                    rotateY: 5,
                    transition: { duration: 0.3 }
                  }}
                  className="h-full"
                >
                  <Card className="h-full bg-white hover:shadow-2xl transition-all duration-300 border-2 hover:border-[#b30000]">
                    <CardHeader className="relative">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-3 rounded-lg ${resource.color} mb-3`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <Badge 
                          variant="secondary" 
                          className="bg-gray-100 text-gray-700 text-xs"
                        >
                          {resource.tag}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                        {resource.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 text-sm">
                        {resource.desc}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <motion.a
                        href={resource.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#b30000] hover:text-[#8b0000] font-semibold text-sm flex items-center gap-1 group"
                        whileHover={{ x: 5 }}
                      >
                        Visit
                        <ExternalLink className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                      </motion.a>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Footer Section */}
          <motion.div
            className="bg-[#8b0000] rounded-2xl p-8 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-white/90 mb-6 text-sm">
              Want curated course-specific resources?{' '}
              <Link to="/login" className="text-white font-semibold underline hover:text-white/80">
                Sign in
              </Link>{' '}
              to see your track.
            </p>
            
            <h2 className="text-3xl font-bold text-white mb-3">
              Ready to Practice?
            </h2>
            <p className="text-white/80 mb-8 text-lg">
              Use these resources and start coding with our interactive tools
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/learn">
                  <Button className="bg-white text-[#b30000] hover:bg-white/90 px-8 py-6 rounded-lg font-semibold flex items-center gap-2 shadow-lg">
                    <Brain className="w-5 h-5" />
                    AI Chat & Learning
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/ai-tutor">
                  <Button className="bg-white text-[#b30000] hover:bg-white/90 px-8 py-6 rounded-lg font-semibold flex items-center gap-2 shadow-lg">
                    <BarChart3 className="w-5 h-5" />
                    Visualizations
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/about">
                  <Button className="bg-white text-[#b30000] hover:bg-white/90 px-8 py-6 rounded-lg font-semibold flex items-center gap-2 shadow-lg">
                    <Play className="w-5 h-5" />
                    About Us
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Copyright */}
          <p className="text-center text-white/80 mt-8 text-sm">
            © 2025 CodeTutor AI — Built for learners with ❤️
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Resources;
