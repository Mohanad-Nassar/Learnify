
'use client'

import { useState, useContext, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Edit, Pencil } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { SubjectContext } from "@/context/SubjectContext"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"


const initialNotes = [
  { 
    id: 1, 
    title: "Calculus Notes", 
    content: "Comprehensive notes on calculus, covering limits, derivatives, and integrals.", 
    subject: "Calculus",
    image: "https://placehold.co/300x200",
    imageHint: "mathematics graph",
    chapters: [{id: 1, title: "Chapter 1: Limits"}, {id: 2, title: "Chapter 2: Derivatives"}]
  },
  { 
    id: 2, 
    title: "Biology Notes", 
    content: "Detailed notes on cell biology, genetics, and evolution.", 
    subject: "Biology",
    image: "https://placehold.co/300x201",
    imageHint: "biology book",
    chapters: []
  },
  { 
    id: 3, 
    title: "World War II Notes", 
    content: "Key events, causes, and consequences of World War II.", 
    subject: "World History",
    image: "https://placehold.co/301x200",
    imageHint: "history book",
    chapters: []
  },
  { 
    id: 4, 
    title: "Algebra Notes", 
    content: "Notes on linear equations, quadratic equations, and polynomials.", 
    subject: "Calculus", // Changed to show filtering effect
    image: "https://placehold.co/300x202",
    imageHint: "algebra textbook",
    chapters: []
  },
   { 
    id: 5, 
    title: "Physics Notes", 
    content: "Notes on mechanics and thermodynamics.", 
    subject: "Physics",
    image: "https://placehold.co/302x200",
    imageHint: "physics experiment",
    chapters: []
  },
];

const placeholderImages = [
  "https://placehold.co/300x200",
  "https://placehold.co/300x201",
  "https://placehold.co/301x200",
  "https://placehold.co/300x202",
  "https://placehold.co/302x200",
  "https://placehold.co/301x201",
];


export default function NotesPage() {
  const { subjects } = useContext(SubjectContext);
  const [notes, setNotes] = useState(initialNotes);
  const [activeFilter, setActiveFilter] = useState("All");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<typeof initialNotes[0] | null>(null);
  const [newNoteDetails, setNewNoteDetails] = useState({ title: "", content: "", subject: "" });

  const getCategoryForNote = (noteSubject: string) => {
    const subject = subjects.find(s => s.name === noteSubject);
    return subject ? subject.category : "General";
  }

  const categories = useMemo(() => {
    const userCategories = Array.from(new Set(subjects.map(s => s.category)));
    const notesWithNoCategory = notes.some(note => !subjects.some(s => s.name === note.subject));

    let finalCategories = ["All", ...userCategories];
    if (notesWithNoCategory) {
      finalCategories.push("General");
    }
    return finalCategories;
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
      imageHint: "new note placeholder",
      chapters: []
    };
    setNotes([...notes, newNote]);
    setIsAddDialogOpen(false);
    setNewNoteDetails({ title: "", content: "", subject: "" });
  };
  
  const handleOpenEditDialog = (e: React.MouseEvent, note: typeof initialNotes[0]) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingNote(note);
    setIsEditDialogOpen(true);
  };
  
  const handleSaveNote = () => {
    if (!editingNote) return;
    setNotes(notes.map(n => n.id === editingNote.id ? editingNote : n));
    setIsEditDialogOpen(false);
    setEditingNote(null);
  }
  
  const handleChangeImage = () => {
    if (!editingNote) return;
    const currentImageIndex = placeholderImages.indexOf(editingNote.image);
    const nextImageIndex = (currentImageIndex + 1) % placeholderImages.length;
    setEditingNote({ ...editingNote, image: placeholderImages[nextImageIndex] });
  }

  return (
    <div className="space-y-8">
       <Breadcrumb>
        <BreadcrumbList>
            <BreadcrumbItem>
            <BreadcrumbLink asChild>
                <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
            <BreadcrumbPage>Notes</BreadcrumbPage>
            </BreadcrumbItem>
        </BreadcrumbList>
        </Breadcrumb>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Note Keeper</h1>
        <Button variant="outline" onClick={() => setIsAddDialogOpen(true)}>
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
             <Link href={`/notes/${note.id}`} key={note.id} className="block group/note">
                <Card className="overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
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
                      <Button 
                        variant="secondary"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover/note:opacity-100 transition-opacity z-10"
                        onClick={(e) => handleOpenEditDialog(e, note)}
                      >
                        <Pencil className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </Card>
            </Link>
          ))
        ) : (
          <div className="text-center text-muted-foreground py-10">
            <p>No notes found for this category.</p>
            <p className="text-sm">Try adding some notes or changing the filter.</p>
          </div>
        )}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddNewNote}>Add Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
          </DialogHeader>
          {editingNote && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-note-title">Note Title</Label>
                <Input
                  id="edit-note-title"
                  value={editingNote.title}
                  onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-note-content">Content</Label>
                <Textarea
                  id="edit-note-content"
                  value={editingNote.content}
                  onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                />
              </div>
              <div className="space-y-2">
              <Label htmlFor="edit-note-subject">Subject</Label>
              <Select
                value={editingNote.subject}
                onValueChange={(value) => setEditingNote({ ...editingNote, subject: value })}
              >
                <SelectTrigger id="edit-note-subject">
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
              <div className="space-y-2">
                <Label>Image</Label>
                <div className="flex items-center gap-4">
                    <Image src={editingNote.image} alt="Note image" width={100} height={66} className="rounded-md" />
                    <Button variant="outline" onClick={handleChangeImage}>Change Image</Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveNote}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
