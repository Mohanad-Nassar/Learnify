
'use client'

import { useState } from "react";
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

type Member = {
  name: string;
  avatar: string;
  avatarHint: string;
};

type SharedTask = {
  id: number;
  title: string;
  status: "In Progress" | "Completed" | "To Do";
  assignee: string; // Member name
  dueDate: Date;
};

type ChatMessage = {
  user: string;
  message: string;
  avatar: string;
  avatarHint: string;
  timestamp: string;
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
    image: "/group-icon-1.png",
    imageHint: "people studying",
    members: [
      { name: "Olivia", avatar: "https://placehold.co/40x40", avatarHint: "woman smiling" },
      { name: "Liam", avatar: "https://placehold.co/40x40", avatarHint: "man thinking" },
    ],
    tasks: [
      { id: 1, title: "Prepare presentation", status: "In Progress", assignee: "Olivia", dueDate: new Date("2024-07-15") },
      { id: 2, title: "Write report", status: "Completed", assignee: "Liam", dueDate: new Date("2024-07-10") },
      { id: 3, title: "Review notes", status: "To Do", assignee: "Olivia", dueDate: new Date("2024-07-20") },
    ],
    chat: [
      { user: "Olivia", message: "Hey everyone, let's schedule a meeting to discuss the presentation.", avatar: "https://placehold.co/40x40", avatarHint: "woman smiling", timestamp: "2024-07-12 10:00 AM" },
      { user: "Liam", message: "Sounds good, Olivia. How about tomorrow afternoon?", avatar: "https://placehold.co/40x40", avatarHint: "man thinking", timestamp: "2024-07-12 10:15 AM" },
    ],
  },
  {
    id: 2,
    name: "Project Team",
    membersCount: 3,
    image: "/group-icon-2.png",
    imageHint: "team collaboration",
    members: [{ name: "Noah", avatar: "https://placehold.co/40x40", avatarHint: "man with glasses" }, { name: "Emma", avatar: "https://placehold.co/40x40", avatarHint: "woman with glasses" }, { name: "Ava", avatar: "https://placehold.co/40x40", avatarHint: "woman looking away"}],
    tasks: [],
    chat: [],
  },
  {
    id: 3,
    name: "Book Club",
    membersCount: 4,
    image: "/group-icon-3.png",
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
  const selectedGroup = groups.find(g => g.id === selectedGroupId) || groups[0];

  const handleAssigneeChange = (taskId: number, newAssignee: string) => {
    const updatedGroups = groups.map(group => {
        if (group.id === selectedGroupId) {
            return {
                ...group,
                tasks: group.tasks.map(task => 
                    task.id === taskId ? { ...task, assignee: newAssignee } : task
                )
            };
        }
        return group;
    });
    setGroups(updatedGroups);
  };

  const handleDueDateChange = (taskId: number, newDueDate: Date | undefined) => {
    if (!newDueDate) return;
    const updatedGroups = groups.map(group => {
        if (group.id === selectedGroupId) {
            return {
                ...group,
                tasks: group.tasks.map(task => 
                    task.id === taskId ? { ...task, dueDate: newDueDate } : task
                )
            };
        }
        return group;
    });
    setGroups(updatedGroups);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="md:col-span-1">
        <h2 className="text-2xl font-bold mb-4">Groups</h2>
        <div className="space-y-2">
            {groups.map((group) => (
            <button
                key={group.id}
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
              <h3 className="text-xl font-semibold mb-3">Shared Tasks</h3>
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
                                    <TableCell className="font-medium">{task.title}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusBadgeVariant(task.status)}>{task.status}</Badge>
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
                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-6 h-60 overflow-y-auto pr-4">
                        {selectedGroup.chat.map((msg, index) => (
                            <div key={index} className="flex items-start gap-3">
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
                                </div>
                            </div>
                        ))}
                        </div>
                        <div className="mt-4 flex space-x-2">
                            <Input placeholder="Write a message" />
                            <Button variant="ghost" size="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.59a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

