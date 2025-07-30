
'use client'

import { useState, useEffect } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Book, Menu, Plus, Trash2, Edit } from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import { Card, CardContent } from '@/components/ui/card';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Separator } from '@/components/ui/separator';

// This is a temporary data store. In a real app, this would come from a database.
// To ensure data consistency across pages, we'll use a mock singleton pattern.
const getInitialNotes = () => {
    if (typeof window !== 'undefined' && !(window as any).__initialNotes) {
        (window as any).__initialNotes = [
          { 
            id: 1, 
            title: "Calculus Notes", 
            subject: "Calculus",
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
            subject: "Physics",
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
  chapters: Chapter[];
};


export default function ChapterPage() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();

  const noteId = params.noteId ? parseInt(params.noteId as string, 10) : null;
  const chapterId = params.chapterId ? parseInt(params.chapterId as string, 10) : null;
  
  // States for data
  const [notes, setNotes] = useState<Note[]>(getInitialNotes());
  const [note, setNote] = useState<Note | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);

  // States for UI/Dialogs
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [isSectionDialogOpen, setIsSectionDialogOpen] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newSectionContent, setNewSectionContent] = useState("");
  const [isChapterDialogOpen, setIsChapterDialogOpen] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState("");


  useEffect(() => {
    if (noteId !== null) {
      const foundNote = notes.find(n => n.id === noteId);
      if (foundNote) {
        setNote(foundNote);
        if (chapterId !== null) {
          const foundChapter = foundNote.chapters.find(c => c.id === chapterId);
          if(foundChapter) {
            setChapter(foundChapter);
          }
        }
      }
    }
  }, [noteId, chapterId, notes]);

  const updateNoteData = (updatedNote: Note) => {
     const newNotes = notes.map(n => n.id === updatedNote.id ? updatedNote : n);
     setNotes(newNotes);
     (window as any).__initialNotes = newNotes; // Update global mock store
  };

  const handleOpenSectionDialog = (section: Section | null) => {
    setEditingSection(section);
    setNewSectionTitle(section ? section.title : "");
    setNewSectionContent(section ? section.content : "");
    setIsSectionDialogOpen(true);
  };
  
  const handleCloseSectionDialog = () => {
    setEditingSection(null);
    setNewSectionTitle("");
    setNewSectionContent("");
    setIsSectionDialogOpen(false);
  }

  const handleSaveSection = () => {
    if (!newSectionTitle || !note || !chapter) return;

    let updatedSections;
    if (editingSection) {
      // Editing existing section
      updatedSections = chapter.sections.map(sec => 
        sec.id === editingSection.id ? { ...sec, title: newSectionTitle, content: newSectionContent } : sec
      );
    } else {
      // Adding new section
      const newSection: Section = {
        id: chapter.sections.length > 0 ? Math.max(...chapter.sections.map(c => c.id)) + 1 : 1,
        title: newSectionTitle,
        content: newSectionContent,
      };
      updatedSections = [...chapter.sections, newSection];
    }
    
    const updatedChapter = { ...chapter, sections: updatedSections };
    const updatedNote = { ...note, chapters: note.chapters.map(c => c.id === chapterId ? updatedChapter : c)};
    updateNoteData(updatedNote);
    
    handleCloseSectionDialog();
  };
  
  const handleDeleteSection = (sectionId: number) => {
    if(!note || !chapter) return;
    const updatedSections = chapter.sections.filter(sec => sec.id !== sectionId);
    const updatedChapter = { ...chapter, sections: updatedSections };
    const updatedNote = { ...note, chapters: note.chapters.map(c => c.id === chapterId ? updatedChapter : c)};
    updateNoteData(updatedNote);
  }
  
  const handleSaveChapter = () => {
    if (!newChapterTitle.trim() || !note) return;

    const newChapter: Chapter = {
      id: note.chapters.length > 0 ? Math.max(...note.chapters.map(c => c.id)) + 1 : 1,
      title: newChapterTitle,
      sections: [],
    };
    
    const updatedNote = { ...note, chapters: [...note.chapters, newChapter] };
    updateNoteData(updatedNote);
    
    setNewChapterTitle("");
    setIsChapterDialogOpen(false);
    
    // Navigate to the new chapter
    router.push(`/notes/${note.id}/${newChapter.id}`);
  }

  if (!note || !chapter) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-muted-foreground">Chapter not found.</p>
            <Button variant="link" asChild><Link href={`/notes/${noteId}`}>Go back to notebook</Link></Button>
        </div>
    );
  }

  return (
    <SidebarProvider>
        <Sidebar collapsible="icon" className="h-screen sticky top-0">
          <SidebarContent className="p-2 flex flex-col">
            <SidebarHeader>
              <div className="p-2 group-data-[collapsible=icon]:hidden">
                <p className="font-semibold text-lg">{note.title}</p>
                <p className="text-sm text-muted-foreground">Chapters</p>
              </div>
            </SidebarHeader>
            <SidebarMenu className="flex-1">
              {note.chapters.map((chap) => (
                <SidebarMenuItem key={chap.id}>
                    <Link href={`/notes/${note.id}/${chap.id}`} className="w-full">
                        <SidebarMenuButton tooltip={chap.title} isActive={pathname === `/notes/${note.id}/${chap.id}`}>
                            <Book />
                            <span>{chap.title}</span>
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
             <div className="p-2 mt-auto">
                <Button variant="outline" className="w-full group-data-[collapsible=icon]:hidden" onClick={() => setIsChapterDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Chapter
                </Button>
                 <Button variant="outline" size="icon" className="hidden group-data-[collapsible=icon]:block" onClick={() => setIsChapterDialogOpen(true)}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="p-4">
            <div className="flex items-center gap-4 mb-4">
                <SidebarTrigger className="md:hidden" />
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
                         <BreadcrumbLink asChild>
                            <Link href={`/notes/${noteId}`}>{note.title}</Link>
                         </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                        <BreadcrumbPage>{chapter.title}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">{chapter.title}</h1>
                    <Button onClick={() => handleOpenSectionDialog(null)}>
                        <Plus className="mr-2 h-4 w-4" /> Add Section
                    </Button>
                </div>
                
                {chapter.sections.length > 0 ? (
                    chapter.sections.map(section => (
                        <Card key={section.id} className="shadow-md">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold">{section.title}</h2>
                                    <div className="flex items-center space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleOpenSectionDialog(section)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDeleteSection(section.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="prose prose-lg dark:prose-invert max-w-none">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {section.content || 'No content yet.'}
                                    </ReactMarkdown>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <p className="text-center text-muted-foreground py-10">This chapter has no sections yet.</p>
                )}
            </div>

        </SidebarInset>

        <Dialog open={isSectionDialogOpen} onOpenChange={setIsSectionDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{editingSection ? 'Edit Section' : 'Add New Section'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="section-title">Section Title</Label>
                        <Input
                            id="section-title"
                            value={newSectionTitle}
                            onChange={(e) => setNewSectionTitle(e.target.value)}
                            placeholder="e.g., Introduction to Limits"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="section-content">Content (Markdown)</Label>
                        <Textarea
                            id="section-content"
                            value={newSectionContent}
                            onChange={(e) => setNewSectionContent(e.target.value)}
                            placeholder="Write your section content here..."
                            rows={10}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={handleCloseSectionDialog}>Cancel</Button>
                    <Button onClick={handleSaveSection}>Save Section</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

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
                    <Button onClick={handleSaveChapter}>Add Chapter</Button>
                </DialogFooter>
            </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
