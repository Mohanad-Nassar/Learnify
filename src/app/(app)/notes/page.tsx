
'use client'

import { useState, useContext, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { SubjectContext } from "@/context/SubjectContext"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const initialNotes = [
  { 
    id: 1, 
    title: "Calculus Notes", 
    content: "Comprehensive notes on calculus, covering limits, derivatives, and integrals.", 
    subject: "Calculus",
    image: "https://placehold.co/300x200",
    imageHint: "mathematics graph"
  },
  { 
    id: 2, 
    title: "Biology Notes", 
    content: "Detailed notes on cell biology, genetics, and evolution.", 
    subject: "Biology",
    image: "https://placehold.co/300x200",
    imageHint: "biology book"
  },
  { 
    id: 3, 
    title: "World War II Notes", 
    content: "Key events, causes, and consequences of World War II.", 
    subject: "World History",
    image: "https://placehold.co/300x200",
    imageHint: "history book"
  },
  { 
    id: 4, 
    title: "Algebra Notes", 
    content: "Notes on linear equations, quadratic equations, and polynomials.", 
    subject: "Calculus", // Changed to show filtering effect
    image: "https://placehold.co/300x200",
    imageHint: "algebra textbook"
  },
   { 
    id: 5, 
    title: "Physics Notes", 
    content: "Notes on mechanics and thermodynamics.", 
    subject: "Physics",
    image: "https://placehold.co/300x200",
    imageHint: "physics experiment"
  },
];


export default function NotesPage() {
  const { subjects } = useContext(SubjectContext);
  const [notes, setNotes] = useState(initialNotes);
  const [activeFilter, setActiveFilter] = useState("All");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newNoteDetails, setNewNoteDetails] = useState({ title: "", content: "", subject: "" });

  const getCategoryForNote = (noteSubject: string) => {
    const subject = subjects.find(s => s.name === noteSubject);
    return subject ? subject.category : "General";
  }

  const categories = useMemo(() => {
    const noteCategories = notes.map(note => getCategoryForNote(note.subject));
    const subjectCategories = subjects.map(s => s.category);
    const allCategories = [...noteCategories, ...subjectCategories];
    const uniqueCategories = Array.from(new Set(allCategories));
    return ["All", ...uniqueCategories];
  }, [notes, subjects]);


  const filteredNotes = useMemo(() => {
    if (activeFilter === "All") {
      return notes;
    }
    return notes.filter(note => getCategoryForNote(note.subject) === activeFilter);
  }, [activeFilter, notes, subjects]);
  
  const handleAddNewNote = () => {
    if (!newNoteDetails.title || !newNoteDetails.content || !newNoteDetails.subject) {
      alert("Please fill out all fields.");
      return;
    }
    const newNote = {
      id: Date.now(),
      ...newNoteDetails,
      image: "https://placehold.co/300x200",
      imageHint: "new note placeholder"
    };
    setNotes([...notes, newNote]);
    setIsDialogOpen(false);
    setNewNoteDetails({ title: "", content: "", subject: "" });
  };


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Note Keeper</h1>
        <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Note
        </Button>
      </div>

      <div>
        <div className="flex items-center space-x-2 border-b">
          {categories.map((category) => (
            <Button
              key={category}
              variant="ghost"
              onClick={() => setActiveFilter(category)}
              className={cn(
                "rounded-none font-semibold",
                activeFilter === category
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground"
              )}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <Card key={note.id} className="overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
              <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="md:col-span-2">
                  <CardContent className="p-6">
                    <p className="text-sm font-semibold text-primary">{getCategoryForNote(note.subject)}</p>
                    <h2 className="text-xl font-bold mt-1 mb-2">{note.title}</h2>
                    <p className="text-muted-foreground">{note.content}</p>
                  </CardContent>
                </div>
                <div className="relative h-40 md:h-full">
                  <Image
                    src={note.image}
                    alt={note.title}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint={note.imageHint}
                  />
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center text-muted-foreground py-10">
            <p>No notes found for this category.</p>
            <p className="text-sm">Try adding some notes or changing the filter.</p>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a new note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="note-title">Note Title</Label>
              <Input
                id="note-title"
                value={newNoteDetails.title}
                onChange={(e) => setNewNoteDetails({ ...newNoteDetails, title: e.target.value })}
                placeholder="e.g. My Awesome Note"
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="note-content">Content</Label>
              <Textarea
                id="note-content"
                value={newNoteDetails.content}
                onChange={(e) => setNewNoteDetails({ ...newNoteDetails, content: e.target.value })}
                placeholder="Start writing your note here..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="note-subject">Subject</Label>
              <Select
                value={newNoteDetails.subject}
                onValueChange={(value) => setNewNoteDetails({ ...newNoteDetails, subject: value })}
              >
                <SelectTrigger id="note-subject">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.name}>{subject.name}</SelectItem>
                  ))}
                   <SelectItem value="General">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddNewNote}>Add Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
