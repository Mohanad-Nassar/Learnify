'use client'

import { useState } from "react"
import { useTheme } from "next-themes"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Book, Plus, Trash2 } from "lucide-react"

type Subject = {
  id: number;
  name: string;
  category: string;
}

const initialSubjects: Subject[] = [
  { id: 1, name: "Calculus", category: "Math" },
  { id: 2, name: "Physics", category: "Science" },
  { id: 3, name: "World History", category: "History" },
]

export default function ProfilePage() {
  const { setTheme, theme } = useTheme()
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newSubject, setNewSubject] = useState({ name: "", category: "" })

  const handleAddSubject = () => {
    if (!newSubject.name || !newSubject.category) {
      alert("Please fill out both fields.");
      return;
    }
    const newId = subjects.length > 0 ? Math.max(...subjects.map(s => s.id)) + 1 : 1
    setSubjects([...subjects, { ...newSubject, id: newId }])
    setNewSubject({ name: "", category: "" })
    setIsDialogOpen(false)
  }

  const handleDeleteSubject = (id: number) => {
    setSubjects(subjects.filter(subject => subject.id !== id))
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-headline">Profile</h1>
      </div>

      <div className="flex flex-col items-center">
        <Avatar className="h-24 w-24 mx-auto mb-2">
          <AvatarImage src="/profile.png" alt="Alex Doe" data-ai-hint="palestinian girl" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-semibold">Alex Doe</h2>
        <p className="text-sm text-muted-foreground">Student</p>
      </div>

      <div className="space-y-8">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue="Alex Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue="alex.doe@example.com" />
            </div>
             <div className="flex justify-end">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Save Changes</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Subjects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {subjects.map(subject => (
              <div key={subject.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <Book className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">{subject.name}</p>
                    <p className="text-sm text-muted-foreground">{subject.category}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteSubject(subject.id)}>
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            ))}
             <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full mt-2">
                  <Plus className="mr-2 h-4 w-4" /> Add Subject
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add a new subject</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject-name">Subject Name</Label>
                    <Input id="subject-name" placeholder="e.g. Algebra II" value={newSubject.name} onChange={e => setNewSubject({...newSubject, name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject-category">Category</Label>
                    <Input id="subject-category" placeholder="e.g. Math" value={newSubject.category} onChange={e => setNewSubject({...newSubject, category: e.target.value})} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddSubject}>Add Subject</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="font-normal">
                Dark Mode
              </Label>
              <Switch
                id="dark-mode"
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications" className="font-normal">
                Notifications
              </Label>
              <Switch id="email-notifications" defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="text-center">
        <Button variant="destructive" className="bg-red-500 hover:bg-red-600 w-full max-w-xs">Logout</Button>
      </div>
    </div>
  )
}
