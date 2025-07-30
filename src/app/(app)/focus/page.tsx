
'use client'

import { useState, useContext } from "react";
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

export default function FocusPage() {
    const { subjects } = useContext(SubjectContext);
    const [sessionLength, setSessionLength] = useState("25");
    const [breakLength, setBreakLength] = useState("5");

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold">Focus</h1>
      
      <div className="space-y-2">
        <Select>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Subject" />
            </SelectTrigger>
            <SelectContent>
                 {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.name}>{subject.name}</SelectItem>
                  ))}
            </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Session Length</h2>
        <ToggleGroup type="single" value={sessionLength} onValueChange={(value) => { if (value) setSessionLength(value) }} className="w-full grid grid-cols-3">
          <ToggleGroupItem value="25" className="py-3">25 min</ToggleGroupItem>
          <ToggleGroupItem value="45" className="py-3">45 min</ToggleGroupItem>
          <ToggleGroupItem value="60" className="py-3">60 min</ToggleGroupItem>
        </ToggleGroup>
        
        <div className="grid grid-cols-3 gap-4 text-center">
            <div>
                <div className="bg-muted rounded-lg p-6 text-5xl font-mono font-bold">00</div>
                <p className="text-sm text-muted-foreground mt-2">Hours</p>
            </div>
            <div>
                <div className="bg-muted rounded-lg p-6 text-5xl font-mono font-bold">25</div>
                <p className="text-sm text-muted-foreground mt-2">Minutes</p>
            </div>
            <div>
                <div className="bg-muted rounded-lg p-6 text-5xl font-mono font-bold">00</div>
                <p className="text-sm text-muted-foreground mt-2">Seconds</p>
            </div>
        </div>
        
        <div className="flex justify-center gap-4">
            <Button size="lg" className="w-40 bg-black text-white rounded-full">Pause</Button>
            <Button size="lg" variant="secondary" className="w-40 rounded-full">Reset</Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Break Timer</h2>
         <ToggleGroup type="single" value={breakLength} onValueChange={(value) => { if (value) setBreakLength(value) }} className="w-full grid grid-cols-3">
          <ToggleGroupItem value="5" className="py-3">5 min</ToggleGroupItem>
          <ToggleGroupItem value="10" className="py-3">10 min</ToggleGroupItem>
          <ToggleGroupItem value="20" className="py-3">20 min</ToggleGroupItem>
        </ToggleGroup>
         <div className="flex justify-center gap-4">
            <Button size="lg" className="w-40 bg-black text-white rounded-full">Start</Button>
            <Button size="lg" variant="secondary" className="w-40 rounded-full">End</Button>
        </div>
      </div>
      
       <div className="grid grid-cols-1 gap-6 md:grid-cols-3 pt-8">
        <Card className="shadow-sm bg-muted border-none">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Focus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2h 30m</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm bg-muted border-none">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Sessions: 3</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1">
            <p>Math - 1h</p>
            <p>Science - 1h</p>
            <p>History - 30min</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm bg-muted border-none">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Focus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">15h 45m</div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
