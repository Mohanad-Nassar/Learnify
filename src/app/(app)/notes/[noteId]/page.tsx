
'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// This is a temporary solution for passing data between pages.
// In a real app, you would fetch this from a server or use a global state manager.
let noteDataStore: any = null;

const initialNotes = [
  { 
    id: 1, 
    title: "Calculus Notes", 
    content: "Comprehensive notes on calculus, covering limits, derivatives, and integrals.", 
    subject: "Calculus",
    image: "https://placehold.co/300x200",
    imageHint: "mathematics graph",
    chapters: [{id: 1, title: "Chapter 1: Limits", content: "Markdown content for limits..."}, {id: 2, title: "Chapter 2: Derivatives", content: "Markdown content for derivatives..."}]
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


type Chapter = {
  id: number;
  title: string;
  content: string;
};

type Note = typeof initialNotes[0];

export default function NoteDetailPage() {
  const router = useRouter();
  const params = useParams();
  const noteId = params.noteId ? parseInt(params.noteId as string, 10) : null;
  
  const [note, setNote] = useState<Note | null>(null);
  const [isChapterDialogOpen, setIsChapterDialogOpen] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState("");

  useEffect(() => {
    if (noteId !== null) {
      const foundNote = initialNotes.find(n => n.id === noteId);
      setNote(foundNote || null);
    }
  }, [noteId]);
  
  const handleAddChapter = () => {
    if (!newChapterTitle.trim() || !note) return;
    const newChapter = {
      id: note.chapters.length > 0 ? Math.max(...note.chapters.map(c => c.id)) + 1 : 1,
      title: newChapterTitle,
      content: `# ${newChapterTitle}\n\nStart writing here...`,
    };
    const updatedNote = { ...note, chapters: [...note.chapters, newChapter] };
    setNote(updatedNote);
    // Here you would also update the global state or send it to the server
    setIsChapterDialogOpen(false);
    setNewChapterTitle("");
  }

  const handleDeleteChapter = (chapterId: number) => {
    if(!note) return;
    const updatedChapters = note.chapters.filter(c => c.id !== chapterId);
    setNote({...note, chapters: updatedChapters});
  }

  if (!note) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-muted-foreground">Note not found.</p>
            <Button variant="link" asChild><Link href="/notes">Go back to notes</Link></Button>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Notes
        </Button>
        <div className="relative w-full h-64 rounded-lg overflow-hidden mb-6">
            <Image
                src={note.image}
                alt={note.title}
                layout="fill"
                objectFit="cover"
                data-ai-hint={note.imageHint}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <h1 className="absolute bottom-6 left-6 text-4xl font-bold text-white font-headline">{note.title}</h1>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Chapters</CardTitle>
          <Button onClick={() => setIsChapterDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Chapter
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {note.chapters.length > 0 ? (
            note.chapters.map((chapter) => (
              <div key={chapter.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg group">
                <Link href={`/notes/${noteId}/${chapter.id}`} className="font-medium hover:underline flex-grow">
                    {chapter.title}
                </Link>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteChapter(chapter.id)} className="opacity-0 group-hover:opacity-100">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-4">This notebook has no chapters yet.</p>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isChapterDialogOpen} onOpenChange={setIsChapterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a new chapter</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="chapter-title">Chapter Title</Label>
              <Input
                id="chapter-title"
                value={newChapterTitle}
                onChange={(e) => setNewChapterTitle(e.target.value)}
                placeholder="e.g. Introduction to Derivatives"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsChapterDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddChapter}>Add Chapter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
