
'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Edit } from 'lucide-react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// This is a temporary data store. In a real app, this would come from a database.
// To ensure data consistency across pages, we'll use a mock singleton pattern.
const getInitialNotes = () => {
    if (typeof window !== 'undefined' && !(window as any).__initialNotes) {
        (window as any).__initialNotes = [
          { 
            id: 1, 
            title: "Calculus Notes", 
            content: "Comprehensive notes on calculus, covering limits, derivatives, and integrals.", 
            subject: "Calculus",
            image: "https://placehold.co/300x200",
            imageHint: "mathematics graph",
            chapters: [
                {
                    id: 1, 
                    title: "Chapter 1: Limits", 
                    sections: [
                        {id: 1, title: "Introduction to Limits", content: "### What is a Limit?\n\nA limit in calculus is the value that a function approaches as the input approaches some value."},
                        {id: 2, title: "Limit Laws", content: "#### Basic Limit Laws\n\n1.  **Sum Law:** The limit of a sum is the sum of the limits.\n2.  **Difference Law:** The limit of a difference is the difference of the limits."},
                        {id: 3, title: "One-Sided Limits", content: "One-sided limits are limits taken from either the left or the right side of a point."}
                    ]
                }, 
                {
                    id: 2, 
                    title: "Chapter 2: Derivatives", 
                    sections: [
                        {id: 1, title: "Definition of a Derivative", content: "The derivative of a function measures the instantaneous rate of change of the function."},
                        {id: 2, title: "Power Rule", content: "The power rule is a shortcut for finding the derivative of a polynomial."},
                        {id: 3, title: "Product Rule", content: "The product rule is used to find the derivative of a product of two functions."}
                    ]
                },
                {
                    id: 3,
                    title: "Chapter 3: Integrals",
                    sections: [
                        {id: 1, title: "Antiderivatives", content: "An antiderivative is a function whose derivative is the original function."},
                        {id: 2, title: "The Definite Integral", content: "The definite integral of a function gives the area under the curve."},
                        {id: 3, title: "The Fundamental Theorem", content: "The Fundamental Theorem of Calculus connects differentiation and integration."}
                    ]
                }
            ]
          },
          { 
            id: 2, 
            title: "Biology Notes", 
            content: "Detailed notes on cell biology, genetics, and evolution.", 
            subject: "Biology",
            image: "https://placehold.co/300x201",
            imageHint: "biology book",
            chapters: [
                {
                    id: 1, 
                    title: "Chapter 1: The Cell", 
                    sections: [
                        {id: 1, title: "Introduction to Cells", content: "Cells are the basic building blocks of all living things."},
                        {id: 2, title: "Eukaryotic vs. Prokaryotic", content: "Eukaryotic cells have a nucleus, while prokaryotic cells do not."},
                        {id: 3, title: "Organelles", content: "Organelles are specialized structures within a cell that perform specific functions."}
                    ]
                }, 
                {
                    id: 2, 
                    title: "Chapter 2: Genetics", 
                    sections: [
                        {id: 1, title: "DNA and RNA", content: "DNA and RNA are the molecules that carry genetic information."},
                        {id: 2, title: "Mendelian Genetics", content: "Mendelian genetics describes the patterns of inheritance of traits."},
                        {id: 3, title: "Gene Expression", content: "Gene expression is the process by which information from a gene is used to synthesize a functional gene product."}
                    ]
                },
                {
                    id: 3,
                    title: "Chapter 3: Evolution",
                    sections: [
                        {id: 1, title: "Natural Selection", content: "Natural selection is the process by which organisms better adapted to their environment tend to survive and produce more offspring."},
                        {id: 2, title: "Speciation", content: "Speciation is the evolutionary process by which populations evolve to become distinct species."},
                        {id: 3, title: "The Fossil Record", content: "The fossil record provides evidence of the history of life on Earth."}
                    ]
                }
            ]
          },
          // ... other notes
        ];
    }
    return (typeof window !== 'undefined' && (window as any).__initialNotes) || [];
};

type Section = {
  id: number;
  title: string;
  content: string;
}

type Chapter = {
  id: number;
  title: string;
  sections: Section[];
};

type Note = {
  id: number;
  title: string;
  image: string;
  imageHint: string;
  chapters: Chapter[];
};


export default function NoteDetailPage() {
  const router = useRouter();
  const params = useParams();
  const noteId = params.noteId ? parseInt(params.noteId as string, 10) : null;
  
  const [notes, setNotes] = useState<any[]>(getInitialNotes());
  const [note, setNote] = useState<Note | null>(null);
  
  const [isChapterDialogOpen, setIsChapterDialogOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [chapterTitle, setChapterTitle] = useState("");

  useEffect(() => {
    if (noteId !== null) {
      const foundNote = notes.find(n => n.id === noteId);
      setNote(foundNote || null);
    }
  }, [noteId, notes]);

  const updateNoteData = (updatedNote: Note) => {
     const newNotes = notes.map(n => n.id === updatedNote.id ? updatedNote : n);
     setNotes(newNotes);
     (window as any).__initialNotes = newNotes; // Update global mock store
  };
  
  const handleOpenChapterDialog = (chapter: Chapter | null) => {
    setEditingChapter(chapter);
    setChapterTitle(chapter ? chapter.title : "");
    setIsChapterDialogOpen(true);
  };
  
  const handleCloseChapterDialog = () => {
      setEditingChapter(null);
      setChapterTitle("");
      setIsChapterDialogOpen(false);
  }

  const handleSaveChapter = () => {
    if (!chapterTitle.trim() || !note) return;

    let updatedChapters;
    if (editingChapter) {
        // Editing existing chapter
        updatedChapters = note.chapters.map(c => 
            c.id === editingChapter.id ? { ...c, title: chapterTitle } : c
        );
    } else {
        // Adding new chapter
        const newChapter: Chapter = {
          id: note.chapters.length > 0 ? Math.max(...note.chapters.map(c => c.id)) + 1 : 1,
          title: chapterTitle,
          sections: [],
        };
        updatedChapters = [...note.chapters, newChapter];
    }

    const updatedNote = { ...note, chapters: updatedChapters };
    updateNoteData(updatedNote);
    handleCloseChapterDialog();
  }

  const handleDeleteChapter = (chapterId: number) => {
    if(!note) return;
    const updatedChapters = note.chapters.filter(c => c.id !== chapterId);
    const updatedNote = { ...note, chapters: updatedChapters };
    updateNoteData(updatedNote);
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
    <div className="space-y-6">
       <Breadcrumb>
        <BreadcrumbList>
            <BreadcrumbItem>
            <BreadcrumbLink asChild>
                <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
             <BreadcrumbLink asChild>
                <Link href="/notes">Notes</Link>
             </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
            <BreadcrumbPage>{note.title}</BreadcrumbPage>
            </BreadcrumbItem>
        </BreadcrumbList>
        </Breadcrumb>
      <div>
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
          <Button onClick={() => handleOpenChapterDialog(null)}>
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
                <div className="opacity-0 group-hover:opacity-100 flex items-center">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenChapterDialog(chapter)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteChapter(chapter.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
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
            <DialogTitle>{editingChapter ? 'Edit Chapter' : 'Add a new chapter'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="chapter-title">Chapter Title</Label>
              <Input
                id="chapter-title"
                value={chapterTitle}
                onChange={(e) => setChapterTitle(e.target.value)}
                placeholder="e.g. Introduction to Derivatives"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseChapterDialog}>Cancel</Button>
            <Button onClick={handleSaveChapter}>Save Chapter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
