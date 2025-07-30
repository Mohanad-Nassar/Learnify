'use client'

import { useState, useContext } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { SubjectContext } from "@/context/SubjectContext"

const initialNotes = [
  { id: 1, title: "Biology Chapter 5 Summary", content: "Mitochondria is the powerhouse of the cell...", subject: "Biology" },
  { id: 2, title: "History Lecture Notes", content: "The French Revolution began in 1789...", subject: "History" },
  { id: 3, title: "Ideas for English Essay", content: "Explore the theme of identity in 'The Catcher in the Rye'...", subject: "English" },
  { id: 4, title: "Math Formulas", content: "Pythagorean theorem: a² + b² = c²", subject: "Calculus" },
];


export default function NotesPage() {
  const [notes, setNotes] = useState(initialNotes)
  const [selectedNoteId, setSelectedNoteId] = useState(1);
  const selectedNote = notes.find(n => n.id === selectedNoteId) || notes[0];
  const { subjects } = useContext(SubjectContext);

  // Example of how you might use the subjects from context
  const notesForSubject = (subjectName: string) => {
    return notes.filter(note => note.subject === subjectName);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Note Keeper</h1>
        <p className="text-muted-foreground">Your digital notebook for all subjects.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
        <Card className="md:col-span-1 lg:col-span-1 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>My Notes</CardTitle>
            <Button variant="ghost" size="icon">
              <PlusCircle className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-18rem)]">
              <div className="space-y-1 p-2">
              {notes.map(note => (
                <button 
                  key={note.id}
                  onClick={() => setSelectedNoteId(note.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-md hover:bg-muted",
                    selectedNoteId === note.id && "bg-muted"
                  )}
                >
                  <p className="font-semibold truncate">{note.title}</p>
                </button>
              ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <div className="md:col-span-2 lg:col-span-3 h-full">
           <Card className="shadow-md h-full flex flex-col">
              <CardHeader>
                <Input 
                  defaultValue={selectedNote.title} 
                  className="text-2xl font-bold border-0 shadow-none focus-visible:ring-0 p-0 h-auto"
                  placeholder="Note Title"
                />
              </CardHeader>
              <CardContent className="flex-grow">
                <Textarea 
                  defaultValue={selectedNote.content}
                  className="w-full h-full resize-none border-0 shadow-none focus-visible:ring-0 p-0"
                  placeholder="Start writing your notes here..."
                />
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
