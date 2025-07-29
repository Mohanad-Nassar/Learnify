
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, RefreshCw } from "lucide-react";

export default function FocusPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-4xl font-bold">Focus Timer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-8xl font-mono font-bold my-8">
            25:00
          </div>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="w-24 bg-accent text-accent-foreground hover:bg-accent/90">
              <Play className="h-6 w-6" />
            </Button>
            <Button size="lg" variant="outline" className="w-24">
              <Pause className="h-6 w-6" />
            </Button>
            <Button size="lg" variant="ghost" className="w-24">
              <RefreshCw className="h-6 w-6" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
