import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { BookOpen } from "lucide-react"

export default function Recommendations() {
  return (
    <div>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Articles & Guides</h3>
          </div>
          <div className="mt-4 space-y-3">
            <div className="rounded-md border p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Understanding Anxiety</p>
                <Badge variant="outline">5 min read</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Learn about the physiological and psychological aspects of anxiety
              </p>
              <Button variant="link" className="h-auto p-0 text-xs mt-1">
                Read Now
              </Button>
            </div>
            <div className="rounded-md border p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Sleep Improvement Guide</p>
                <Badge variant="outline">8 min read</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Practical strategies for better sleep quality
              </p>
              <Button variant="link" className="h-auto p-0 text-xs mt-1">
                Read Now
              </Button>
            </div>
            <div className="rounded-md border p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Stress Management Toolkit</p>
                <Badge variant="outline">10 min read</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Comprehensive guide to managing daily stressors
              </p>
              <Button variant="link" className="h-auto p-0 text-xs mt-1">
                Read Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Videos & Courses</h3>
          </div>
          <div className="mt-4 space-y-3">
            <div className="rounded-md border p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Mindfulness Fundamentals</p>
                <Badge variant="outline">4-week course</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Learn the basics of mindfulness meditation
              </p>
              <Button variant="link" className="h-auto p-0 text-xs mt-1">
                Enroll Now
              </Button>
            </div>
            <div className="rounded-md border p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">CBT Techniques</p>
                <Badge variant="outline">Video Series</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                6-part video series on cognitive behavioral techniques
              </p>
              <Button variant="link" className="h-auto p-0 text-xs mt-1">
                Watch Now
              </Button>
            </div>
            <div className="rounded-md border p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Anxiety Management Workshop</p>
                <Badge variant="outline">Live Workshop</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Interactive workshop on June 25th at 6PM
              </p>
              <Button variant="link" className="h-auto p-0 text-xs mt-1">
                Register
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}