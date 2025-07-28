import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DataTable, createColumns } from "@/components/data-table";
import type { Entry } from "@/types/entry";
import { apiClient } from "@/lib/api";

interface EntriesDataTableProps {
  onEdit: (entry: Entry) => void;
  refreshTrigger: number;
}

export function EntriesDataTable({
  onEdit,
  refreshTrigger,
}: EntriesDataTableProps) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    entry: Entry | null;
  }>({
    open: false,
    entry: null,
  });
  const loadingRef = useRef(false);

  const loadEntries = useCallback(
    async (pageNum: number, reset = false, limit = pageSize) => {
      if (loadingRef.current) return;

      loadingRef.current = true;
      setLoading(true);
      try {
        const response = await apiClient.getEntries(pageNum, limit);

        setEntries((prev) =>
          reset ? response.data : [...prev, ...response.data],
        );
        setHasMore(response.pagination.hasMore);
        setPage(pageNum);
      } catch (error) {
        console.error("Error loading entries:", error);
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [pageSize],
  );

  useEffect(() => {
    loadEntries(1, true, pageSize);
  }, [refreshTrigger, loadEntries, pageSize]);

  const handleDelete = async (entry: Entry) => {
    setDeleteDialog({ open: true, entry });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.entry) return;

    const entry = deleteDialog.entry;
    const entryId = entry.id;
    setDeletingIds((prev) => new Set(prev).add(entryId));

    const promise = apiClient.deleteEntry(entryId);

    toast.promise(promise, {
      loading: `Deleting "${entry.title}"...`,
      success: `"${entry.title}" deleted successfully!`,
      error: (error) =>
        `Failed to delete "${entry.title}": ${error.message || "Unknown error"}`,
    });

    try {
      await promise;
      setEntries((prev) => prev.filter((e) => e.id !== entryId));
      setDeleteDialog({ open: false, entry: null });
    } catch (error) {
      console.error("Error deleting entry:", error);
    } finally {
      setDeletingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(entryId);
        return newSet;
      });
    }
  };

  const handleRowSelection = () => {
    // Just store selected entries, don't delete immediately
    // You could add bulk actions here later if needed
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadEntries(1, true, pageSize);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
    setHasMore(true);
    loadEntries(1, true, newPageSize);
  };

  const columns = createColumns(onEdit, handleDelete, deletingIds);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Movies & TV Shows</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={entries}
            searchKey="title"
            searchPlaceholder="Search titles..."
            isLoading={loading && entries.length === 0}
            onRowSelectionChange={handleRowSelection}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
            hasMore={hasMore}
            onLoadMore={() => loadEntries(page + 1, false, pageSize)}
            isLoadingMore={loading && entries.length > 0}
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
          />
        </CardContent>
      </Card>

      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, entry: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteDialog.entry?.title}"?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, entry: null })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={
                deleteDialog.entry
                  ? deletingIds.has(deleteDialog.entry.id)
                  : false
              }
            >
              {deleteDialog.entry && deletingIds.has(deleteDialog.entry.id)
                ? "Deleting..."
                : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

