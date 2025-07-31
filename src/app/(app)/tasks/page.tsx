
'use client'

import { useState, useEffect, useContext } from "react";
import Confetti from 'react-confetti'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { MoreHorizontal, PlusCircle, Trash2, Pencil, ChevronDown, CheckCircle } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { format, isToday, isThisWeek, addDays, parseISO } from 'date-fns';
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { SubjectContext } from "@/context/SubjectContext";


type Task = {
  id: number;
  title: string;
  subject: string;
  status: "Not Started" | "In Progress" | "Done";
  dueDate: string;
  isCompleted: boolean;
};

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Complete Math Assignment",
    subject: "Calculus",
    status: "Not Started",
    dueDate: new Date().toISOString(),
    isCompleted: false,
  },
  {
    id: 2,
    title: "Write History Essay",
    subject: "World History",
    status: "Not Started",
    dueDate: addDays(new Date(), 1).toISOString(),
    isCompleted: false,
  },
  {
    id: 3,
    title: "Read Chapter 5 of Biology",
    subject: "Biology",
    status: "Done",
    dueDate: addDays(new Date(), 3).toISOString(),
    isCompleted: true,
  },
  {
    id: 4,
    title: "Prepare Presentation for Chemistry",
    subject: "Physics",
    status: "In Progress",
    dueDate: addDays(new Date(), 5).toISOString(),
    isCompleted: false,
  },
];

const formatDueDate = (dateString: string) => {
    const date = parseISO(dateString);
    if (isToday(date)) return 'Due Today';
    if (isThisWeek(date, { weekStartsOn: 1 })) return `Due ${format(date, 'eeee')}`;
    return `Due ${format(date, 'MMM dd')}`;
}

const TaskItem = ({ task, onToggleComplete, onEdit, onDelete }: { task: Task; onToggleComplete: (id: number, isCompleted: boolean) => void; onEdit: (task: Task) => void; onDelete: (id: number) => void; }) => {
  return (
     <Card 
        className="hover:shadow-md transition-all duration-300"
        onDoubleClick={() => onToggleComplete(task.id, !task.isCompleted)}
     >
      <CardContent className="p-4 flex items-center">
        <Checkbox
            id={`task-${task.id}`}
            checked={task.isCompleted}
            onCheckedChange={(checked) => onToggleComplete(task.id, !!checked)}
            className="mr-4"
        />
        <div className="flex-grow">
            <p className={cn("font-medium", task.isCompleted && "line-through text-muted-foreground")}>{task.title}</p>
            <div className={cn("text-sm text-muted-foreground", task.isCompleted && "line-through")}>
                <span>{formatDueDate(task.dueDate)}</span>
                {task.subject && <span className="mx-1">·</span>}
                <span>{task.subject}</span>
            </div>
        </div>
        {!task.isCompleted && (
          <div className="flex items-center space-x-1">
              <Button variant="ghost" size="icon" onClick={() => onEdit(task)}>
                  <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)}>
                  <Trash2 className="h-4 w-4" />
              </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [showConfetti, setShowConfetti] = useState(false);
  const { subjects } = useContext(SubjectContext);


  useEffect(() => {
    const tasksToUpdate = tasks.filter(
      (task) => task.isCompleted && task.status !== "Done"
    );

    if (tasksToUpdate.length > 0) {
      const timer = setTimeout(() => {
        setTasks((currentTasks) =>
          currentTasks.map((task) => {
            if (tasksToUpdate.some((t) => t.id === task.id)) {
              return { ...task, status: "Done" };
            }
            return task;
          })
        );
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [tasks]);


  const subjectOptions = ['All', ...subjects.map(s => s.name), 'General'];

  const [taskDetails, setTaskDetails] = useState({
    title: "",
    subject: "",
    dueDate: "",
  });

  const resetForm = () => {
    setTaskDetails({
      title: "",
      subject: "",
      dueDate: "",
    });
    setEditingTask(null);
  };

  const handleOpenDialog = (task: Task | null) => {
    if (task) {
      setEditingTask(task);
      setTaskDetails({
        title: task.title,
        subject: task.subject,
        dueDate: format(parseISO(task.dueDate), 'yyyy-MM-dd'),
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    resetForm();
    setIsDialogOpen(false);
  }

  const handleSaveTask = () => {
    if (!taskDetails.title || !taskDetails.dueDate) {
      alert("Please fill in all fields.");
      return;
    }

    if (editingTask) {
      setTasks(
        tasks.map((task) =>
          task.id === editingTask.id ? { ...task, title: taskDetails.title, subject: taskDetails.subject, dueDate: new Date(taskDetails.dueDate).toISOString() } : task
        )
      );
    } else {
      const newTask: Task = {
        id: Math.max(...tasks.map((t) => t.id), 0) + 1,
        title: taskDetails.title,
        subject: taskDetails.subject,
        dueDate: new Date(taskDetails.dueDate).toISOString(),
        status: "Not Started",
        isCompleted: false,
      };
      setTasks([...tasks, newTask]);
    }

    handleCloseDialog();
  };
  
  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };
  
  const handleToggleComplete = (taskId: number, isCompleted: boolean) => {
    if (isCompleted) {
      setShowConfetti(true);
    }
    
    setTasks(currentTasks =>
      currentTasks.map(task =>
        task.id === taskId ? { ...task, isCompleted, status: isCompleted ? 'In Progress' : 'Not Started' } : task
      )
    );
  }

  const handleInputChange = (field: keyof typeof taskDetails, value: string) => {
    setTaskDetails(prev => ({ ...prev, [field]: value }));
  };

  const baseFilteredTasks = tasks.filter(task => {
    const date = parseISO(task.dueDate);
    const filterCondition = filter === 'All' || 
                            (filter === 'Today' && isToday(date)) ||
                            (filter === 'This Week' && isThisWeek(date, { weekStartsOn: 1 }));
    const subjectCondition = subjectFilter === 'All' || task.subject === subjectFilter;
    return filterCondition && subjectCondition;
  });

  const incompleteTasks = baseFilteredTasks.filter(task => task.status !== "Done");
  const completedTasks = baseFilteredTasks.filter(task => task.status === "Done");

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {showConfetti && <Confetti recycle={false} onConfettiComplete={() => setShowConfetti(false)} />}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tasks</h1>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button variant={filter === 'All' ? 'secondary' : 'ghost'} onClick={() => setFilter('All')}>All</Button>
        <Button variant={filter === 'Today' ? 'secondary' : 'ghost'} onClick={() => setFilter('Today')}>Today</Button>
        <Button variant={filter === 'This Week' ? 'secondary' : 'ghost'} onClick={() => setFilter('This Week')}>This Week</Button>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                    Subject <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Filter by Subject</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {subjectOptions.map(subject => (
                     <DropdownMenuCheckboxItem
                        key={subject}
                        checked={subjectFilter === subject}
                        onCheckedChange={() => setSubjectFilter(subject)}
                     >
                        {subject}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]" onInteractOutside={handleCloseDialog}>
            <DialogHeader>
              <DialogTitle>{editingTask ? "Edit Task" : "Add Task"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={taskDetails.title} onChange={(e) => handleInputChange('title', e.target.value)} placeholder="e.g. Finish Math assignment" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select
                  value={taskDetails.subject}
                  onValueChange={(value) => handleInputChange('subject', value)}
                >
                  <SelectTrigger id="subject">
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
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" type="date" value={taskDetails.dueDate} onChange={(e) => handleInputChange('dueDate', e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCloseDialog} variant="outline">Cancel</Button>
              <Button onClick={handleSaveTask} className="bg-primary hover:bg-primary/90 text-primary-foreground">Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div>
            <div className="flex items-center justify-between mt-6 mb-4">
              <h2 className="text-xl font-semibold">Task List</h2>
              <Button onClick={() => handleOpenDialog(null)} className="bg-primary text-primary-foreground hover:bg-primary/90">
                Add Task
              </Button>
            </div>
            <div className="space-y-3">
                {incompleteTasks.length > 0 ? incompleteTasks.map((task) => (
                    <TaskItem 
                    key={task.id}
                    task={task}
                    onToggleComplete={handleToggleComplete}
                    onEdit={handleOpenDialog}
                    onDelete={handleDeleteTask}
                    />
                )) : (
                    <p className="p-4 text-center text-muted-foreground bg-muted/50 rounded-lg">No active tasks. Well done!</p>
                )}
            </div>
        </div>

        {completedTasks.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mt-8 mb-4">
              <CheckCircle className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Completed</h2>
            </div>
             <div className="space-y-3">
                {completedTasks.map((task) => (
                    <TaskItem 
                    key={task.id}
                    task={task}
                    onToggleComplete={handleToggleComplete}
                    onEdit={handleOpenDialog}
                    onDelete={handleDeleteTask}
                    />
                ))}
            </div>
          </div>
        )}
    </div>
  )
}
