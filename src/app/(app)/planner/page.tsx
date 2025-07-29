import { Calendar } from "@/components/ui/calendar"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const upcomingSessions = [
  { time: "10:00 AM", title: "Math Tutoring", type: "Tutoring" },
  { time: "2:00 PM", title: "History Study Group", type: "Group Study" },
  { time: "5:00 PM", title: "Spanish Conversation", type: "Practice" },
]

export default function PlannerPage() {
  return (
    <div className="space-y-8">
       <div>
          <h1 className="text-3xl font-bold font-headline">Study Planner</h1>
          <p className="text-muted-foreground">Plan your study sessions and stay organized.</p>
        </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
           <Card className="shadow-md">
              <CardContent className="p-0">
                <Calendar
                  mode="single"
                  selected={new Date()}
                  className="p-3 w-full"
                  classNames={{
                      months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                      month: "space-y-4 w-full",
                      table: "w-full border-collapse space-y-1",
                      head_row: "flex w-full",
                      row: "flex w-full mt-2",
                  }}
                />
              </CardContent>
            </Card>
        </div>
        <div>
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Upcoming Sessions</CardTitle>
              <CardDescription>What's on your schedule for today.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {upcomingSessions.map((session, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-16 text-right">
                      <p className="font-semibold text-sm">{session.time}</p>
                    </div>
                    <div className="relative w-full">
                       <span className="absolute left-0 top-1 h-full w-px bg-border -translate-x-4"></span>
                       <span className="absolute left-0 top-2.5 h-3 w-3 rounded-full bg-primary -translate-x-[22px]"></span>
                      <p className="font-medium">{session.title}</p>
                      <Badge variant="outline" className="mt-1">{session.type}</Badge>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
