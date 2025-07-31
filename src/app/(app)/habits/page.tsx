
'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Target, PlusCircle, Repeat, BookOpen, Dumbbell, Edit, Trash2, Flame } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { isSameDay, startOfWeek, endOfWeek, eachDayOfInterval, format, isWithinInterval, subDays, parseISO, startOfToday, startOfDay, differenceInCalendarDays } from 'date-fns';


type Habit = {
  id: number;
  title: string;
  iconName: string; 
  goal: number; // Target completions per week
  days: boolean[]; // Represents Mon-Sun for the CURRENT week
  completions: string[]; // Stores ISO date strings of all completions
  currentStreak: number;
};

const goalOptions: { label: string, value: number }[] = [
    { label: "Daily", value: 7 },
    { label: "Every weekday", value: 5 },
    { label: "3 times a week", value: 3 },
    { label: "Twice a week", value: 2 },
    { label: "Once a week", value: 1 },
];

const getIcon = (name: string): React.ElementType => {
    switch (name) {
        case 'BookOpen': return BookOpen;
        case 'Dumbbell': return Dumbbell;
        case 'Repeat': return Repeat;
        case 'Target': return Target;
        default: return Target;
    }
}

const initialHabits: Habit[] = [
  {
    id: 1,
    title: "Read for 30 minutes",
    iconName: "BookOpen",
    goal: 7,
    days: [true, true, true, true, false, true, false],
    completions: [],
    currentStreak: 0,
  },
  {
    id: 2,
    title: "Morning workout",
    iconName: "Dumbbell",
    goal: 5,
    days: [true, false, true, true, false, true, true],
    completions: [],
    currentStreak: 0,
  },
  {
    id: 3,
    title: "Review Spanish flashcards",
    iconName: "Repeat",
    goal: 7,
    days: [true, false, true, false, true, false, false],
    completions: [],
    currentStreak: 0,
  },
  {
    id: 4,
    title: "Work on side project",
    iconName: "Target",
    goal: 3,
    days: [false, true, false, false, true, false, false],
    completions: [],
    currentStreak: 0,
  },
];

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const calculateProgress = (days: boolean[], goal: number) => {
    const completedDays = days.filter(Boolean).length;
    if (goal <= 0) return 0;
    return Math.min(Math.round((completedDays / goal) * 100), 100);
}

const calculateStreak = (habit: Habit): number => {
    const { completions, goal } = habit;
    const sortedDates = completions.map(c => parseISO(c)).sort((a, b) => b.getTime() - a.getTime());

    if (sortedDates.length === 0) return 0;

    const today = startOfToday();

    if (goal === 7) { // Daily streak logic
        const mostRecentCompletion = sortedDates[0];
        const diffFromToday = differenceInCalendarDays(today, mostRecentCompletion);

        if (diffFromToday > 1) {
            return 0; // Streak broken
        }

        let streak = 1;
        for (let i = 1; i < sortedDates.length; i++) {
            const date1 = sortedDates[i - 1];
            const date2 = sortedDates[i];
            const diff = differenceInCalendarDays(date1, date2);

            if (diff === 1) {
                streak++;
            } else {
                break; // Not consecutive
            }
        }
        return streak;
    } else { // Weekly streak logic
        let currentWeekStart = startOfWeek(today, { weekStartsOn: 1 });
        
        const completionsInCurrentWeek = sortedDates.filter(d => 
            isWithinInterval(d, { start: currentWeekStart, end: endOfWeek(currentWeekStart, { weekStartsOn: 1 }) })
        ).length;

        // If goal for this week isn't met yet, start checking from last week
        if (completionsInCurrentWeek < goal) {
             currentWeekStart = startOfWeek(subDays(currentWeekStart, 7), { weekStartsOn: 1 });
        }
        
        let streak = 0;
        while (true) {
            const weekStart = currentWeekStart;
            const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });

            const completionsInWeek = sortedDates.filter(d => 
                isWithinInterval(d, { start: weekStart, end: weekEnd })
            ).length;

            if (completionsInWeek >= goal) {
                streak++;
                currentWeekStart = startOfWeek(subDays(weekStart, 7), { weekStartsOn: 1 });
            } else {
                break;
            }
        }
        return streak;
    }
};


export default function HabitsPage() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
    const [habitDetails, setHabitDetails] = useState<{ title: string; goal: number }>({ title: "", goal: 7 });

    useEffect(() => {
        try {
            const storedHabits = localStorage.getItem('learnify-habits');
            if (storedHabits) {
                const parsedHabits = JSON.parse(storedHabits);
                const today = new Date();
                const weekStart = startOfWeek(today, { weekStartsOn: 1 });
                const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

                const migratedHabits = parsedHabits.map((h: any) => {
                    const lastCompletionDate = h.completions && h.completions.length > 0
                        ? new Date(Math.max.apply(null, h.completions.map((c: string) => new Date(c).getTime())))
                        : new Date(0);
                    
                    const completionsForCurrentWeek = (h.completions || []).filter((c: string) => {
                        return isWithinInterval(parseISO(c), { start: weekStart, end: weekEnd })
                    });
                    
                    const days = Array(7).fill(false);
                    const weekDates = eachDayOfInterval({ start: weekStart, end: weekEnd });
                    
                    weekDates.forEach((date, index) => {
                       if (completionsForCurrentWeek.some((c: string) => isSameDay(parseISO(c), date))) {
                           days[index] = true;
                       }
                    });

                    const updatedHabit = {
                        ...h,
                        days,
                        completions: h.completions || [],
                    };
                    return {
                        ...updatedHabit,
                        currentStreak: calculateStreak(updatedHabit),
                    };
                });
                setHabits(migratedHabits);
            } else {
                setHabits(initialHabits);
            }
        } catch (error) {
            console.error("Failed to parse habits from localStorage", error);
            setHabits(initialHabits);
        }
    }, []);

    useEffect(() => {
        if(habits.length > 0) {
            localStorage.setItem('learnify-habits', JSON.stringify(habits));
        }
    }, [habits]);


    const handleOpenDialog = (habit: Habit | null) => {
        if (habit) {
            setEditingHabit(habit);
            setHabitDetails({ title: habit.title, goal: habit.goal });
        } else {
            setEditingHabit(null);
            setHabitDetails({ title: "", goal: 7 });
        }
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingHabit(null);
        setHabitDetails({ title: "", goal: 7 });
    };

    const handleSaveHabit = () => {
        if (!habitDetails.title || !habitDetails.goal) {
            alert("Please fill out all fields.");
            return;
        }

        if (editingHabit) {
            setHabits(habits.map(h => h.id === editingHabit.id ? { ...h, title: habitDetails.title, goal: habitDetails.goal } : h));
        } else {
            const newHabit: Habit = {
                id: habits.length > 0 ? Math.max(...habits.map(h => h.id)) + 1 : 1,
                title: habitDetails.title,
                goal: habitDetails.goal,
                iconName: 'Target',
                days: Array(7).fill(false),
                completions: [],
                currentStreak: 0,
            };
            setHabits([...habits, newHabit]);
        }
        handleCloseDialog();
    };

    const handleDeleteHabit = (habitId: number) => {
        setHabits(habits.filter(h => h.id !== habitId));
    };

    const handleToggleDay = (habitId: number, dayIndex: number) => {
        const today = new Date();
        const weekStart = startOfWeek(today, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
        const weekDates = eachDayOfInterval({ start: weekStart, end: weekEnd });

        const dateForDayIndex = weekDates[dayIndex];
    
        const dateString = format(dateForDayIndex, 'yyyy-MM-dd');
    
        setHabits(habits.map(habit => {
          if (habit.id === habitId) {
            const newDays = [...habit.days];
            newDays[dayIndex] = !newDays[dayIndex];
            
            let newCompletions = [...habit.completions];
            
            if (newDays[dayIndex]) {
              if (!newCompletions.includes(dateString)) {
                newCompletions.push(dateString);
              }
            } else {
              newCompletions = newCompletions.filter(c => c !== dateString);
            }

            const updatedHabit = { ...habit, days: newDays, completions: newCompletions };
            const newStreak = calculateStreak(updatedHabit);
            
            return { ...updatedHabit, currentStreak: newStreak };
          }
          return habit;
        }));
      };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Habit Tracker</h1>
          <p className="text-muted-foreground">Build good habits, one day at a time.</p>
        </div>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => handleOpenDialog(null)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Habit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {habits.map((habit) => {
          const Icon = getIcon(habit.iconName);
          const progress = calculateProgress(habit.days, habit.goal);
          const completedDays = habit.days.filter(Boolean).length;
          const goalLabel = goalOptions.find(g => g.value === habit.goal)?.label || `${habit.goal} times a week`;
          const streakType = habit.goal === 7 ? 'day' : 'week';


          return(
          <Card key={habit.id} className="shadow-md flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-primary" />
                        <span>{habit.title}</span>
                    </CardTitle>
                    <CardDescription>{goalLabel}</CardDescription>
                </div>
                 <div className="flex items-center">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenDialog(habit)}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your habit.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteHabit(habit.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                 </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              {habit.currentStreak > 0 && (
                <div className="flex items-center justify-center gap-2 text-sm text-amber-500 mb-3 font-medium">
                    <Flame className="h-4 w-4" />
                    <span>{habit.currentStreak} {streakType} streak</span>
                </div>
              )}
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium">
                    {completedDays} / {habit.goal} times
                </p>
                <p className="text-sm text-muted-foreground">{progress}%</p>
              </div>
              <Progress value={progress} className="h-2" />
            </CardContent>
            <CardFooter className="flex justify-around bg-muted/50 py-3 mt-auto">
              {dayLabels.map((day, dayIndex) => (
                <div key={day} className="flex flex-col items-center gap-2">
                  <label className="text-xs font-medium text-muted-foreground">{day}</label>
                  <Checkbox 
                    checked={habit.days[dayIndex]} 
                    onCheckedChange={() => handleToggleDay(habit.id, dayIndex)}
                    aria-label={`${habit.title} on ${day}`} 
                  />
                </div>
              ))}
            </CardFooter>
          </Card>
        )})}
      </div>

       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{editingHabit ? "Edit Habit" : "Add New Habit"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="habit-title">Habit Title</Label>
                        <Input
                            id="habit-title"
                            value={habitDetails.title}
                            onChange={(e) => setHabitDetails({ ...habitDetails, title: e.target.value })}
                            placeholder="e.g., Drink 8 glasses of water"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="habit-goal">Goal</Label>
                        <Select
                            value={String(habitDetails.goal)}
                            onValueChange={(value) => setHabitDetails({ ...habitDetails, goal: Number(value) })}>
                            <SelectTrigger id="habit-goal">
                                <SelectValue placeholder="Select a weekly goal" />
                            </SelectTrigger>
                            <SelectContent>
                                {goalOptions.map(option => (
                                    <SelectItem key={option.value} value={String(option.value)}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSaveHabit}>Save Habit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  )
}
