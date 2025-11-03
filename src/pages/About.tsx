import React from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const About: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-6 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-semo-red to-semo-red-light bg-clip-text text-transparent mb-4">
            About CodeTutor AI
          </h1>
          <p className="text-xl text-muted-foreground">
            Empowering SEMO students with intelligent coding assistance
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                CodeTutor AI is designed to provide personalized, AI-powered coding assistance to SEMO students. 
                We aim to make programming education more accessible, interactive, and effective through cutting-edge 
                technology and intuitive learning tools.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>AI-powered tutoring with natural language understanding</li>
                <li>Interactive code playground with real-time execution</li>
                <li>Algorithm and data structure visualizations</li>
                <li>Structured learning paths and progress tracking</li>
                <li>Voice-enabled question answering</li>
                <li>Comprehensive resource library</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>For SEMO Students</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This platform is specifically tailored for Southeast Missouri State University students, 
                providing resources and support aligned with the CS curriculum. Whether you're just starting 
                your programming journey or looking to master advanced concepts, CodeTutor AI is here to help.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default About;

