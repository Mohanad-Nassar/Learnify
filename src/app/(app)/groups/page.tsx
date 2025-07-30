
'use client'

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Paperclip, Send, Plus, CalendarIcon, Edit } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type Member = {
  name: string;
  avatar: string;
  avatarHint: string;
};

type TaskStatus = "In Progress" | "Completed" | "To Do";

type SharedTask = {
  id: number;
  title: string;
  status: TaskStatus;
  assignee: string; // Member name
  dueDate: Date;
};

type ChatMessage = {
  user: string;
  message: string;
  avatar: string;
  avatarHint: string;
  timestamp: string;
  attachment?: string;
};

type Group = {
  id: number;
  name: string;
  membersCount: number;
  image: string;
  imageHint: string;
  members: Member[];
  tasks: SharedTask[];
  chat: ChatMessage[];
};

const initialGroups: Group[] = [
  {
    id: 1,
    name: "Study Group",
    membersCount: 2,
    image: "https://placehold.co/100x100",
    imageHint: "people studying",
    members: [
      { name: "You", avatar: "/profile.png", avatarHint: "your profile picture" },
      { name: "Olivia", avatar: "https://placehold.co/40x40", avatarHint: "woman smiling" },
      { name: "Liam", avatar: "https://placehold.co/40x40", avatarHint: "man thinking" },
    ],
    tasks: [
      { id: 1, title: "Prepare presentation", status: "In Progress", assignee: "Olivia", dueDate: new Date("2024-07-15") },
      { id: 2, title: "Write report", status: "Completed", assignee: "Liam", dueDate: new Date("2024-07-10") },
      { id: 3, title: "Review notes", status: "To Do", assignee: "You", dueDate: new Date("2024-07-20") },
    ],
    chat: [
      { user: "Olivia", message: "Hey everyone, let's schedule a meeting to discuss the presentation.", avatar: "https://placehold.co/40x40", avatarHint: "woman smiling", timestamp: "10:00 AM" },
      { user: "Liam", message: "Sounds good, Olivia. How about tomorrow afternoon?", avatar: "https://placehold.co/40x40", avatarHint: "man thinking", timestamp: "10:15 AM" },
    ],
  },
  {
    id: 2,
    name: "Project Team",
    membersCount: 3,
    image: "https://placehold.co/100x100",
    imageHint: "team collaboration",
    members: [{ name: "Noah", avatar: "https://placehold.co/40x40", avatarHint: "man with glasses" }, { name: "Emma", avatar: "https://placehold.co/40x40", avatarHint: "woman with glasses" }, { name: "Ava", avatar: "https://placehold.co/40x40", avatarHint: "woman looking away"}],
    tasks: [],
    chat: [],
  },
  {
    id: 3,
    name: "Book Club",
    membersCount: 4,
    image: "https://placehold.co/100x100",
    imageHint: "person reading",
    members: [],
    tasks: [],
    chat: [],
  },
];


const getStatusBadgeVariant = (status: SharedTask['status']) => {
    switch (status) {
        case 'Completed': return 'default';
        case 'In Progress': return 'secondary';
        case 'To Do': return 'outline';
        default: return 'outline';
    }
}


export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [selectedGroupId, setSelectedGroupId] = useState(1);
  const [newMessage, setNewMessage] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [newTaskDetails, setNewTaskDetails] = useState({ title: "", assignee: "", dueDate: new Date() });

  const selectedGroup = groups.find(g => g.id === selectedGroupId) || groups[0];
  
  const updateTask = (taskId: number, updatedProperties: Partial<SharedTask>) => {
    setGroups(groups.map(group => {
        if (group.id === selectedGroupId) {
            return {
                ...group,
                tasks: group.tasks.map(task => 
                    task.id === taskId ? { ...task, ...updatedProperties } : task
                )
            };
        }
        return group;
    }));
  };
  
  const handleAddNewTask = () => {
    if (!newTaskDetails.title || !newTaskDetails.assignee) {
      alert("Please fill out all fields for the new task.");
      return;
    }
    const newTask: SharedTask = {
      id: Date.now(), // simple unique id
      title: newTaskDetails.title,
      status: "To Do",
      assignee: newTaskDetails.assignee,
      dueDate: newTaskDetails.dueDate
    };
    setGroups(groups.map(group => {
      if (group.id === selectedGroupId) {
        return {
          ...group,
          tasks: [...group.tasks, newTask]
        };
      }
      return group;
    }));
    setIsTaskDialogOpen(false);
    setNewTaskDetails({ title: "", assignee: "", dueDate: new Date() }); // Reset form
  };

  const handleChangeGroupPicture = (groupId: number) => {
    const placeholderImages = [
      "https://placehold.co/100x100",
      "https://placehold.co/100x101",
      "https://placehold.co/101x100",
      "https://placehold.co/101x101",
    ];
    setGroups(groups.map(group => {
      if (group.id === groupId) {
        const currentImageIndex = placeholderImages.indexOf(group.image);
        const nextImageIndex = (currentImageIndex + 1) % placeholderImages.length;
        return { ...group, image: placeholderImages[nextImageIndex] };
      }
      return group;
    }));
  }

  const handleTitleChange = (taskId: number, newTitle: string) => {
    updateTask(taskId, { title: newTitle });
  };
  
  const handleStatusChange = (taskId: number, newStatus: TaskStatus) => {
    updateTask(taskId, { status: newStatus });
  };

  const handleAssigneeChange = (taskId: number, newAssignee: string) => {
    updateTask(taskId, { assignee: newAssignee });
  };

  const handleDueDateChange = (taskId: number, newDueDate: Date | undefined) => {
    if (!newDueDate) return;
    updateTask(taskId, { dueDate: newDueDate });
  };
  
  const handleSendMessage = () => {
    if (newMessage.trim() === "" && !attachment) return;

    const currentUser = selectedGroup.members.find(m => m.name === 'You') || { name: "You", avatar: "/profile.png", avatarHint: "your profile picture" };

    const messageToSend: ChatMessage = {
        user: currentUser.name,
        message: newMessage,
        avatar: currentUser.avatar,
        avatarHint: currentUser.avatarHint,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        attachment: attachment ? attachment.name : undefined,
    };

    setGroups(groups.map(group => {
        if (group.id === selectedGroupId) {
            return {
                ...group,
                chat: [...group.chat, messageToSend]
            };
        }
        return group;
    }));

    setNewMessage("");
    setAttachment(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };


  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="md:col-span-1">
        <h2 className="text-2xl font-bold mb-4">Groups</h2>
        <div className="space-y-2">
            {groups.map((group) => (
              <div key={group.id} className="relative group/item">
                <button
                    onClick={() => setSelectedGroupId(group.id)}
                    className={cn(
                    "w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors",
                    selectedGroupId === group.id
                        ? "bg-muted"
                        : "hover:bg-muted/50"
                    )}
                >
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={group.image} data-ai-hint={group.imageHint} />
                        <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                    <p className="font-semibold">{group.name}</p>
                    <p className="text-sm text-muted-foreground">{group.membersCount} members</p>
                    </div>
                </button>
                 <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-1/2 -translate-y-1/2 right-2 h-7 w-7 opacity-0 group-hover/item:opacity-100 transition-opacity"
                    onClick={() => handleChangeGroupPicture(group.id)}
                  >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            ))}
        </div>
        <Button variant="outline" className="w-full mt-4">Create Group</Button>
      </div>

      <div className="md:col-span-3">
        {selectedGroup && (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold">{selectedGroup.name}</h1>

            <div>
              <h3 className="text-xl font-semibold mb-3">Members</h3>
              <div className="flex space-x-2">
                {selectedGroup.members.map((member) => (
                  <Avatar key={member.name}>
                    <AvatarImage src={member.avatar} data-ai-hint={member.avatarHint} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-semibold">Shared Tasks</h3>
                <Button onClick={() => setIsTaskDialogOpen(true)} size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Add Task
                </Button>
              </div>
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Assignee</TableHead>
                                    <TableHead>Due Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {selectedGroup.tasks.map((task) => (
                                <TableRow key={task.id}>
                                    <TableCell className="font-medium">
                                      <Input 
                                        value={task.title}
                                        onChange={(e) => handleTitleChange(task.id, e.target.value)}
                                        className="border-0 bg-transparent shadow-none p-0 focus-visible:ring-0 focus-visible:bg-muted"
                                      />
                                    </TableCell>
                                    <TableCell>
                                        <Select value={task.status} onValueChange={(value: TaskStatus) => handleStatusChange(task.id, value)}>
                                            <SelectTrigger className="border-0 bg-transparent shadow-none w-auto gap-1 p-0 h-auto focus:ring-0">
                                              <Badge variant={getStatusBadgeVariant(task.status)}>
                                                <SelectValue />
                                              </Badge>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="To Do">To Do</SelectItem>
                                                <SelectItem value="In Progress">In Progress</SelectItem>
                                                <SelectItem value="Completed">Completed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <Select value={task.assignee} onValueChange={(value) => handleAssigneeChange(task.id, value)}>
                                            <SelectTrigger className="border-0 bg-transparent shadow-none w-auto gap-1 p-0 h-auto focus:ring-0">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {selectedGroup.members.map(member => (
                                                    <SelectItem key={member.name} value={member.name}>{member.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="ghost" className="p-0 h-auto font-normal">{format(task.dueDate, "yyyy-MM-dd")}</Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                mode="single"
                                                selected={task.dueDate}
                                                onSelect={(date) => handleDueDateChange(task.id, date)}
                                                initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Group Chat</h3>
                <Card className="flex flex-col h-[400px]">
                    <CardContent className="pt-6 flex-grow overflow-hidden">
                        <ScrollArea className="h-full pr-4">
                        {selectedGroup.chat.map((msg, index) => (
                            <div key={index} className="flex items-start gap-3 mb-4">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={msg.avatar} data-ai-hint={msg.avatarHint} />
                                    <AvatarFallback>{msg.user.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="flex items-baseline gap-2">
                                        <p className="font-semibold text-sm">{msg.user}</p>
                                        <p className="text-xs text-muted-foreground">{msg.timestamp}</p>
                                    </div>
                                    <p>{msg.message}</p>
                                    {msg.attachment && (
                                      <div className="mt-2 text-sm text-blue-500 flex items-center gap-2">
                                        <Paperclip className="h-4 w-4" />
                                        <span>{msg.attachment}</span>
                                      </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        </ScrollArea>
                    </CardContent>
                    <div className="p-4 border-t">
                        {attachment && (
                            <div className="mb-2 text-sm text-muted-foreground flex items-center gap-2">
                                <Paperclip className="h-4 w-4" />
                                <span>{attachment.name}</span>
                                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => {setAttachment(null); if(fileInputRef.current) fileInputRef.current.value = ""}}>&times;</Button>
                            </div>
                        )}
                        <div className="flex space-x-2">
                            <Input 
                                placeholder="Write a message"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                             <input type="file" ref={fileInputRef} onChange={handleFileAttach} className="hidden" />
                             <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
                                <Paperclip className="h-5 w-5" />
                            </Button>
                            <Button onClick={handleSendMessage} className="bg-primary text-primary-foreground hover:bg-primary/90">
                                <Send className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
          </div>
        )}
      </div>
      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a new shared task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">Task Title</Label>
              <Input
                id="task-title"
                value={newTaskDetails.title}
                onChange={(e) => setNewTaskDetails({ ...newTaskDetails, title: e.target.value })}
                placeholder="e.g. Review chapter 10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-assignee">Assign To</Label>
              <Select
                value={newTaskDetails.assignee}
                onValueChange={(value) => setNewTaskDetails({ ...newTaskDetails, assignee: value })}
              >
                <SelectTrigger id="task-assignee">
                  <SelectValue placeholder="Select a member" />
                </SelectTrigger>
                <SelectContent>
                  {selectedGroup?.members.map(member => (
                    <SelectItem key={member.name} value={member.name}>{member.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(newTaskDetails.dueDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newTaskDetails.dueDate}
                    onSelect={(date) => date && setNewTaskDetails({ ...newTaskDetails, dueDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTaskDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddNewTask}>Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
