import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flame, Play, Plus, ListTodo, Calendar, Target, CheckCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const tasks = [
    { id: 1, title: "Finish Math Homework", subject: "Math", status: "In Progress" },
    { id: 2, title: "Read Chapter 4 of History", subject: "History", status: "Not Started" },
    { id: 3, title: "Practice Spanish vocabulary", subject: "Spanish", status: "Done" },
];

const habits = [
  { name: "Read 20 pages", progress: 75 },
  { name: "Meditate 10 mins", progress: 50 },
  { name: "Code for 1 hour", progress: 90 },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Welcome back!</h1>
        <p className="text-muted-foreground">Here's your snapshot for today.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">12 days</div>
            <p className="text-xs text-muted-foreground">Keep up the great work!</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Focus Session</CardTitle>
            <Play className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Ready to focus?</p>
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              Start Session
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today's Tasks</CardTitle>
            <ListTodo className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">1/3</div>
            <p className="text-xs text-muted-foreground">Completed tasks</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Add New Task</CardTitle>
            <Plus className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Plan your next move.</p>
            <Button variant="outline" className="w-full">
              Add Task
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListTodo className="h-5 w-5" />
              <span>Today's Tasks</span>
            </CardTitle>
            <CardDescription>What's on your plate for today?</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Task</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tasks.map(task => (
                        <TableRow key={task.id}>
                            <TableCell className="font-medium">{task.title}</TableCell>
                            <TableCell>{task.subject}</TableCell>
                            <TableCell className="text-right">
                                <Badge variant={task.status === 'Done' ? 'default' : task.status === 'In Progress' ? 'secondary' : 'outline'} className={task.status === 'Done' ? 'bg-primary/20 text-primary-foreground' : ''}>
                                    {task.status}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              <span>Habit Progress</span>
            </CardTitle>
            <CardDescription>Your daily habits at a glance.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {habits.map((habit) => (
              <div key={habit.name}>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-medium">{habit.name}</p>
                  <p className="text-sm text-muted-foreground">{habit.progress}%</p>
                </div>
                <Progress value={habit.progress} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
