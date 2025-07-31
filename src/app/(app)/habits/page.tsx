
'use client'

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Target, PlusCircle, Repeat, BookOpen, Dumbbell, Edit, Trash2, Flame, BarChartHorizontal } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { isSameDay, startOfWeek, endOfWeek, eachDayOfInterval, format, isWithinInterval, subDays, parseISO, startOfToday, differenceInCalendarDays, addDays, getYear, getMonth, getDate, endOfYear, startOfYear, isSameMonth, getDay } from 'date-fns';
import { Calendar } from "@/components/ui/calendar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"


type Habit = {
  id: number;
  title: string;
  iconName: string; 
  goal: number; // Target completions per week
  days: boolean[]; // Represents Mon-Sun for the CURRENT week
  completions: string[]; // Stores ISO date strings of all completions 'yyyy-MM-dd'
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

const calculateStreak = (habit: Habit, isLongest: boolean = false): number => {
    const { completions, goal } = habit;
    const sortedDates = [...new Set(completions)].map(c => parseISO(c)).sort((a, b) => b.getTime() - a.getTime());

    if (sortedDates.length === 0) return 0;

    const today = startOfToday();

    if (goal === 7) { // Daily streak logic
        let longestStreak = 0;
        let currentStreak = 0;

        if (sortedDates.length > 0) {
            const diffFromToday = differenceInCalendarDays(today, sortedDates[0]);
             if (diffFromToday <= 1) {
                currentStreak = 1;
                longestStreak = 1;
            }
        }
       
        for (let i = 1; i < sortedDates.length; i++) {
            const date1 = sortedDates[i - 1];
            const date2 = sortedDates[i];
            const diff = differenceInCalendarDays(date1, date2);

            if (diff === 1) {
                currentStreak++;
            } else {
                currentStreak = 1; // Reset for a new potential streak
            }
            if (currentStreak > longestStreak) {
                longestStreak = currentStreak;
            }
        }
        
        const mostRecentCompletion = sortedDates[0];
        const diffToday = differenceInCalendarDays(today, mostRecentCompletion);
        if (diffToday > 1) {
             currentStreak = 0;
        }

        return isLongest ? longestStreak : currentStreak;

    } else { // Weekly streak logic
        const completionsByWeek: Record<string, number> = sortedDates.reduce((acc, date) => {
            const weekStartKey = format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd');
            acc[weekStartKey] = (acc[weekStartKey] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const sortedWeekKeys = Object.keys(completionsByWeek).sort((a,b) => parseISO(b).getTime() - parseISO(a).getTime());
        
        let longestStreak = 0;
        let currentStreak = 0;
        
        if (sortedWeekKeys.length > 0) {
            const mostRecentWeekStart = parseISO(sortedWeekKeys[0]);
            const todayWeekStart = startOfWeek(today, { weekStartsOn: 1 });
            const lastWeekStart = startOfWeek(subDays(today, 7), { weekStartsOn: 1 });

            const isMostRecentThisWeek = isSameDay(mostRecentWeekStart, todayWeekStart);
            const isMostRecentLastWeek = isSameDay(mostRecentWeekStart, lastWeekStart);
           
            if ((isMostRecentThisWeek && completionsByWeek[sortedWeekKeys[0]] >= goal) || isMostRecentLastWeek) {
                 // Streak is potentially active
            } else {
                currentStreak = 0; // Streak is broken
            }

            let consecutiveWeeks = 0;
            for (let i = 0; i < sortedWeekKeys.length; i++) {
                const weekKey = sortedWeekKeys[i];
                if (completionsByWeek[weekKey] >= goal) {
                    if (i > 0) {
                        const prevWeekKey = sortedWeekKeys[i-1];
                        const diff = differenceInCalendarDays(parseISO(prevWeekKey), parseISO(weekKey));
                        if(diff === 7) {
                           consecutiveWeeks++;
                        } else {
                           consecutiveWeeks = 1;
                        }
                    } else {
                        consecutiveWeeks = 1;
                    }
                } else {
                    consecutiveWeeks = 0;
                }
                
                if (i === 0) {
                    currentStreak = consecutiveWeeks;
                }

                if (consecutiveWeeks > longestStreak) {
                    longestStreak = consecutiveWeeks;
                }
            }
        }
        
        return isLongest ? longestStreak : currentStreak;
    }
};

const HabitReportDialog = ({ habit, isOpen, onClose }: { habit: Habit, isOpen: boolean, onClose: () => void }) => {
    if (!isOpen) return null;

    const today = new Date();
    const yearStart = startOfYear(today);
    const completionsInYear = habit.completions.filter(c => getYear(parseISO(c)) === getYear(today));
    const completionDates = useMemo(() => new Set(completionsInYear), [completionsInYear]);
    const longestStreak = calculateStreak(habit, true);

    const completionRate = Math.round((completionsInYear.length / 365) * 100);

    const getMonthMatrix = (year: number, month: number) => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const matrix = [];
        let week: (Date | null)[] = [];

        // Fill initial empty days
        const startDayOfWeek = getDay(firstDay) === 0 ? 6 : getDay(firstDay) - 1; // Mon = 0
        for (let i = 0; i < startDayOfWeek; i++) {
            week.push(null);
        }

        for (let day = 1; day <= getDate(lastDay); day++) {
            const date = new Date(year, month, day);
            week.push(date);
            if (week.length === 7) {
                matrix.push(week);
                week = [];
            }
        }
        
        if (week.length > 0) {
            while (week.length < 7) {
                week.push(null);
            }
            matrix.push(week);
        }

        return matrix;
    }
    
    const months = Array.from({ length: 12 }, (_, i) => i);
    const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>{habit.title}: Progress Report</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <Card>
                            <CardHeader className="p-4">
                                <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                                <p className="text-2xl font-bold">{habit.currentStreak} {habit.goal === 7 ? 'days' : 'weeks'}</p>
                            </CardHeader>
                        </Card>
                         <Card>
                            <CardHeader className="p-4">
                                <CardTitle className="text-sm font-medium">Longest Streak</CardTitle>
                                <p className="text-2xl font-bold">{longestStreak} {habit.goal === 7 ? 'days' : 'weeks'}</p>
                            </CardHeader>
                        </Card>
                         <Card>
                            <CardHeader className="p-4">
                                <CardTitle className="text-sm font-medium">Yearly Completions</CardTitle>
                                <p className="text-2xl font-bold">{completionsInYear.length}</p>
                            </CardHeader>
                        </Card>
                         <Card>
                            <CardHeader className="p-4">
                                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                                <p className="text-2xl font-bold">{completionRate}%</p>
                            </CardHeader>
                        </Card>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2 text-center">Activity Heatmap ({getYear(today)})</h3>
                        <TooltipProvider>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                           {months.map(month => (
                                <div key={month}>
                                    <h4 className="font-semibold text-center mb-2">{monthLabels[month]}</h4>
                                    <div className="grid grid-cols-7 gap-1">
                                        {["M", "T", "W", "T", "F", "S", "S"].map(day => <div key={day} className="text-xs text-center text-muted-foreground">{day}</div>)}
                                        {getMonthMatrix(getYear(today), month).flat().map((day, index) => {
                                             if (!day) return <div key={`empty-${index}`} className="w-4 h-4" />;
                                             const isCompleted = completionDates.has(format(day, 'yyyy-MM-dd'));
                                             return (
                                                 <Tooltip key={day.toString()}>
                                                     <TooltipTrigger asChild>
                                                         <div className={cn("w-4 h-4 rounded-sm", isCompleted ? 'bg-primary' : 'bg-muted/50')} />
                                                     </TooltipTrigger>
                                                     <TooltipContent>
                                                         <p>{format(day, 'PPP')} - {isCompleted ? "Completed" : "Not Completed"}</p>
                                                     </TooltipContent>
                                                 </Tooltip>
                                             );
                                        })}
                                    </div>
                                </div>
                           ))}
                        </div>
                        </TooltipProvider>
                    </div>
                </div>
                 <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function HabitsPage() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [selectedHabitForReport, setSelectedHabitForReport] = useState<Habit | null>(null);
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
                    
                    const completionsForCurrentWeek = (h.completions || []).filter((c: string) => {
                        const completionDate = parseISO(c);
                        return isWithinInterval(completionDate, { start: weekStart, end: weekEnd })
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

    const handleOpenReport = (habit: Habit) => {
        setSelectedHabitForReport(habit);
        setIsReportOpen(true);
    }
    
    const handleCloseReport = () => {
        setIsReportOpen(false);
        setSelectedHabitForReport(null);
    }

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
            const updatedHabits = habits.map(h => h.id === editingHabit.id ? { ...h, title: habitDetails.title, goal: habitDetails.goal } : h);
            const finalHabits = updatedHabits.map(h => ({...h, currentStreak: calculateStreak(h)}));
            setHabits(finalHabits);
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
        
        const dateForDayIndex = addDays(weekStart, dayIndex);
        const dateString = format(dateForDayIndex, 'yyyy-MM-dd');
    
        setHabits(habits.map(habit => {
          if (habit.id === habitId) {
            const newDays = [...habit.days];
            newDays[dayIndex] = !newDays[dayIndex];
            
            let newCompletions;
            const completionExists = habit.completions.includes(dateString);

            if (newDays[dayIndex]) { // If checkbox is checked
                if (!completionExists) {
                    newCompletions = [...habit.completions, dateString];
                } else {
                    newCompletions = habit.completions;
                }
            } else { // If checkbox is unchecked
                newCompletions = habit.completions.filter(c => c !== dateString);
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
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenReport(habit)}>
                        <BarChartHorizontal className="h-4 w-4" />
                    </Button>
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

        {selectedHabitForReport && (
            <HabitReportDialog
                habit={selectedHabitForReport}
                isOpen={isReportOpen}
                onClose={handleCloseReport}
            />
        )}
    </div>
  )
}

