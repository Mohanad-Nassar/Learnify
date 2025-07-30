
'use client'

import { useState, useContext, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { SubjectContext } from "@/context/SubjectContext"

const initialNotes = [
  { 
    id: 1, 
    title: "Calculus Notes", 
    content: "Comprehensive notes on calculus, covering limits, derivatives, and integrals.", 
    subject: "Math",
    image: "https://placehold.co/300x200",
    imageHint: "mathematics graph"
  },
  { 
    id: 2, 
    title: "Biology Notes", 
    content: "Detailed notes on cell biology, genetics, and evolution.", 
    subject: "Science",
    image: "https://placehold.co/300x200",
    imageHint: "biology book"
  },
  { 
    id: 3, 
    title: "World War II Notes", 
    content: "Key events, causes, and consequences of World War II.", 
    subject: "History",
    image: "https://placehold.co/300x200",
    imageHint: "history book"
  },
  { 
    id: 4, 
    title: "Algebra Notes", 
    content: "Notes on linear equations, quadratic equations, and polynomials.", 
    subject: "Math",
    image: "https://placehold.co/300x200",
    imageHint: "algebra textbook"
  },
];


export default function NotesPage() {
  const { subjects } = useContext(SubjectContext);
  const [activeFilter, setActiveFilter] = useState("All");

  const categories = useMemo(() => {
    const allCategories = subjects.map(s => s.category);
    return ["All", ...Array.from(new Set(allCategories))];
  }, [subjects]);

  const filteredNotes = useMemo(() => {
    if (activeFilter === "All") {
      return initialNotes;
    }
    const subjectNames = subjects.filter(s => s.category === activeFilter).map(s => s.name);
    return initialNotes.filter(note => subjectNames.includes(note.subject) || note.subject === activeFilter);
  }, [activeFilter, subjects]);
  
  const getCategoryForNote = (noteSubject: string) => {
    const subject = subjects.find(s => s.name === noteSubject);
    return subject ? subject.category : "General";
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Note Keeper</h1>
        <Button variant="outline">
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
        {filteredNotes.map((note) => (
          <Card key={note.id} className="overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="md:col-span-2">
                <CardContent className="p-6">
                  <p className="text-sm font-semibold text-muted-foreground">{getCategoryForNote(note.subject)}</p>
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
        ))}
      </div>
    </div>
  )
}
