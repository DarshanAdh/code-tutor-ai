import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '../components/Layout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Brain, Code, BookOpen, Zap, ArrowRight, MessageCircle, BarChart3, Play } from 'lucide-react';
import studentsStudying from '../assets/students-studying.png';
import tutoringSession from '../assets/tutoring-session.png';

const Index: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Tutoring',
      description: 'Get instant help with coding questions from our intelligent AI tutor',
    },
    {
      icon: Code,
      title: 'Interactive Playground',
      description: 'Practice coding with our built-in code editor and visualizer',
    },
    {
      icon: BookOpen,
      title: 'Structured Learning',
      description: 'Follow guided courses and track your progress',
    },
  ];

  const quickLinks = [
    { icon: MessageCircle, title: 'AI Chat', description: 'Get help', path: '/learn' },
    { icon: BarChart3, title: 'Visualizations', description: 'See algorithms', path: '/ai-tutor' },
    { icon: BookOpen, title: 'Resources', description: 'Study materials', path: '/resources' },
    { icon: Zap, title: 'About', description: 'Learn more', path: '/about' },
  ];

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] bg-gradient-to-b from-white to-[#fff6f6]">
        {/* Hero Section with Background Image */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Background Image with Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${studentsStudying})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#b30000]/90 via-[#b30000]/80 to-[#8b0000]/90"></div>
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}
            ></div>
          </div>

          <motion.div
            className="container mx-auto px-6 py-20 text-center relative z-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-2xl"
              variants={itemVariants}
            >
              <span className="text-glow-red text-white">
                Master Programming with AI Assistance
              </span>
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-white/95 mb-8 max-w-3xl mx-auto drop-shadow-lg leading-relaxed"
              variants={itemVariants}
            >
              Your intelligent coding companion for SEMO students. Learn, practice, and build confidence in programming with real-time feedback and support.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              variants={itemVariants}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/signup">
                  <Button
                    size="lg"
                    className="bg-[#b30000] hover:bg-[#ff4d4d] text-white border-none shadow-[0_4px_10px_rgba(179,0,0,0.3)] hover:shadow-[0_6px_16px_rgba(255,77,77,0.4)] text-lg px-8 py-6 rounded-[10px] font-semibold transition-all duration-400"
                  >
                    🚀 Get Started
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/learn">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-[#b30000] text-lg px-8 py-6 rounded-[10px] font-semibold transition-all duration-300"
                  >
                    💡 Learn More
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Floating Elements */}
          <motion.div
            className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"
            animate={{
              y: [0, 20, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </section>

        {/* Code Playground Mockup Section */}
        <section className="relative bg-white py-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.05),transparent_50%)]"></div>
          <motion.div
            className="container mx-auto px-6 relative z-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#b30000] text-glow-red">
                Interactive Code Playground
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Practice coding with real-time feedback and AI assistance
              </p>
            </motion.div>

            <motion.div
              className="max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="card-glow border-2 border-gray-100 rounded-xl overflow-hidden bg-white">
                <div className="bg-[#b30000] p-4 flex items-center gap-2">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-red-300"></div>
                    <div className="w-3 h-3 rounded-full bg-red-200"></div>
                  </div>
                  <span className="text-white text-sm ml-4 font-semibold">CodeTutor Playground</span>
                </div>
                <CardContent className="p-6">
                  <div className="playground-code font-mono text-sm mb-4">
                    <div className="text-green-600 mb-2">function <span className="text-blue-600">greet</span>(name) {'{'}</div>
                    <div className="text-gray-800 ml-4 mb-2">
                      <span className="text-purple-600">return</span> <span className="text-green-700">"Hello, "</span> + name;
                    </div>
                    <div className="text-green-600 mb-4">{'}'}</div>
                    <div className="text-gray-600">
                      <Play className="w-4 h-4 inline mr-2 text-[#b30000]" />
                      <span className="text-blue-600">console.log</span>(<span className="text-blue-600">greet</span>(<span className="text-green-700">"SEMO Student"</span>));
                    </div>
                  </div>
                  <motion.button
                    className="bg-[#ff4d4d] hover:bg-[#ff6666] text-white border-none rounded-md px-4 py-2 mt-2 font-semibold transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ▶ Run Code
                  </motion.button>
                  <motion.div
                    className="playground-output mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    <div className="text-[#b30000] font-semibold">Output:</div>
                    <div className="text-gray-800 mt-1">Hello, SEMO Student</div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section with Image */}
        <section className="relative bg-gradient-to-b from-white to-[#fff6f6] py-20">
          <div className="container mx-auto px-6">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#b30000] text-glow-red">
                Powerful Features
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Everything you need to master programming
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="card-glow border-2 border-red-100 hover:border-[#b30000] h-full group bg-white">
                    <CardHeader>
                      <motion.div
                        className="w-20 h-20 rounded-full bg-gradient-to-br from-[#b30000] to-[#ff4d4d] flex items-center justify-center mb-4 mx-auto"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <feature.icon className="w-10 h-10 text-white" />
                      </motion.div>
                      <CardTitle className="text-center group-hover:text-[#b30000] transition-colors text-xl font-bold">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="text-center text-gray-600">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Image Section */}
            <motion.div
              className="relative rounded-2xl overflow-hidden shadow-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img
                src={tutoringSession}
                alt="Tutoring Session"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#b30000]/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="text-3xl font-bold mb-2 text-glow">Learn with AI Assistance</h3>
                <p className="text-lg opacity-90">Get personalized help and guidance from our intelligent tutor</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Quick Links Section */}
        <section className="relative bg-white py-20">
          <div className="container mx-auto px-6">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#b30000] text-glow-red">
                Get Started
              </h2>
              <p className="text-lg text-gray-600">
                Explore our platform features
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickLinks.map((link, index) => (
                <motion.div
                  key={link.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Link to={link.path}>
                    <Card className="card-glow cursor-pointer group border-2 border-red-100 hover:border-[#b30000] h-full bg-white">
                      <CardContent className="pt-6 pb-6">
                        <div className="flex flex-col items-center text-center">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#b30000] to-[#ff4d4d] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <link.icon className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="font-bold text-lg group-hover:text-[#b30000] transition-colors mb-1">
                            {link.title}
                          </h3>
                          <p className="text-sm text-gray-600">{link.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
