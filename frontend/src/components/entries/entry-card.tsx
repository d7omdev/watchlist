import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  User,
  Film,
  Tv,
} from "lucide-react";
import type { Entry } from "@/types/entry";
import { getImageUrl } from "@/lib/utils";

interface EntryCardProps {
  entry: Entry;
}

export function EntryCard({ entry }: EntryCardProps) {
  const formatBudget = (budget: string) => {
    if (!budget || budget.trim() === "") return "-";

    const budgetRegex = /^\$?(\d+(?:,\d{3})*(?:\.\d+)?)\s*([KMB]?)$/i;
    const match = budget.trim().match(budgetRegex);

    if (match) {
      const [, numberPart, suffix] = match;
      let amount = parseFloat(numberPart.replace(/,/g, ""));

      switch (suffix.toUpperCase()) {
        case "K":
          amount *= 1000;
          break;
        case "M":
          amount *= 1000000;
          break;
        case "B":
          amount *= 1000000000;
          break;
      }

      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        notation: amount >= 1000000 ? "compact" : "standard",
        maximumFractionDigits: amount >= 1000000 ? 1 : 0,
      }).format(amount);
    }

    return budget;
  };

  const getTypeIcon = (type: string) => {
    return type === "Movie" ? (
      <Film className="h-4 w-4" />
    ) : (
      <Tv className="h-4 w-4" />
    );
  };

  const getTypeColor = (type: string) => {
    return type === "Movie"
      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
  };

  return (
    <Card className="w-full max-w-xl mx-auto bg-background rounded-lg shadow-xl overflow-hidden">
      <div className="relative">
        {/* Image */}
        <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden mt-2">
          {entry.imageUrl ? (
            <img
              src={getImageUrl(entry.imageUrl)}
              alt={entry.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              {getTypeIcon(entry.type)}
              <span className="text-sm mt-2">No Image</span>
            </div>
          )}
        </div>
        {/* Type Badge */}
        <div className="absolute top-4 left-4">
          <Badge
            className={`${getTypeColor(entry.type)} border-0 text-xs px-2 py-1`}
          >
            {getTypeIcon(entry.type)}
            <span className="ml-1">{entry.type}</span>
          </Badge>
        </div>
      </div>
      <CardHeader className="pb-2 pt-6 px-6">
        <h3
          className="font-bold text-2xl leading-tight mb-1"
          title={entry.title}
        >
          {entry.title}
        </h3>
        <div className="flex items-center text-base text-muted-foreground mb-2">
          <User className="h-4 w-4 mr-2" />
          <span className="truncate">{entry.director}</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-6 pb-6 space-y-4">
        {/* Description */}
        {entry.description && (
          <p
            className="text-base text-muted-foreground mb-2"
            title={entry.description}
          >
            {entry.description}
          </p>
        )}
        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="font-medium">{formatBudget(entry.budget)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <span>{entry.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-red-600" />
            <span className="truncate" title={entry.location}>
              {entry.location}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-purple-600" />
            <span>{entry.yearTime}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
