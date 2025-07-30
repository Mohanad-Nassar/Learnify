
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


  useEffect(() => {
    if (noteId !== null && chapterId !== null) {
      const foundNote = notes.find(n => n.id === noteId);
      if (foundNote) {
        setNote(foundNote);
        const foundChapter = foundNote.chapters.find(c => c.id === chapterId);
        if(foundChapter) {
          setChapter(foundChapter);
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
          <SidebarContent className="p-2">
            <SidebarHeader>
              <div className="p-2 group-data-[collapsible=icon]:hidden">
                <p className="font-semibold text-lg">{note.title}</p>
                <p className="text-sm text-muted-foreground">Chapters</p>
              </div>
            </SidebarHeader>
            <SidebarMenu>
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
    </SidebarProvider>
  );
}
