import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { TrendingUp, Award, Clock, Target } from 'lucide-react';

interface ProgressData {
  label: string;
  value: number;
  maxValue: number;
  color: string;
}

export const Visualizer: React.FC = () => {
  const progressData: ProgressData[] = [
    { label: 'JavaScript Fundamentals', value: 85, maxValue: 100, color: 'bg-semo-red' },
    { label: 'Data Structures', value: 60, maxValue: 100, color: 'bg-code-accent' },
    { label: 'Algorithms', value: 45, maxValue: 100, color: 'bg-primary' },
    { label: 'Problem Solving', value: 70, maxValue: 100, color: 'bg-secondary' }
  ];

  const stats = [
    { icon: TrendingUp, label: 'Lessons Completed', value: '23', color: 'text-semo-red' },
    { icon: Award, label: 'Achievements', value: '8', color: 'text-code-accent' },
    { icon: Clock, label: 'Study Hours', value: '42', color: 'text-primary' },
    { icon: Target, label: 'Success Rate', value: '87%', color: 'text-secondary-foreground' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-semo-red" />
            Learning Progress
          </CardTitle>
          <CardDescription>
            Track your coding skills development over time
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {progressData.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-sm text-muted-foreground">{item.value}%</span>
              </div>
              <Progress value={item.value} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
          <CardDescription>Your learning journey at a glance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                  <div>
                    <div className="text-lg font-semibold">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};