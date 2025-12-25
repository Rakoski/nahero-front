import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./card";
import { Badge } from "./badge";
import { Progress } from "./progress";

interface CourseCardProps extends React.ComponentProps<typeof Card> {
  image?: string;
  imageAlt?: string;
  title: string;
  description?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  progress?: number;
  showProgress?: boolean;
}

function CourseCard({
  image,
  imageAlt = "Course thumbnail",
  title,
  description,
  difficulty,
  progress = 0,
  showProgress = false,
  className,
  children,
  ...props
}: CourseCardProps) {
  const difficultyColors = {
    Beginner: "bg-chart-2/20 text-chart-2 border-chart-2/30",
    Intermediate: "bg-chart-3/20 text-chart-3 border-chart-3/30",
    Advanced: "bg-chart-5/20 text-chart-5 border-chart-5/30",
  };

  return (
    <Card
      className={cn(
        "group overflow-hidden transition-all hover:shadow-md focus-within:ring-2 focus-within:ring-ring/50 focus-within:border-ring",
        className
      )}
      {...props}
    >
      {image && (
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <Image
            src={image}
            alt={imageAlt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {difficulty && (
            <div className="absolute top-3 right-3">
              <Badge
                className={cn(
                  "shadow-sm backdrop-blur-sm",
                  difficultyColors[difficulty]
                )}
              >
                {difficulty}
              </Badge>
            </div>
          )}
        </div>
      )}

      <CardHeader>
        <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="line-clamp-2">
            {description}
          </CardDescription>
        )}
      </CardHeader>

      {children && <CardContent>{children}</CardContent>}

      {showProgress && (
        <CardFooter className="flex-col items-start gap-2 border-t">
          <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </CardFooter>
      )}
    </Card>
  );
}

export { CourseCard };
