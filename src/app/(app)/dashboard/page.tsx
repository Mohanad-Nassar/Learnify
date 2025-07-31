
'use client';

import { useState, useEffect, useContext } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flame, Play, Plus, ListTodo, Target, CheckCircle } from 'lucide-react';
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
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SubjectContext } from '@/context/SubjectContext';
import { format, isToday, parseISO, startOfToday, subDays, isWithinInterval, startOfWeek, endOfWeek, subWeeks } from 'date-fns';

type Task = {
  id: number;
  title: string;
  subject: string;
  status: "Not Started" | "In Progress" | "Done";
  dueDate: string;
  isCompleted: boolean;
};

type Habit = {
  id: number;
  title: string;
  iconName: string; 
  goal: number; 
  days: boolean[];
  completions: string[];
};

const calculateHabitProgress = (days: boolean[], goal: number) => {
    const completedDays = days.filter(Boolean).length;
    if (goal <= 0) return 0;
    return Math.min(Math.round((completedDays / goal) * 100), 100);
}

const calculateStreak = (habit: Habit): number => {
    const { completions, goal } = habit;
    if (!completions) return 0;
    
    const completionDates = new Set(completions);
    const sortedDates = [...new Set(completions)].map(c => parseISO(c)).sort((a, b) => b.getTime() - a.getTime());

    if (sortedDates.length === 0) return 0;
    const today = startOfToday();

    if (goal === 7) { // Daily streak logic
        let currentStreak = 0;
        let dayToCheck = today;
        
        // If today is not completed, check from yesterday
        if(!completionDates.has(format(today, 'yyyy-MM-dd'))) {
            dayToCheck = subDays(today, 1);
        }

        while(completionDates.has(format(dayToCheck, 'yyyy-MM-dd'))) {
            currentStreak++;
            dayToCheck = subDays(dayToCheck, 1);
        }
        return currentStreak;
    } else { // Weekly streak logic
        const weekOptions = { weekStartsOn: 1 as const };
        let currentWeekStart = startOfWeek(today, weekOptions);
        
        const completionsInCurrentWeek = sortedDates.filter(d => 
            isWithinInterval(d, { start: currentWeekStart, end: endOfWeek(currentWeekStart, weekOptions) })
        ).length;

        // If current week's goal isn't met, the streak calculation should start from the previous week.
        if (completionsInCurrentWeek < goal) {
             currentWeekStart = subWeeks(currentWeekStart, 1);
        }
        
        let weeklyStreak = 0;
        while (true) {
            const weekStart = currentWeekStart;
            const weekEnd = endOfWeek(weekStart, weekOptions);

            const completionsInWeek = sortedDates.filter(d => 
                isWithinInterval(d, { start: weekStart, end: weekEnd })
            ).length;

            if (completionsInWeek >= goal) {
                weeklyStreak++;
                currentWeekStart = subWeeks(weekStart, 1);
            } else {
                break; // End of streak
            }
        }
        return weeklyStreak;
    }
};


export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const { subjects } = useContext(SubjectContext);

  const [taskDetails, setTaskDetails] = useState({
    title: "",
    subject: "",
    dueDate: "",
  });

  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem('learnify-tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
      const storedHabits = localStorage.getItem('learnify-habits');
      if (storedHabits) {
        setHabits(JSON.parse(storedHabits));
      }
    } catch (error) {
      console.error("Failed to parse data from localStorage", error);
    }
  }, []);

  const updateTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem('learnify-tasks', JSON.stringify(newTasks));
  }

  const resetForm = () => {
    setTaskDetails({
      title: "",
      subject: "",
      dueDate: "",
    });
  };

  const handleOpenTaskDialog = () => {
      resetForm();
      setIsTaskDialogOpen(true);
  };
  
  const handleCloseTaskDialog = () => {
    resetForm();
    setIsTaskDialogOpen(false);
  }

  const handleSaveTask = () => {
    if (!taskDetails.title || !taskDetails.dueDate) {
      alert("Please fill in title and due date.");
      return;
    }
     const newTask: Task = {
        id: tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1,
        title: taskDetails.title,
        subject: taskDetails.subject,
        dueDate: new Date(taskDetails.dueDate).toISOString(),
        status: "Not Started",
        isCompleted: false,
      };
      updateTasks([...tasks, newTask]);

    handleCloseTaskDialog();
  };
  
  const handleInputChange = (field: keyof typeof taskDetails, value: string) => {
    setTaskDetails(prev => ({ ...prev, [field]: value }));
  };

  const todaysTasks = tasks.filter(task => isToday(parseISO(task.dueDate)));
  const completedTodayCount = todaysTasks.filter(task => task.isCompleted).length;

  const incompleteTasks = tasks
    .filter(task => !task.isCompleted)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);
    
  const maxStreak = habits.length > 0
    ? Math.max(...habits.map(habit => calculateStreak(habit)))
    : 0;


  return (
    <div className="space-y-8 max-w-7xl mx-auto">
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
            <div className="text-4xl font-bold">{maxStreak} days</div>
            <p className="text-xs text-muted-foreground">Your longest active streak.</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Focus Session</CardTitle>
            <Play className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Ready to focus?</p>
            <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/focus">Start Session</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today's Tasks</CardTitle>
            <ListTodo className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{completedTodayCount}/{todaysTasks.length}</div>
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
            <Button variant="outline" className="w-full" onClick={handleOpenTaskDialog}>
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
              <span>Upcoming Tasks</span>
            </CardTitle>
            <CardDescription>Your next 5 most urgent tasks.</CardDescription>
          </CardHeader>
          <CardContent>
            {incompleteTasks.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Task</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead className="text-right">Due Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {incompleteTasks.map(task => (
                            <TableRow key={task.id}>
                                <TableCell className="font-medium">{task.title}</TableCell>
                                <TableCell>{task.subject}</TableCell>
                                <TableCell className="text-right">
                                    <Badge variant="outline">
                                        {format(parseISO(task.dueDate), 'MMM dd')}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <div className="text-center py-10">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                    <h3 className="mt-2 text-lg font-medium">All tasks are done!</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Great job! Enjoy your break.</p>
                </div>
            )}
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
            {habits.length > 0 ? habits.map((habit) => {
              const progress = calculateHabitProgress(habit.days, habit.goal);
              return (
                <div key={habit.id}>
                    <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium">{habit.title}</p>
                    <p className="text-sm text-muted-foreground">{progress}%</p>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>
              )
            }) : (
                 <p className="text-center text-sm text-muted-foreground py-4">No habits tracked yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
      
       <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
          <DialogContent className="sm:max-w-[425px]" onInteractOutside={handleCloseTaskDialog}>
            <DialogHeader>
              <DialogTitle>Add Task</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={taskDetails.title} onChange={(e) => handleInputChange('title', e.target.value)} placeholder="e.g. Finish Math assignment" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select
                  value={taskDetails.subject}
                  onValueChange={(value) => handleInputChange('subject', value)}
                >
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.name}>{subject.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" type="date" value={taskDetails.dueDate} onChange={(e) => handleInputChange('dueDate', e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCloseTaskDialog} variant="outline">Cancel</Button>
              <Button onClick={handleSaveTask} className="bg-primary hover:bg-primary/90 text-primary-foreground">Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </div>
  );
}
