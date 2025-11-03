import React from 'react';
import { Layout } from '../components/Layout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { Brain, BarChart3, Play, ArrowRight } from 'lucide-react';

const Help: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-6 py-16 max-w-3xl">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-semo-red to-semo-red-light bg-clip-text text-transparent mb-6">Help & FAQs</h1>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How do I run code in the playground?</AccordionTrigger>
            <AccordionContent>Type code in the editor and click Run. Output appears below.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Is there an AI tutor?</AccordionTrigger>
            <AccordionContent>Yes! Visit the Learn page to access our AI Chat interface with voice support and code assistance.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Which browsers are supported?</AccordionTrigger>
            <AccordionContent>Latest Chrome, Edge, Firefox, and Safari are recommended.</AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Quick Navigation Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Explore Our Platform</h2>
            <p className="text-gray-600">
              Get started with our interactive learning tools
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/learn">
              <Button className="w-full flex items-center gap-2" variant="default">
                <Brain className="w-4 h-4" />
                AI Chat & Learning
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/ai-tutor">
              <Button className="w-full flex items-center gap-2" variant="outline">
                <BarChart3 className="w-4 h-4" />
                Visualizations
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/resources">
              <Button className="w-full flex items-center gap-2" variant="secondary">
                <Play className="w-4 h-4" />
                Resources
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Help;


