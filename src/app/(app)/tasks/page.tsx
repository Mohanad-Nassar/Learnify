
'use client'

import { useState } from "react";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MoreHorizontal, PlusCircle } from "lucide-react"

type Task = {
  id: number;
  title: string;
  status: "Not Started" | "In Progress" | "Done";
  dueDate: string;
  priority: "Low" | "Medium" | "High";
};

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Complete Project Proposal",
    status: "In Progress",
    dueDate: "2024-08-15",
    priority: "High",
  },
  {
    id: 2,
    title: "Study for History Midterm",
    status: "Not Started",
    dueDate: "2024-08-20",
    priority: "High",
  },
  {
    id: 3,
    title: "Read 'The Great Gatsby' Chapter 1-3",
    status: "Done",
    dueDate: "2024-08-10",
    priority: "Medium",
  },
  {
    id: 4,
    title: "Practice Algebra Problems",
    status: "In Progress",
    dueDate: "2024-08-12",
    priority: "Medium",
  },
  {
    id: 5,
    title: "Outline Biology Lab Report",
    status: "Not Started",
    dueDate: "2024-08-18",
    priority: "Low",
  },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [newTitle, setNewTitle] = useState("");
  const [newStatus, setNewStatus] = useState<Task["status"]>("Not Started");
  const [newPriority, setNewPriority] = useState<Task["priority"]>("Medium");
  const [newDueDate, setNewDueDate] = useState("");

  const handleAddTask = () => {
    if (!newTitle || !newDueDate) {
      // Basic validation
      alert("Please fill in all fields.");
      return;
    }
    const newTask: Task = {
      id: Math.max(...tasks.map(t => t.id), 0) + 1,
      title: newTitle,
      status: newStatus,
      priority: newPriority,
      dueDate: newDueDate,
    };
    setTasks([...tasks, newTask]);
    resetForm();
    setIsDialogOpen(false);
  };
  
  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const resetForm = () => {
    setNewTitle("");
    setNewStatus("Not Started");
    setNewPriority("Medium");
    setNewDueDate("");
  }


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Tasks</h1>
          <p className="text-muted-foreground">Manage and track your tasks here.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              <PlusCircle className="mr-2 h-4 w-4" /> Create Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new task to your list.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input id="title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Finish Math assignment" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select value={newStatus} onValueChange={(value: Task["status"]) => setNewStatus(value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-right">
                  Priority
                </Label>
                <Select value={newPriority} onValueChange={(value: Task["priority"]) => setNewPriority(value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dueDate" className="text-right">
                  Due Date
                </Label>
                <Input id="dueDate" type="date" value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsDialogOpen(false)} variant="outline">Cancel</Button>
              <Button onClick={handleAddTask} className="bg-primary hover:bg-primary/90 text-primary-foreground">Save Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Task List</CardTitle>
          <CardDescription>An overview of all your current tasks.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>
                    <Badge variant={task.status === 'Done' ? 'default' : task.status === 'In Progress' ? 'secondary' : 'outline'} className={task.status === 'Done' ? 'bg-primary/20 text-primary-foreground' : ''}>{task.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={task.priority === 'High' ? 'destructive' : task.priority === 'Medium' ? 'outline' : 'secondary'} className={task.priority === 'High' ? 'bg-destructive/80' : ''}>{task.priority}</Badge>
                  </TableCell>
                  <TableCell>{task.dueDate}</TableCell>
                   <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => alert('Editing is not implemented yet!')}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteTask(task.id)}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
