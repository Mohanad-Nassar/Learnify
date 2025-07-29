
'use client'

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus, Calendar as CalendarIcon } from "lucide-react";
import { format, parseISO, startOfDay, getDay, startOfWeek, addDays, setDay } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type StudySession = {
  id: number;
  time: string;
  subject: string;
  date: string; // ISO string
};

const initialSessions: StudySession[] = [
  { id: 1, time: "10:00 AM - 11:00 AM", subject: "Math", date: new Date().toISOString() },
  { id: 2, time: "02:00 PM - 03:00 PM", subject: "History", date: new Date().toISOString() },
];

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function PlannerPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [sessions, setSessions] = useState<StudySession[]>(initialSessions);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<StudySession | null>(null);
  const [sessionDetails, setSessionDetails] = useState({
    subject: "",
    time: "",
  });

  const activeDayIndex = selectedDate ? getDay(selectedDate) : getDay(new Date());

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setIsCalendarOpen(false); // Close the popover on date selection
  }

  const handleDayOfWeekSelect = (dayIndex: number) => {
    const currentWeekStart = startOfWeek(selectedDate || new Date());
    const newSelectedDate = addDays(currentWeekStart, dayIndex);
    setSelectedDate(newSelectedDate);
  }

  const filteredSessions = sessions.filter(session => {
    if (!selectedDate) return false;
    return startOfDay(parseISO(session.date)).getTime() === startOfDay(selectedDate).getTime();
  });

  const resetForm = () => {
    setSessionDetails({ subject: "", time: "" });
    setEditingSession(null);
  };

  const handleOpenDialog = (session: StudySession | null) => {
    if (session) {
      setEditingSession(session);
      setSessionDetails({
        subject: session.subject,
        time: session.time,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    resetForm();
    setIsDialogOpen(false);
  }

  const handleSaveSession = () => {
    if (!sessionDetails.subject || !sessionDetails.time || !selectedDate) {
      alert("Please fill in all fields.");
      return;
    }

    if (editingSession) {
      setSessions(
        sessions.map((session) =>
          session.id === editingSession.id 
            ? { ...session, subject: sessionDetails.subject, time: sessionDetails.time, date: selectedDate.toISOString() } 
            : session
        )
      );
    } else {
      const newSession: StudySession = {
        id: Math.max(...sessions.map((s) => s.id), 0) + 1,
        subject: sessionDetails.subject,
        time: sessionDetails.time,
        date: selectedDate.toISOString(),
      };
      setSessions([...sessions, newSession]);
    }
    handleCloseDialog();
  };

  const handleDeleteSession = (sessionId: number) => {
    setSessions(sessions.filter(session => session.id !== sessionId));
  };

  const handleInputChange = (field: keyof typeof sessionDetails, value: string) => {
    setSessionDetails(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
       <div>
          <h1 className="text-3xl font-bold font-headline">Study Planner</h1>
          <p className="text-muted-foreground">Plan your study sessions and stay organized.</p>
        </div>
      <div className="space-y-6">
            <Card className="shadow-md">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between border-b pb-3">
                        <div className="flex justify-around flex-grow">
                            {daysOfWeek.map((day, index) => (
                                <button 
                                    key={day} 
                                    onClick={() => handleDayOfWeekSelect(index)}
                                    className={cn(
                                      "text-center font-medium w-full py-2",
                                      activeDayIndex === index ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
                                    )}
                                >
                                    <p>{day}</p>
                                </button>
                            ))}
                        </div>
                        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="ml-4">
                                    <CalendarIcon className="h-5 w-5" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="end">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={handleDateSelect}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </CardContent>
            </Card>

           <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Study Sessions for {selectedDate ? format(selectedDate, 'MMMM dd') : ''}</CardTitle>
                 <Button onClick={() => handleOpenDialog(null)} className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <Plus className="mr-2 h-4 w-4" /> Add Session
                </Button>
              </CardHeader>
                <CardContent className="p-6">
                      <ul className="space-y-4">
                        {filteredSessions.length > 0 ? filteredSessions.map((session) => (
                          <li key={session.id} className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold">{session.time}</p>
                              <p className="text-muted-foreground">{session.subject}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(session)}>
                                    <Pencil className="h-4 w-4" />
                                </Button>

                                <Button variant="ghost" size="icon" onClick={() => handleDeleteSession(session.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                          </li>
                        )) : (
                          <p className="text-muted-foreground">No sessions planned for this day.</p>
                        )}
                      </ul>
                </CardContent>
            </Card>
        </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]" onInteractOutside={handleCloseDialog}>
            <DialogHeader>
              <DialogTitle>{editingSession ? "Edit Session" : "Add Session"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" value={sessionDetails.subject} onChange={(e) => handleInputChange('subject', e.target.value)} placeholder="e.g. Math" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input id="time" value={sessionDetails.time} onChange={(e) => handleInputChange('time', e.target.value)} placeholder="e.g. 10:00 AM - 11:00 AM" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCloseDialog} variant="outline">Cancel</Button>
              <Button onClick={handleSaveSession} className="bg-primary hover:bg-primary/90 text-primary-foreground">Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </div>
  )
}
