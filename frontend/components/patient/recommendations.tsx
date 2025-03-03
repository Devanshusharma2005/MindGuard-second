import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { BookOpen } from "lucide-react"

interface Resource {
  title: string;
  type: string;
  duration: string;
  description: string;
  action: {
    label: string;
    url: string;
  };
}

interface RecommendationsProps {
  recommendations?: {
    articles: Resource[];
    videos: Resource[];
  };
}

export default function Recommendations({ recommendations }: RecommendationsProps) {
  if (!recommendations) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        Complete the questionnaire to see your personalized recommendations.
      </div>
    );
  }

  return (
    <div>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Articles & Guides</h3>
          </div>
          <div className="mt-4 space-y-3">
            {recommendations.articles.map((article, index) => (
              <div key={index} className="rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{article.title}</p>
                  <Badge variant="outline">{article.duration}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {article.description}
                </p>
                <Button 
                  variant="link" 
                  className="h-auto p-0 text-xs mt-1"
                  onClick={() => window.open(article.action.url, '_blank')}
                >
                  {article.action.label}
                </Button>
              </div>
            ))}
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
            {recommendations.videos.map((video, index) => (
              <div key={index} className="rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{video.title}</p>
                  <Badge variant="outline">{video.type}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {video.description}
                </p>
                <Button 
                  variant="link" 
                  className="h-auto p-0 text-xs mt-1"
                  onClick={() => window.open(video.action.url, '_blank')}
                >
                  {video.action.label}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}