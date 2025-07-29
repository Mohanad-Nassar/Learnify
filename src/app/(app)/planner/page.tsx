
'use client'

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

const studySessions = [
  { id: 1, time: "10:00 AM - 11:00 AM", subject: "Math" },
  { id: 2, time: "11:00 AM - 12:00 PM", subject: "Science" },
  { id: 3, time: "12:00 PM - 1:00 PM", subject: "History" },
]

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function PlannerPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [activeDay, setActiveDay] = useState("Mon");


  return (
    <div className="space-y-8">
       <div>
          <h1 className="text-3xl font-bold font-headline">Study Planner</h1>
          <p className="text-muted-foreground">Plan your study sessions and stay organized.</p>
        </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
           <Card className="shadow-md">
              <CardContent className="p-0 flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="p-3"
                />
              </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-md">
                <CardContent className="p-4">
                    <div className="flex justify-around border-b pb-3">
                        {daysOfWeek.map(day => (
                            <button 
                                key={day} 
                                onClick={() => setActiveDay(day)}
                                className={`text-center font-medium ${activeDay === day ? 'text-primary' : 'text-muted-foreground'}`}
                            >
                                <p>{day}</p>
                            </button>
                        ))}
                    </div>
                     <Button className="w-full mt-4 bg-accent text-accent-foreground hover:bg-accent/90">
                       Add Session
                    </Button>
                </CardContent>
            </Card>

           <Card className="shadow-md">
                <CardContent className="p-6">
                     <h2 className="text-xl font-bold mb-4">Study Session List</h2>
                      <ul className="space-y-4">
                        {studySessions.map((session) => (
                          <li key={session.id} className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold">{session.time}</p>
                              <p className="text-muted-foreground">{session.subject}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="icon">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <Pencil className="h-4 w-4" />
                                </Button>
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
