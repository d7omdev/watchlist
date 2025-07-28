import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { EntryCard } from "@/components/entries/entry-card";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import type { Entry } from "@/types/entry";

interface ColumnActionsProps {
  entry: Entry;
  onEdit: (entry: Entry) => void;
  onDelete: (entry: Entry) => void;
  isDeleting?: boolean;
}

export const ColumnActions = ({
  entry,
  onEdit,
  onDelete,
  isDeleting,
}: ColumnActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(entry)}>
          Edit entry
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete(entry)}
          disabled={isDeleting}
          className="text-destructive"
        >
          {isDeleting ? "Deleting..." : "Delete entry"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export function EntryPreviewCell({ entry }: { entry: Entry }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        title="Preview"
        className="hover:bg-muted"
      >
        <span className="sr-only">Preview</span>
        <svg
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M2.05 12a9.94 9.94 0 0 1 19.9 0 9.94 9.94 0 0 1-19.9 0Z" />
        </svg>
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg p-0">
          <EntryCard
            entry={entry}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

