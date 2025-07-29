import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Target, PlusCircle, Repeat, BookOpen, Dumbbell } from "lucide-react"

const habits = [
  {
    title: "Read for 30 minutes",
    icon: BookOpen,
    goal: "Daily",
    progress: 66,
    days: [true, true, true, true, false, true, false],
  },
  {
    title: "Morning workout",
    icon: Dumbbell,
    goal: "5 times a week",
    progress: 80,
    days: [true, false, true, true, false, true, true],
  },
  {
    title: "Review Spanish flashcards",
    icon: Repeat,
    goal: "Daily",
    progress: 43,
    days: [true, false, true, false, true, false, false],
  },
  {
    title: "Work on side project",
    icon: Target,
    goal: "3 times a week",
    progress: 33,
    days: [false, true, false, false, true, false, false],
  },
]

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function HabitsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Habit Tracker</h1>
          <p className="text-muted-foreground">Build good habits, one day at a time.</p>
        </div>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Habit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {habits.map((habit, index) => {
          const Icon = habit.icon;
          return(
          <Card key={index} className="shadow-md">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-primary" />
                        <span>{habit.title}</span>
                    </CardTitle>
                    <CardDescription>{habit.goal}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium">Weekly Progress</p>
                <p className="text-sm text-muted-foreground">{habit.progress}%</p>
              </div>
              <Progress value={habit.progress} className="h-2" />
            </CardContent>
            <CardFooter className="flex justify-around bg-muted/50 py-3">
              {dayLabels.map((day, dayIndex) => (
                <div key={day} className="flex flex-col items-center gap-2">
                  <label className="text-xs font-medium text-muted-foreground">{day}</label>
                  <Checkbox checked={habit.days[dayIndex]} aria-label={`${habit.title} on ${day}`} />
                </div>
              ))}
            </CardFooter>
          </Card>
        )})}
      </div>
    </div>
  )
}
