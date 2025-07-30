
'use client'

import { useState, useEffect, useContext, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SubjectContext } from "@/context/SubjectContext";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Play, Pause, RotateCcw } from 'lucide-react';

// Helper to safely get numbers from localStorage
const getStoredNumber = (key: string, defaultValue: number): number => {
    if (typeof window === 'undefined') return defaultValue;
    const storedValue = localStorage.getItem(key);
    return storedValue ? parseInt(storedValue, 10) : defaultValue;
};

// Helper to format time from seconds to Hh Mm format
const formatTotalTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
}

export default function FocusPage() {
    const { subjects } = useContext(SubjectContext);
    const [sessionLength, setSessionLength] = useState(25); // in minutes
    const [breakLength, setBreakLength] = useState(5); // in minutes

    const [timerMode, setTimerMode] = useState<'session' | 'break'>('session');
    const [timeRemaining, setTimeRemaining] = useState(sessionLength * 60);
    const [isActive, setIsActive] = useState(false);
    
    // Stats State
    const [sessionsCompleted, setSessionsCompleted] = useState(0);
    const [todaysFocusTime, setTodaysFocusTime] = useState(0); // in seconds
    const [totalFocusTime, setTotalFocusTime] = useState(0); // in seconds
    const [lastResetDate, setLastResetDate] = useState<string | null>(null);

    
    const alarmAudioRef = useRef<HTMLAudioElement>(null);

    // Load stats from localStorage on initial render
    useEffect(() => {
        setSessionsCompleted(getStoredNumber('focus-sessionsCompleted', 0));
        setTotalFocusTime(getStoredNumber('focus-totalFocusTime', 0));
        const storedLastResetDate = localStorage.getItem('focus-lastResetDate');
        const today = new Date().toISOString().split('T')[0];

        if (storedLastResetDate === today) {
            setTodaysFocusTime(getStoredNumber('focus-todaysFocusTime', 0));
        } else {
            // It's a new day, reset today's stats
            localStorage.setItem('focus-todaysFocusTime', '0');
            setTodaysFocusTime(0);
            localStorage.setItem('focus-lastResetDate', today);
            setLastResetDate(today);
        }
    }, []);

    useEffect(() => {
        if (!isActive) {
            setTimeRemaining((timerMode === 'session' ? sessionLength : breakLength) * 60);
        }
    }, [sessionLength, breakLength, timerMode, isActive]);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isActive && timeRemaining > 0) {
            interval = setInterval(() => {
                setTimeRemaining(time => time - 1);
            }, 1000);
        } else if (isActive && timeRemaining === 0) {
             if (alarmAudioRef.current) {
                alarmAudioRef.current.play();
            }
            setIsActive(false);

            if (timerMode === 'session') {
                // A focus session was completed
                const newSessionsCompleted = sessionsCompleted + 1;
                const newTodaysFocusTime = todaysFocusTime + sessionLength * 60;
                const newTotalFocusTime = totalFocusTime + sessionLength * 60;
                
                setSessionsCompleted(newSessionsCompleted);
                setTodaysFocusTime(newTodaysFocusTime);
                setTotalFocusTime(newTotalFocusTime);
                
                // Persist to localStorage
                localStorage.setItem('focus-sessionsCompleted', String(newSessionsCompleted));
                localStorage.setItem('focus-todaysFocusTime', String(newTodaysFocusTime));
                localStorage.setItem('focus-totalFocusTime', String(newTotalFocusTime));

                // Switch to break
                setTimerMode('break');
                setTimeRemaining(breakLength * 60);
            } else {
                 // A break was completed, switch back to session
                setTimerMode('session');
                setTimeRemaining(sessionLength * 60);
            }
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeRemaining, timerMode, sessionLength, breakLength, sessionsCompleted, todaysFocusTime, totalFocusTime]);

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setTimeRemaining((timerMode === 'session' ? sessionLength : breakLength) * 60);
    };
    
    const handleSessionLengthChange = (value: string) => {
        if (value && !isActive) {
            const newLength = parseInt(value, 10);
            setSessionLength(newLength);
            if (timerMode === 'session') {
                setTimeRemaining(newLength * 60);
            }
        }
    };
    
    const handleBreakLengthChange = (value: string) => {
        if (value && !isActive) {
            const newLength = parseInt(value, 10);
            setBreakLength(newLength);
            if (timerMode === 'break') {
                setTimeRemaining(newLength * 60);
            }
        }
    };
    
    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return {
            hours: String(hours).padStart(2, '0'),
            minutes: String(minutes).padStart(2, '0'),
            seconds: String(secs).padStart(2, '0')
        };
    };

    const { hours, minutes, seconds } = formatTime(timeRemaining);


  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold text-center">Focus Session</h1>
      <p className="text-muted-foreground text-center">Select a subject and customize your timer to get started.</p>
      
      <div className="space-y-2">
        <Select>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Subject (Optional)" />
            </SelectTrigger>
            <SelectContent>
                 {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.name}>{subject.name}</SelectItem>
                  ))}
            </SelectContent>
        </Select>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="text-center">
            <ToggleGroup type="single" value={timerMode} onValueChange={(mode) => {if(mode && !isActive) setTimerMode(mode as 'session' | 'break')}} className="w-full max-w-xs mx-auto">
                <ToggleGroupItem value="session" className="w-full">Focus</ToggleGroupItem>
                <ToggleGroupItem value="break" className="w-full">Break</ToggleGroupItem>
            </ToggleGroup>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                    <div className="bg-muted rounded-lg p-6 text-5xl font-mono font-bold">{hours}</div>
                    <p className="text-sm text-muted-foreground mt-2">Hours</p>
                </div>
                <div>
                    <div className="bg-muted rounded-lg p-6 text-5xl font-mono font-bold">{minutes}</div>
                    <p className="text-sm text-muted-foreground mt-2">Minutes</p>
                </div>
                <div>
                    <div className="bg-muted rounded-lg p-6 text-5xl font-mono font-bold">{seconds}</div>
                    <p className="text-sm text-muted-foreground mt-2">Seconds</p>
                </div>
            </div>
            
            <div className="flex justify-center gap-4">
                <Button size="lg" className="w-40 rounded-full" onClick={toggleTimer}>
                    {isActive ? <Pause className="mr-2"/> : <Play className="mr-2" />}
                    {isActive ? 'Pause' : 'Start'}
                </Button>
                <Button size="lg" variant="secondary" className="w-40 rounded-full" onClick={resetTimer}>
                    <RotateCcw className="mr-2" /> Reset
                </Button>
            </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
            <h2 className="text-lg font-semibold text-center">Session Length</h2>
            <ToggleGroup type="single" defaultValue={String(sessionLength)} onValueChange={handleSessionLengthChange} className="w-full grid grid-cols-3">
            <ToggleGroupItem value="25" className="py-3">25 min</ToggleGroupItem>
            <ToggleGroupItem value="45" className="py-3">45 min</ToggleGroupItem>
            <ToggleGroupItem value="60" className="py-3">60 min</ToggleGroupItem>
            </ToggleGroup>
        </div>
        <div className="space-y-3">
            <h2 className="text-lg font-semibold text-center">Break Length</h2>
            <ToggleGroup type="single" defaultValue={String(breakLength)} onValueChange={handleBreakLengthChange} className="w-full grid grid-cols-3">
            <ToggleGroupItem value="5" className="py-3">5 min</ToggleGroupItem>
            <ToggleGroupItem value="10" className="py-3">10 min</ToggleGroupItem>
            <ToggleGroupItem value="20" className="py-3">20 min</ToggleGroupItem>
            </ToggleGroup>
        </div>
      </div>
      
       <div className="grid grid-cols-1 gap-6 md:grid-cols-3 pt-8">
        <Card className="shadow-sm bg-muted border-none text-center">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Focus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatTotalTime(todaysFocusTime)}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm bg-muted border-none text-center">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Sessions Completed</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-3xl font-bold">{sessionsCompleted}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm bg-muted border-none text-center">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Focus Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatTotalTime(totalFocusTime)}</div>
          </CardContent>
        </Card>
      </div>
      <audio ref={alarmAudioRef} src="/alarm.mp3" preload="auto" />
    </div>
  );
}
