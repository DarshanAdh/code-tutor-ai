import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const NotFound: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-6 py-16">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <CardTitle className="text-6xl font-bold text-semo-red">404</CardTitle>
            <CardDescription className="text-xl">Page Not Found</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <Link to="/">
              <Button className="w-full">
                Go Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default NotFound;

