import React from 'react';
import { Layout } from '../components/Layout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { 
  Settings, 
  Users, 
  BarChart3, 
  Database, 
  Shield, 
  TrendingUp,
  UserPlus,
  Activity,
  Server
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();

  const systemStats = [
    { label: 'Total Users', value: '1,247', change: '+12%', icon: Users },
    { label: 'Active Sessions', value: '89', change: '+5%', icon: Activity },
    { label: 'Courses', value: '24', change: '+2%', icon: Database },
    { label: 'System Uptime', value: '99.9%', change: '0%', icon: Server },
  ];

  const recentUsers = [
    { id: 1, name: 'Alice Johnson', role: 'student', status: 'active', joinDate: '2024-01-15' },
    { id: 2, name: 'Bob Smith', role: 'assistant', status: 'active', joinDate: '2024-01-14' },
    { id: 3, name: 'Carol Davis', role: 'student', status: 'inactive', joinDate: '2024-01-13' },
  ];

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <Layout>
        <div className="container mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground semo-underline inline-block">
              System Administration
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage users, monitor system performance, and oversee platform operations, {user?.name}
            </p>
          </div>

          {/* System Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 semo-watermark">
            {systemStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="shine">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-xs text-green-600">{stat.change} from last week</p>
                      </div>
                      <div className="w-12 h-12 bg-semo-red/10 rounded-full flex items-center justify-center">
                        <Icon className="w-6 h-6 text-semo-red" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Management Panel */}
            <div className="lg:col-span-2 space-y-6 semo-watermark">
              {/* User Management */}
              <Card className="shine">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-semo-red" />
                        User Management
                      </CardTitle>
                      <CardDescription>
                        Manage students, assistants, and administrators
                      </CardDescription>
                    </div>
                    <Button className="btn-primary">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add User
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-semo-red/10 rounded-full flex items-center justify-center">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-medium">{user.name}</h4>
                            <p className="text-sm text-muted-foreground capitalize">
                              {user.role} • Joined {user.joinDate}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                            {user.status}
                          </Badge>
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* System Management */}
              <Card className="shine">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-semo-red" />
                    System Management
                  </CardTitle>
                  <CardDescription>
                    Configure system settings and manage platform resources
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
                      <Database className="w-6 h-6 text-semo-red mb-2" />
                      <span>Database</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
                      <Shield className="w-6 h-6 text-semo-red mb-2" />
                      <span>Security</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
                      <BarChart3 className="w-6 h-6 text-semo-red mb-2" />
                      <span>Analytics</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
                      <Settings className="w-6 h-6 text-semo-red mb-2" />
                      <span>Settings</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* System Health */}
              <Card className="shine">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-semo-red" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>CPU Usage</span>
                      <span>23%</span>
                    </div>
                    <Progress value={23} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Memory Usage</span>
                      <span>67%</span>
                    </div>
                    <Progress value={67} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Storage</span>
                      <span>45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="shine">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="border-l-2 border-semo-red/30 pl-3">
                      <p className="font-medium">New user registration</p>
                      <p className="text-muted-foreground">Alice Johnson joined as student</p>
                      <p className="text-xs text-muted-foreground">2 minutes ago</p>
                    </div>
                    <div className="border-l-2 border-semo-red/30 pl-3">
                      <p className="font-medium">System backup completed</p>
                      <p className="text-muted-foreground">Daily backup successful</p>
                      <p className="text-xs text-muted-foreground">1 hour ago</p>
                    </div>
                    <div className="border-l-2 border-semo-red/30 pl-3">
                      <p className="font-medium">Security scan</p>
                      <p className="text-muted-foreground">No issues detected</p>
                      <p className="text-xs text-muted-foreground">3 hours ago</p>
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

export default AdminDashboard;