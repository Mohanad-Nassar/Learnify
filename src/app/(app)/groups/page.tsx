import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Send, Plus, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

const groups = [
  { name: "Biology Study Group", members: 12, image: "/biology-group.png", hint: "biology microscope" },
  { name: "History Buffs", members: 8, image: "/history-group.png", hint: "history books" },
  { name: "Mathletes", members: 23, image: "/math-group.png", hint: "math symbols" },
];

const chatMessages = [
  { user: "Alice", message: "Hey everyone, ready for the test on Friday?", avatar: "https://placehold.co/32x32" },
  { user: "You", message: "I will be! Just need to review chapter 5.", avatar: "/profile.png" },
  { user: "Bob", message: "Can we do a review session tomorrow?", avatar: "https://placehold.co/32x32" },
];

export default function GroupsPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Your Groups</CardTitle>
            <Button variant="ghost" size="icon">
              <Plus className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {groups.map((group) => (
                <div key={group.name} className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={group.image} data-ai-hint={group.hint} />
                    <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{group.name}</p>
                    <p className="text-sm text-muted-foreground">{group.members} members</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-6 w-6" />
              <span>Biology Study Group</span>
            </CardTitle>
            <CardDescription>Chat with your group members.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 h-80 overflow-y-auto p-4 border rounded-md mb-4">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`flex items-start gap-3 ${msg.user === 'You' ? 'flex-row-reverse' : ''}`}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={msg.avatar} data-ai-hint={msg.user === 'You' ? 'palestinian girl' : 'woman hijab'} />
                    <AvatarFallback>{msg.user.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className={`rounded-lg p-3 max-w-xs ${msg.user === 'You' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    <p className="font-semibold text-sm">{msg.user}</p>
                    <p>{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input placeholder="Type your message..." />
              <Button>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
