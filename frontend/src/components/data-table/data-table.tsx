import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCallback, useEffect, useRef, useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  isLoading?: boolean;
  onRowSelectionChange?: (selectedRows: TData[]) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  pageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey = "title",
  searchPlaceholder = "Search...",
  isLoading = false,
  onRowSelectionChange,
  onRefresh,
  isRefreshing = false,
  hasMore = false,
  onLoadMore,
  isLoadingMore = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: (updater) => {
      setRowSelection(updater);
      if (onRowSelectionChange) {
        const newSelection =
          typeof updater === "function" ? updater(rowSelection) : updater;
        const selectedRows = table
          .getFilteredRowModel()
          .rows.filter((row) => newSelection[row.id])
          .map((row) => row.original);
        onRowSelectionChange(selectedRows);
      }
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    const container = tableContainerRef.current;
    if (!container || !hasMore || isLoadingMore || !onLoadMore) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const threshold = 10; // Load more when 10px from bottom
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - threshold;

    if (isNearBottom) {
      onLoadMore();
    }
  }, [hasMore, isLoadingMore, onLoadMore]);

  // Handle wheel events for better infinite scroll detection
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const container = tableContainerRef.current;
      if (!container || !hasMore || isLoadingMore || !onLoadMore) return;

      // Check if scrolling down and at bottom
      if (e.deltaY > 0) {
        const { scrollTop, scrollHeight, clientHeight } = container;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;

        if (isAtBottom) {
          onLoadMore();
        }
      }
    },
    [hasMore, isLoadingMore, onLoadMore],
  );

  useEffect(() => {
    const container = tableContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    container.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScroll);
      container.removeEventListener("wheel", handleWheel);
    };
  }, [handleScroll, handleWheel]);

  const SkeletonRow = () => (
    <TableRow>
      {columns.map((_, colIndex) => (
        <TableCell key={colIndex} className="text-center">
          {colIndex === 0 ? (
            <div className="flex justify-center">
              <Skeleton className="h-4 w-4 rounded" />
            </div>
          ) : colIndex === 1 ? (
            <Skeleton className="h-4 w-32 mx-auto" />
          ) : colIndex === 2 ? (
            <Skeleton className="h-4 w-16 mx-auto" />
          ) : colIndex === 3 ? (
            <Skeleton className="h-4 w-24 mx-auto" />
          ) : colIndex === 4 ? (
            <Skeleton className="h-4 w-20 mx-auto" />
          ) : colIndex === 5 ? (
            <Skeleton className="h-4 w-20 mx-auto" />
          ) : colIndex === 6 ? (
            <Skeleton className="h-4 w-16 mx-auto" />
          ) : colIndex === 7 ? (
            <Skeleton className="h-4 w-12 mx-auto" />
          ) : (
            <div className="flex justify-center">
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          )}
        </TableCell>
      ))}
    </TableRow>
  );

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-4">
        <Input
          placeholder={searchPlaceholder}
          value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(searchKey)?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        {onRefresh && (
          <Button variant="outline" onClick={onRefresh} disabled={isRefreshing}>
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border overflow-hidden">
        <div ref={tableContainerRef} className="max-h-[70vh] overflow-y-auto">
          <Table className="w-full table-fixed">
            <TableHeader className="sticky top-0 bg-background z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="text-center"
                        style={{ width: header.getSize() }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                <>
                  {table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          style={{ width: cell.column.getSize() }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  {isLoadingMore && (
                    <>
                      {Array.from({ length: 3 }).map((_, index) => (
                        <SkeletonRow key={`skeleton-${index}`} />
                      ))}
                    </>
                  )}
                  {!hasMore && table.getRowModel().rows.length > 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-12 text-center text-sm text-muted-foreground"
                      >
                        No more entries to load
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      {table.getFilteredSelectedRowModel().rows.length > 0 && (
        <div className="flex items-center justify-start py-4">
          <div className="text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
        </div>
      )}
    </div>
  );
}
