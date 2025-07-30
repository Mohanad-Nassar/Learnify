
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
            image: "/notebook-calculus.png",
            imageHint: "mathematics graph",
            chapters: [
                {
                    id: 1, 
                    title: "Chapter 1: Limits", 
                    sections: [
                        {id: 1, title: "Introduction to Limits", content: "# What is a Limit?\n\nA limit in calculus is the value that a function approaches as the input approaches some value. It's a fundamental concept for calculus.\n\n*An intuitive definition* is that a limit is the value that `f(x)` gets closer and closer to as `x` gets closer and closer to some number `c`."},
                        {id: 2, title: "Limit Laws", content: "## Basic Limit Laws\n\nHere are some of the basic laws for limits:\n\n1.  **Sum Law:** The limit of a sum is the sum of the limits.\n2.  **Difference Law:** The limit of a difference is the difference of the limits.\n3. **Constant Multiple Law:** The limit of a constant times a function is the constant times the limit of the function."},
                        {id: 3, title: "One-Sided Limits", content: "### Understanding One-Sided Limits\n\nOne-sided limits are limits taken from either the **left** or the **right** side of a point.\n\n- The limit from the right is denoted `lim x -> c+`\n- The limit from the left is denoted `lim x -> c-`"}
                    ]
                }, 
                {
                    id: 2, 
                    title: "Chapter 2: Derivatives", 
                    sections: [
                        {id: 1, title: "Definition of a Derivative", content: "# The Derivative\n\nThe derivative of a function measures the *instantaneous rate of change* of the function. It can be thought of as the slope of the tangent line to the function's graph at a specific point."},
                        {id: 2, title: "Power Rule", content: "## Power Rule for Differentiation\n\nThe power rule is a shortcut for finding the derivative of a polynomial function `f(x) = x^n`.\n\n- The derivative is `f'(x) = n*x^(n-1)`.\n- This is one of the most commonly used differentiation rules."},
                        {id: 3, title: "Product Rule", content: "### Using the Product Rule\n\nThe product rule is used to find the derivative of a product of two functions.\n\nIf `h(x) = f(x)g(x)`, then the derivative is:\n`h'(x) = f'(x)g(x) + f(x)g'(x)`"}
                    ]
                },
                {
                    id: 3,
                    title: "Chapter 3: Integrals",
                    sections: [
                        {id: 1, title: "Antiderivatives", content: "# Antiderivatives and Indefinite Integrals\n\nAn antiderivative is a function whose derivative is the original function. It's the reverse process of differentiation.\n\n*Key takeaway:* Integration is the inverse operation of differentiation."},
                        {id: 2, title: "The Definite Integral", content: "## The Definite Integral\n\nThe definite integral of a function gives the **area under the curve** between two points.\n\n1. It is denoted as `∫[a, b] f(x) dx`.\n2. `a` and `b` are the limits of integration."},
                        {id: 3, title: "The Fundamental Theorem", content: "### The Fundamental Theorem of Calculus\n\nThis theorem connects differentiation and integration in two parts:\n\n- **Part 1:** Relates the derivative of an integral.\n- **Part 2:** Provides a way to compute definite integrals."}
                    ]
                }
            ]
          },
          { 
            id: 2, 
            title: "Biology Notes", 
            content: "Detailed notes on cell biology, genetics, and evolution.", 
            subject: "Biology",
            image: "/notebook-biology.png",
            imageHint: "biology book",
            chapters: [
                {
                    id: 1, 
                    title: "Chapter 1: The Cell", 
                    sections: [
                        {id: 1, title: "Introduction to Cells", content: "# The Cell\n\nCells are the *basic building blocks* of all living things. They provide structure for the body, take in nutrients from food, and carry out important functions."},
                        {id: 2, title: "Eukaryotic vs. Prokaryotic", content: "## Types of Cells\n\n1.  **Eukaryotic cells:** Contain a nucleus and other membrane-bound organelles.\n2.  **Prokaryotic cells:** Do not have a nucleus or other membrane-bound organelles."},
                        {id: 3, title: "Organelles", content: "### Key Organelles\n\n- **Nucleus:** Contains the cell's genetic material.\n- **Mitochondria:** The powerhouse of the cell.\n- **Ribosomes:** Responsible for protein synthesis."}
                    ]
                }, 
                {
                    id: 2, 
                    title: "Chapter 2: Genetics", 
                    sections: [
                        {id: 1, title: "DNA and RNA", content: "# DNA and RNA\n\n_Deoxyribonucleic acid (DNA)_ and _Ribonucleic acid (RNA)_ are the molecules that carry genetic information."},
                        {id: 2, title: "Mendelian Genetics", content: "## Mendelian Genetics\n\nThis describes the patterns of inheritance of traits from parents to offspring, based on the work of **Gregor Mendel**."},
                        {id: 3, title: "Gene Expression", content: "### What is Gene Expression?\n\nGene expression is the process by which information from a gene is used to synthesize a functional gene product, such as a protein."}
                    ]
                },
                {
                    id: 3,
                    title: "Chapter 3: Evolution",
                    sections: [
                        {id: 1, title: "Natural Selection", content: "# Natural Selection\n\nNatural selection is the process by which organisms better adapted to their environment tend to survive and produce more offspring."},
                        {id: 2, title: "Speciation", content: "## Speciation\n\nSpeciation is the evolutionary process by which populations evolve to become distinct species. Key mechanisms include:\n1. Allopatric speciation\n2. Sympatric speciation"},
                        {id: 3, title: "The Fossil Record", content: "### Evidence from Fossils\n\nThe fossil record provides *crucial evidence* of the history of life on Earth and the evolution of species over millions of years."}
                    ]
                }
            ]
          },
          { 
            id: 3, 
            title: "World War II Notes", 
            content: "Key events, causes, and consequences of World War II.", 
            subject: "World History",
            image: "/notebook-history.png",
            imageHint: "history book",
            chapters: [
                 {
                    id: 1, 
                    title: "Chapter 1: Causes of the War", 
                    sections: [
                        {id: 1, title: "Treaty of Versailles", content: "# Treaty of Versailles\n\nThe Treaty of Versailles, signed in 1919, officially ended World War I. It imposed heavy penalties on Germany, which many historians believe contributed to the outbreak of World War II.\n\n*Key Terms:*\n- Reparations\n- War Guilt Clause"},
                        {id: 2, title: "Rise of Fascism", content: "## The Rise of Fascism\n\nFascism is a political ideology characterized by:\n1. Dictatorial power\n2. Forcible suppression of opposition\n3. Strong regimentation of society and the economy\n\nIt rose to prominence in **Italy** and **Germany** before the war."},
                        {id: 3, title: "Policy of Appeasement", content: "### Appeasement\n\nAppeasement was a policy of making concessions to the dictatorial powers in order to avoid conflict. It was most famously practiced by British Prime Minister *Neville Chamberlain*."}
                    ]
                }, 
                {
                    id: 2, 
                    title: "Chapter 2: Major Theaters of War", 
                    sections: [
                        {id: 1, title: "The European Theater", content: "# European Theater\n\nThis theater included the devastating land campaigns on the Eastern and Western Fronts.\n- **Eastern Front:** Primarily Germany vs. the Soviet Union.\n- **Western Front:** Primarily Germany vs. the Allies (Britain, France, USA)."},
                        {id: 2, title: "The Pacific Theater", content: "## Pacific Theater\n\nThe Pacific War was fought between the Allies and the Empire of Japan. Key events include:\n\n1. Attack on Pearl Harbor (December 7, 1941)\n2. Battle of Midway (June 1942)\n3. Island-hopping campaign"},
                        {id: 3, title: "The North African Campaign", content: "### North Africa\n\nThis campaign was fought for control of the Suez Canal and access to oil from the Middle East. It was a critical front from 1940 to 1943. The *'Desert Fox,'* Erwin Rommel, was a famous German commander here."}
                    ]
                },
                {
                    id: 3,
                    title: "Chapter 3: Consequences",
                    sections: [
                        {id: 1, title: "The Holocaust", content: "# The Holocaust\n\nThe Holocaust was the genocide of European Jews during World War II. Approximately six million Jews were systematically murdered by the Nazi regime and its collaborators. This event is a stark reminder of the *dangers of hatred and intolerance*."},
                        {id: 2, title: "The Cold War", content: "## The Beginning of the Cold War\n\nAfter WWII, geopolitical tension rose between two superpowers:\n- The **United States** (and its allies, the Western Bloc)\n- The **Soviet Union** (and its allies, the Eastern Bloc)\n\nThis period of rivalry, known as the Cold War, lasted until 1991."},
                        {id: 3, title: "The United Nations", content: "### Formation of the UN\n\nThe United Nations (UN) was established on October 24, 1945, to prevent future global conflicts. Its primary mission is to maintain international peace and security. *It replaced the ineffective League of Nations.*"}
                    ]
                }
            ]
          },
          {
            id: 4,
            title: "Physics Notes",
            content: "Notes on mechanics and thermodynamics.",
            subject: "Physics",
            image: "/notebook-physics.png",
            imageHint: "physics experiment",
            chapters: [
              {
                id: 1,
                title: "Chapter 1: Kinematics",
                sections: [
                  { id: 1, title: "Displacement, Velocity, and Acceleration", content: "# Kinematics\n\nThis chapter focuses on describing motion. We'll look at:\n- **Displacement:** Change in position.\n- *Velocity:* Rate of change of displacement.\n- **Acceleration:** Rate of change of velocity." },
                  { id: 2, title: "Kinematic Equations", content: "## The Big Four\n\nFor motion with constant acceleration, we use four main equations:\n1. `v = v₀ + at`\n2. `Δx = v₀t + ½at²`\n3. `v² = v₀² + 2aΔx`\n4. `Δx = ½(v + v₀)t`" },
                  { id: 3, title: "Free Fall", content: "### Free Fall\n\nAn object is in free fall when the only force acting on it is gravity. Near the Earth's surface, the acceleration due to gravity is approximately *g = 9.8 m/s²*." }
                ]
              },
              {
                id: 2,
                title: "Chapter 2: Dynamics",
                sections: [
                  { id: 1, title: "Newton's First Law", content: "# Newton's Laws of Motion\n\n## First Law: Inertia\n\nAn object at rest stays at rest and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force. *Also known as the law of inertia.*" },
                  { id: 2, title: "Newton's Second Law", content: "## Second Law: F = ma\n\nThe acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass. The formula is:\n`F_net = m * a`" },
                  { id: 3, title: "Newton's Third Law", content: "### Third Law: Action-Reaction\n\nFor every action, there is an equal and opposite reaction. If object A exerts a force on object B, then object B exerts a force of equal magnitude and opposite direction on object A. **Forces always come in pairs.**" }
                ]
              },
              {
                id: 3,
                title: "Chapter 3: Energy",
                sections: [
                  { id: 1, title: "Work and Kinetic Energy", content: "# Energy\n\n## Work\n\nIn physics, work is done on an object when a force causes a displacement. `W = F * d * cos(θ)`" },
                  { id: 2, title: "Potential Energy", content: "## Potential Energy (PE)\n\nPotential energy is the energy held by an object because of its position relative to other objects. Key types include:\n- **Gravitational PE:** `PE = mgh`\n- *Elastic PE:* Stored in springs." },
                  { id: 3, title: "Conservation of Energy", content: "### The Law of Conservation of Energy\n\nEnergy cannot be created or destroyed, but only changed from one form to another. The total energy in a closed system remains constant. This is a *fundamental principle* of physics." }
                ]
              }
            ]
          }
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
           {note.image && (
              <Image
                  src={note.image}
                  alt={note.title}
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint={note.imageHint}
              />
            )}
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

    