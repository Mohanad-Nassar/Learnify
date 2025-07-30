
'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Target, PlusCircle, Repeat, BookOpen, Dumbbell, Edit, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Habit = {
  id: number;
  title: string;
  icon: React.ElementType;
  goal: string;
  days: boolean[];
};

const initialHabits: Habit[] = [
  {
    id: 1,
    title: "Read for 30 minutes",
    icon: BookOpen,
    goal: "Daily",
    days: [true, true, true, true, false, true, false],
  },
  {
    id: 2,
    title: "Morning workout",
    icon: Dumbbell,
    goal: "5 times a week",
    days: [true, false, true, true, false, true, true],
  },
  {
    id: 3,
    title: "Review Spanish flashcards",
    icon: Repeat,
    goal: "Daily",
    days: [true, false, true, false, true, false, false],
  },
  {
    id: 4,
    title: "Work on side project",
    icon: Target,
    goal: "3 times a week",
    days: [false, true, false, false, true, false, false],
  },
];

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const calculateProgress = (days: boolean[]) => {
    const completedDays = days.filter(Boolean).length;
    return Math.round((completedDays / days.length) * 100);
}


export default function HabitsPage() {
    const [habits, setHabits] = useState<Habit[]>(initialHabits);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
    const [habitDetails, setHabitDetails] = useState({ title: "", goal: "" });

    const handleOpenDialog = (habit: Habit | null) => {
        if (habit) {
            setEditingHabit(habit);
            setHabitDetails({ title: habit.title, goal: habit.goal });
        } else {
            setEditingHabit(null);
            setHabitDetails({ title: "", goal: "" });
        }
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingHabit(null);
        setHabitDetails({ title: "", goal: "" });
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
                icon: Target, // Default icon for new habits
                days: Array(7).fill(false),
            };
            setHabits([...habits, newHabit]);
        }
        handleCloseDialog();
    };

    const handleDeleteHabit = (habitId: number) => {
        setHabits(habits.filter(h => h.id !== habitId));
    };

    const handleToggleDay = (habitId: number, dayIndex: number) => {
        setHabits(habits.map(habit => {
            if (habit.id === habitId) {
                const newDays = [...habit.days];
                newDays[dayIndex] = !newDays[dayIndex];
                return { ...habit, days: newDays };
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
          const Icon = habit.icon;
          const progress = calculateProgress(habit.days);
          return(
          <Card key={habit.id} className="shadow-md">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-primary" />
                        <span>{habit.title}</span>
                    </CardTitle>
                    <CardDescription>{habit.goal}</CardDescription>
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
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium">Weekly Progress</p>
                <p className="text-sm text-muted-foreground">{progress}%</p>
              </div>
              <Progress value={progress} className="h-2" />
            </CardContent>
            <CardFooter className="flex justify-around bg-muted/50 py-3">
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
                        <Input
                            id="habit-goal"
                            value={habitDetails.goal}
                            onChange={(e) => setHabitDetails({ ...habitDetails, goal: e.target.value })}
                            placeholder="e.g., Daily"
                        />
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

    