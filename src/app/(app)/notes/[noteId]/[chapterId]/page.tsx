
'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Book, Menu } from 'lucide-react';
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
import { Card } from '@/components/ui/card';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Separator } from '@/components/ui/separator';

// Temporary data store, same as in notes/page.tsx and notes/[noteId]/page.tsx
const initialNotes = [
  { 
    id: 1, 
    title: "Calculus Notes", 
    content: "Comprehensive notes on calculus, covering limits, derivatives, and integrals.", 
    subject: "Calculus",
    image: "https://placehold.co/300x200",
    imageHint: "mathematics graph",
    chapters: [
        {id: 1, title: "Chapter 1: Limits", content: "# Chapter 1: Limits\n\nThis chapter is about limits. Here's a table:\n\n| Syntax | Description |\n| ----------- | ----------- |\n| Header | Title |\n| Paragraph | Text |\n\nAnd a list:\n\n- First item\n- Second item\n- Third item"}, 
        {id: 2, title: "Chapter 2: Derivatives", content: "# Chapter 2: Derivatives\n\nThis chapter is about derivatives."}
    ]
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
    subject: "Calculus",
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

export default function ChapterPage() {
  const params = useParams();
  const pathname = usePathname();

  const noteId = params.noteId ? parseInt(params.noteId as string, 10) : null;
  const chapterId = params.chapterId ? parseInt(params.chapterId as string, 10) : null;

  const [note, setNote] = useState<Note | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [chapterContent, setChapterContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    if (noteId !== null && chapterId !== null) {
      const foundNote = initialNotes.find(n => n.id === noteId);
      if (foundNote) {
        setNote(foundNote);
        const foundChapter = foundNote.chapters.find(c => c.id === chapterId);
        if(foundChapter) {
          setChapter(foundChapter);
          setChapterContent(foundChapter.content);
        }
      }
    }
  }, [noteId, chapterId]);

  if (!note || !chapter) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-muted-foreground">Chapter not found.</p>
            <Button variant="link" asChild><Link href={`/notes/${noteId}`}>Go back to notebook</Link></Button>
        </div>
    );
  }

  const handleSave = () => {
    // In a real app, this would save to a database.
    console.log("Saved content:", chapterContent);
    setIsEditing(false);
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
            <Card className="h-[calc(100vh-10rem)] flex flex-col">
              <div className="p-4 border-b flex items-center justify-between">
                  <h1 className="text-2xl font-bold">{chapter.title}</h1>
                  {isEditing ? (
                    <Button onClick={handleSave}>Save Changes</Button>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>Edit</Button>
                  )}
              </div>
              <div className="flex-1 overflow-auto">
                {isEditing ? (
                   <Textarea
                        value={chapterContent}
                        onChange={(e) => setChapterContent(e.target.value)}
                        className="w-full h-full border-0 resize-none focus-visible:ring-0 p-6 text-base"
                        placeholder="Start writing your notes using Markdown..."
                    />
                ) : (
                  <div className="prose prose-lg dark:prose-invert max-w-none p-8" onClick={() => setIsEditing(true)}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {chapterContent}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </Card>
        </SidebarInset>
    </SidebarProvider>
  );
}

