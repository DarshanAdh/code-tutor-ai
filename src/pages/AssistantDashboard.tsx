import React from 'react';
import { Layout } from '../components/Layout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Users, FileText, Plus, AlertCircle, BookOpen, TrendingUp } from 'lucide-react';

const AssistantDashboard = () => {
  const { user } = useAuth();

  const assignedStudents = [
    { id: 1, name: 'Sarah Johnson', progress: 78, status: 'active', lastActive: '2 hours ago' },
    { id: 2, name: 'Mike Chen', progress: 92, status: 'active', lastActive: '1 day ago' },
    { id: 3, name: 'Emily Davis', progress: 45, status: 'needs-help', lastActive: '3 hours ago' },
    { id: 4, name: 'Alex Rodriguez', progress: 67, status: 'active', lastActive: '5 hours ago' },
  ];

  const recentActivities = [
    { student: 'Sarah Johnson', activity: 'Completed JavaScript Arrays lesson', time: '1 hour ago' },
    { student: 'Emily Davis', activity: 'Asked question about loops', time: '2 hours ago' },
    { student: 'Mike Chen', activity: 'Submitted coding challenge', time: '4 hours ago' },
  ];

  return (
    <ProtectedRoute allowedRoles={['assistant']}>
      <Layout>
        <div className="container mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground semo-underline inline-block">
              Learning Assistant Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Monitor student progress and provide personalized guidance, {user?.name}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6 semo-watermark">
              {/* Assigned Students */}
              <Card className="shine">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-semo-red" />
                        Assigned Students ({assignedStudents.length})
                      </CardTitle>
                      <CardDescription>
                        Monitor and guide your assigned students' learning progress
                      </CardDescription>
                    </div>
                    <Button className="btn-primary">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Student
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {assignedStudents.map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium">{student.name}</h4>
                            <Badge variant={student.status === 'needs-help' ? 'destructive' : 'default'}>
                              {student.status === 'needs-help' ? 'Needs Help' : 'Active'}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{student.progress}%</span>
                            </div>
                            <Progress value={student.progress} className="h-2" />
                            <p className="text-xs text-muted-foreground">
                              Last active: {student.lastActive}
                            </p>
                          </div>
                        </div>
                        <div className="ml-4 space-x-2">
                          <Button variant="outline" size="sm">View Profile</Button>
                          <Button variant="outline" size="sm">Message</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="shine">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-semo-red" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
                      <BookOpen className="w-6 h-6 text-semo-red mb-2" />
                      <span>Create Quiz</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
                      <FileText className="w-6 h-6 text-semo-red mb-2" />
                      <span>Assignment</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
                      <TrendingUp className="w-6 h-6 text-semo-red mb-2" />
                      <span>Progress Report</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
                      <AlertCircle className="w-6 h-6 text-semo-red mb-2" />
                      <span>Send Alert</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="border-l-2 border-semo-red/30 pl-3">
                        <p className="text-sm font-medium">{activity.student}</p>
                        <p className="text-xs text-muted-foreground">{activity.activity}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm">Students Helped Today</span>
                      <span className="font-semibold">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Questions Answered</span>
                      <span className="font-semibold">28</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Avg. Response Time</span>
                      <span className="font-semibold">8 min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default AssistantDashboard;