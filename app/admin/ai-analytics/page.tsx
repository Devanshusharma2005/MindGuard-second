'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Download, Calendar, MessageSquare, Brain, ThumbsUp, ThumbsDown, AlertTriangle } from 'lucide-react';

const sentimentData = [
  { name: 'Positive', value: 65, color: '#10b981' },
  { name: 'Neutral', value: 25, color: '#6b7280' },
  { name: 'Negative', value: 10, color: '#ef4444' },
];

const topicData = [
  { name: 'Anxiety', count: 3245 },
  { name: 'Depression', count: 2890 },
  { name: 'Stress', count: 2650 },
  { name: 'Relationships', count: 1980 },
  { name: 'Sleep', count: 1750 },
  { name: 'Self-esteem', count: 1520 },
  { name: 'Work-life Balance', count: 1320 },
  { name: 'Trauma', count: 980 },
  { name: 'Grief', count: 780 },
  { name: 'Addiction', count: 650 },
];

const responseData = [
  { name: 'Jan', helpful: 92, unhelpful: 8 },
  { name: 'Feb', helpful: 91, unhelpful: 9 },
  { name: 'Mar', helpful: 93, unhelpful: 7 },
  { name: 'Apr', helpful: 94, unhelpful: 6 },
  { name: 'May', helpful: 95, unhelpful: 5 },
  { name: 'Jun', helpful: 94, unhelpful: 6 },
  { name: 'Jul', helpful: 96, unhelpful: 4 },
  { name: 'Aug', helpful: 97, unhelpful: 3 },
  { name: 'Sep', helpful: 98, unhelpful: 2 },
];

const interactionData = [
  { name: 'Jan', count: 45000 },
  { name: 'Feb', count: 52000 },
  { name: 'Mar', count: 61000 },
  { name: 'Apr', count: 67000 },
  { name: 'May', count: 75000 },
  { name: 'Jun', count: 82000 },
  { name: 'Jul', count: 91000 },
  { name: 'Aug', count: 98000 },
  { name: 'Sep', count: 105000 },
];

const recentInteractions = [
  {
    id: '1',
    user: 'User #8742',
    topic: 'Anxiety management',
    sentiment: 'positive',
    timestamp: '15 minutes ago',
    flagged: false,
  },
  {
    id: '2',
    user: 'User #6391',
    topic: 'Depression symptoms',
    sentiment: 'negative',
    timestamp: '45 minutes ago',
    flagged: true,
  },
  {
    id: '3',
    user: 'User #9124',
    topic: 'Stress reduction',
    sentiment: 'neutral',
    timestamp: '2 hours ago',
    flagged: false,
  },
  {
    id: '4',
    user: 'User #5287',
    topic: 'Sleep improvement',
    sentiment: 'positive',
    timestamp: '3 hours ago',
    flagged: false,
  },
  {
    id: '5',
    user: 'User #7456',
    topic: 'Relationship advice',
    sentiment: 'negative',
    timestamp: '4 hours ago',
    flagged: true,
  },
];

export default function AIAnalyticsPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">AI Chatbot Analytics</h1>
        <div className="flex items-center gap-2">
          <Select defaultValue="30days">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Interactions</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245,678</div>
            <p className="text-xs text-muted-foreground">
              +24% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2s</div>
            <p className="text-xs text-muted-foreground">
              -0.3s from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Helpful Responses</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <p className="text-xs text-muted-foreground">
              +2% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged Interactions</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">
              -8 from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
          <TabsTrigger value="topics">Common Topics</TabsTrigger>
          <TabsTrigger value="effectiveness">Response Effectiveness</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Interaction Volume</CardTitle>
                <CardDescription>
                  Total AI chatbot interactions over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={interactionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--chart-1))" name="Interactions" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Sentiment Distribution</CardTitle>
                <CardDescription>
                  Overall sentiment of user interactions
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="w-[250px] h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sentimentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {sentimentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Interactions</CardTitle>
              <CardDescription>
                Latest user conversations with the AI chatbot
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Topic</TableHead>
                    <TableHead>Sentiment</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentInteractions.map((interaction) => (
                    <TableRow key={interaction.id}>
                      <TableCell>{interaction.user}</TableCell>
                      <TableCell>{interaction.topic}</TableCell>
                      <TableCell>
                        <Badge variant={
                          interaction.sentiment === 'positive' ? 'default' : 
                          interaction.sentiment === 'neutral' ? 'secondary' : 
                          'destructive'
                        }>
                          {interaction.sentiment}
                        </Badge>
                      </TableCell>
                      <TableCell>{interaction.timestamp}</TableCell>
                      <TableCell>
                        {interaction.flagged ? (
                          <Badge variant="destructive">Flagged</Badge>
                        ) : (
                          <Badge variant="outline">Normal</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sentiment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sentiment Analysis</CardTitle>
              <CardDescription>
                Detailed breakdown of user sentiment during AI interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-6">
                Sentiment analysis helps identify emotional patterns in user conversations, allowing for better response optimization and crisis detection.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-medium mb-2">Sentiment Distribution</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sentimentData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {sentimentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Key Insights</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
                      <p className="text-sm">65% of conversations show positive sentiment, indicating effective support</p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-500 mt-1.5"></div>
                      <p className="text-sm">25% neutral sentiment typically occurs during information gathering</p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5"></div>
                      <p className="text-sm">10% negative sentiment triggers are being analyzed for improvement</p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                      <p className="text-sm">Sentiment improves by 18% on average after 3+ interactions</p>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5"></div>
                      <p className="text-sm">Evening conversations show 12% more positive sentiment than morning ones</p>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="topics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Common User Topics</CardTitle>
              <CardDescription>
                Most frequently discussed mental health topics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topicData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--chart-2))" name="Conversations" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="effectiveness" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Response Effectiveness</CardTitle>
              <CardDescription>
                User feedback on AI chatbot responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={responseData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="helpful" stroke="#10b981" name="Helpful" />
                    <Line type="monotone" dataKey="unhelpful" stroke="#ef4444" name="Unhelpful" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Clock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}