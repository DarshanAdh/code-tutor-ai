import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { Playground } from '../components/Playground';
import { Visualizer } from '../components/Visualizer';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { BookOpen, MessageCircle, Mic, Video, HelpCircle, Trophy, TrendingUp, Clock, Star, Code, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }
  const [stats, setStats] = useState({
    totalLessons: 0,
    completedLessons: 0,
    totalQuizzes: 0,
    correctAnswers: 0,
    streak: 0,
    points: 0
  });

  useEffect(() => {
    // Simulate loading stats from backend
    const loadStats = async () => {
      try {
        const response = await fetch('/api/progress/demo-user', {
          headers: { 'x-user-id': 'demo-user' }
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.log('Using sample data for demo');
        setStats({
          totalLessons: 12,
          completedLessons: 8,
          totalQuizzes: 15,
          correctAnswers: 12,
          streak: 5,
          points: 1250
        });
      }
    };
    loadStats();
  }, []);

  const quickActions = [
    {
      icon: MessageCircle,
      title: 'Ask AI Tutor',
      description: 'Get instant help with coding questions',
      href: '/ai-tutor',
      color: 'bg-blue-500'
    },
    {
      icon: Mic,
      title: 'Voice Question',
      description: 'Ask questions using voice commands',
      href: '/ai-tutor',
      color: 'bg-green-500'
    },
    {
      icon: BookOpen,
      title: 'Study Materials',
      description: 'Access course content and exercises',
      href: '/learn',
      color: 'bg-purple-500'
    },
    {
      icon: Video,
      title: 'Watch Tutorial',
      description: 'View explanatory video content',
      href: '/resources',
      color: 'bg-orange-500'
    }
  ];

  const recentActivities = [
    {
      type: 'lesson',
      title: 'Python Functions',
      time: '2 hours ago',
      status: 'completed',
      points: 50
    },
    {
      type: 'quiz',
      title: 'Data Types Quiz',
      time: '1 day ago',
      status: 'completed',
      points: 30
    },
    {
      type: 'practice',
      title: 'Algorithm Practice',
      time: '2 days ago',
      status: 'in-progress',
      points: 0
    }
  ];

  const upcomingLessons = [
    {
      title: 'Object-Oriented Programming',
      difficulty: 'Intermediate',
      duration: '45 min',
      dueDate: 'Tomorrow'
    },
    {
      title: 'Data Structures',
      difficulty: 'Advanced',
      duration: '60 min',
      dueDate: 'This week'
    }
  ];

  const progressPercentage = stats.totalLessons > 0 ? (stats.completedLessons / stats.totalLessons) * 100 : 0;

  return (
    <ProtectedRoute allowedRoles={['student']}>
      <Layout>
        <div className="container mx-auto px-6 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Welcome back, {user?.name || 'Student'}!
                </h1>
                <p className="text-muted-foreground mt-2">
                  Ready to continue your coding journey? Let's learn something new today.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{stats.points}</div>
                  <div className="text-sm text-muted-foreground">Points</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{stats.streak}</div>
                  <div className="text-sm text-muted-foreground">Day Streak</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{stats.completedLessons} of {stats.totalLessons} lessons completed</span>
                <span>{stats.correctAnswers} of {stats.totalQuizzes} quiz questions correct</span>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="learn">Learn</TabsTrigger>
              <TabsTrigger value="practice">Practice</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-primary" />
                        Quick Actions
                      </CardTitle>
                      <CardDescription>
                        Get help and access learning tools instantly
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        {quickActions.map((action, index) => {
                          const Icon = action.icon;
                          return (
                            <Link key={index} to={action.href}>
                              <Button
                                variant="outline"
                                className="h-auto p-4 flex flex-col items-center text-center hover:bg-primary/5 w-full"
                              >
                                <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center mb-2`}>
                                  <Icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-sm font-medium">{action.title}</div>
                                <div className="text-xs text-muted-foreground">
                                  {action.description}
                                </div>
                              </Button>
                            </Link>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {recentActivities.map((activity, index) => (
                          <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                activity.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                              }`}>
                                {activity.type === 'lesson' ? <BookOpen className="w-4 h-4" /> : 
                                 activity.type === 'quiz' ? <Star className="w-4 h-4" /> : <Code className="w-4 h-4" />}
                              </div>
                              <div>
                                <div className="font-medium">{activity.title}</div>
                                <div className="text-sm text-muted-foreground">{activity.time}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">+{activity.points} pts</div>
                              <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'}>
                                {activity.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Coding Playground */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Code className="w-5 h-5 text-primary" />
                        Interactive Playground
                      </CardTitle>
                      <CardDescription>
                        Practice coding with real-time feedback
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Playground />
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Progress Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Your Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Lessons</span>
                          <span>{stats.completedLessons}/{stats.totalLessons}</span>
                        </div>
                        <Progress value={(stats.completedLessons / stats.totalLessons) * 100} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Quizzes</span>
                          <span>{stats.correctAnswers}/{stats.totalQuizzes}</span>
                        </div>
                        <Progress value={(stats.correctAnswers / stats.totalQuizzes) * 100} />
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{stats.points}</div>
                          <div className="text-xs text-muted-foreground">Points</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{stats.streak}</div>
                          <div className="text-xs text-muted-foreground">Day Streak</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Upcoming Lessons */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        Upcoming Lessons
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {upcomingLessons.map((lesson, index) => (
                          <div key={index} className="p-3 rounded-lg border">
                            <div className="font-medium">{lesson.title}</div>
                            <div className="flex justify-between text-sm text-muted-foreground mt-1">
                              <span>{lesson.difficulty}</span>
                              <span>{lesson.duration}</span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Due: {lesson.dueDate}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Achievements */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-primary" />
                        Recent Achievements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-2 rounded bg-accent/50">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            🎯
                          </div>
                          <div>
                            <div className="text-sm font-medium">Problem Solver</div>
                            <div className="text-xs text-muted-foreground">Solved 5 coding challenges</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-2 rounded bg-accent/50">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            📚
                          </div>
                          <div>
                            <div className="text-sm font-medium">Quick Learner</div>
                            <div className="text-xs text-muted-foreground">Completed 3 lessons today</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="learn" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Path</CardTitle>
                  <CardDescription>Structured learning modules for your coding journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">Python Fundamentals</h3>
                        <Badge variant="secondary">In Progress</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Learn the basics of Python programming
                      </p>
                      <Progress value={75} className="mb-2" />
                      <div className="text-xs text-muted-foreground">6 of 8 lessons completed</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="practice" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Practice Problems</CardTitle>
                  <CardDescription>Sharpen your skills with coding challenges</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Easy Problems</h3>
                      <p className="text-sm text-muted-foreground mb-3">Basic programming concepts</p>
                      <Button size="sm">Start Practice</Button>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Medium Problems</h3>
                      <p className="text-sm text-muted-foreground mb-3">Intermediate algorithms</p>
                      <Button size="sm" variant="outline">Coming Soon</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="progress" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Learning Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Total Study Time</span>
                        <span className="font-semibold">24h 30m</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Problems Solved</span>
                        <span className="font-semibold">47</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Current Streak</span>
                        <span className="font-semibold text-green-600">5 days</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Visualizer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Visualizer />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default StudentDashboard;