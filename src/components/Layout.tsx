import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from './Navbar';
import { Github, Twitter, Linkedin, Mail, ExternalLink } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const footerLinks = {
    product: [
      { name: 'Features', path: '/about' },
      { name: 'AI Tutor', path: '/ai-tutor' },
      { name: 'Playground', path: '/learn' },
      { name: 'Resources', path: '/resources' },
    ],
    support: [
      { name: 'Help Center', path: '/help' },
      { name: 'About', path: '/about' },
      { name: 'Contact', path: '/help' },
    ],
    legal: [
      { name: 'Privacy Policy', path: '/about' },
      { name: 'Terms of Service', path: '/about' },
    ],
  };

  const socialLinks = [
    { icon: Github, name: 'GitHub', href: 'https://github.com' },
    { icon: Twitter, name: 'Twitter', href: 'https://twitter.com' },
    { icon: Linkedin, name: 'LinkedIn', href: 'https://linkedin.com' },
    { icon: Mail, name: 'Email', href: 'mailto:support@codetutor.ai' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-red-50/20">
      <div className="h-1.5 w-full bg-gradient-to-r from-[hsl(var(--semo-red))] via-[hsl(var(--semo-red-light))] to-[hsl(var(--semo-red))]"></div>
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <footer className="animated-gradient border-t text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold text-white mb-4">
                CodeTutor AI
              </h3>
              <p className="text-white/90 mb-4 max-w-md">
                Your intelligent coding companion for SEMO students. Learn, practice, and master programming with AI-powered assistance.
              </p>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white hover:text-white transition-colors hover:text-glow"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-white/80 hover:text-white transition-colors text-sm flex items-center gap-1 hover:text-glow"
                    >
                      {link.name}
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-white/80 hover:text-white transition-colors text-sm flex items-center gap-1 hover:text-glow"
                    >
                      {link.name}
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-white/80 hover:text-white transition-colors text-sm flex items-center gap-1 hover:text-glow"
                    >
                      {link.name}
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/90 text-center md:text-left">
              © {new Date().getFullYear()} CodeTutor AI — SEMO Learning Assistance Platform. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-white/90">
              <span>Made with</span>
              <motion.span
                className="text-white"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
              >
                ❤️
              </motion.span>
              <span>for SEMO students</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
