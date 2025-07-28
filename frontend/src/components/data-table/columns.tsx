import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Entry } from "@/types/entry";
import { ColumnActions, EntryPreviewCell } from "./entry-actions";

export const createColumns = (
  onEdit: (entry: Entry) => void,
  onDelete: (entry: Entry) => void,
  deletingIds: Set<number> = new Set(),
): ColumnDef<Entry>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value: boolean) =>
            table.toggleAllPageRowsSelected(!!value)
          }
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    size: 50,
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div
        className="font-medium max-w-[200px] truncate"
        title={row.getValue("title")}
      >
        {row.getValue("title")}
      </div>
    ),
    size: 200,
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.getValue("type")}</div>
    ),
    size: 100,
  },
  {
    accessorKey: "director",
    header: "Director",
    cell: ({ row }) => (
      <div className="max-w-[150px] truncate" title={row.getValue("director")}>
        {row.getValue("director")}
      </div>
    ),
    size: 150,
  },
  {
    accessorKey: "budget",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Budget
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const budgetValue = row.getValue("budget") as string;

      if (!budgetValue || budgetValue.trim() === "") {
        return <div className="font-medium text-muted-foreground">-</div>;
      }

      // Regex to match budget formats like: $1M, $1.5M, $100K, $1B, $1,000,000, etc.
      const budgetRegex = /^\$?(\d+(?:,\d{3})*(?:\.\d+)?)\s*([KMB]?)$/i;
      const match = budgetValue.trim().match(budgetRegex);

      if (match) {
        const [, numberPart, suffix] = match;
        let amount = parseFloat(numberPart.replace(/,/g, ""));

        // Convert based on suffix
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

        // Format as currency
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          notation: amount >= 1000000 ? "compact" : "standard",
          maximumFractionDigits: amount >= 1000000 ? 1 : 0,
        }).format(amount);

        return <div className="font-medium">{formatted}</div>;
      }

      // If it doesn't match the budget format, display as-is
      return <div className="font-medium">{budgetValue}</div>;
    },
    size: 120,
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <div className="max-w-[120px] truncate" title={row.getValue("location")}>
        {row.getValue("location")}
      </div>
    ),
    size: 120,
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("duration")}</div>
    ),
    size: 100,
  },
  {
    accessorKey: "yearTime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Year
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("yearTime")}</div>
    ),
    size: 80,
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const entry = row.original;
      return (
        <div className="flex justify-center items-center gap-2">
          <ColumnActions
            entry={entry}
            onEdit={onEdit}
            onDelete={onDelete}
            isDeleting={deletingIds.has(entry.id)}
          />
          <EntryPreviewCell
            entry={entry}
          />
        </div>
      );
    },
    size: 120,
  },
];

