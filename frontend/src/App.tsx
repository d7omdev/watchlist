import { useState } from "react";
import { EntryForm, EntriesDataTable } from "@/components/entries";
import { ProfileSettings } from "@/components/profile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { EntryFormData } from "@/lib/validations";
import type { Entry } from "@/types/entry";
import { ThemeProvider, Header } from "@/components/layout";
import { AuthWrapper } from "@/components/auth";
import { useEntries } from "@/hooks/use-entries";
import { Toaster } from "@/components/ui/sonner";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";
import { User } from "lucide-react";

function App() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { createEntry, updateEntry, isCreating, isUpdating } = useEntries();

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const response = await apiClient.uploadImage(file);
      return response.imageUrl;
    } catch (error) {
      toast.error("Failed to upload image");
      throw error;
    }
  };

  const handleAddEntry = async (data: EntryFormData) => {
    try {
      await createEntry(data);
      setShowAddForm(false);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Error creating entry:", error);
    }
  };

  const handleEditEntry = async (data: EntryFormData) => {
    if (!editingEntry) return;

    try {
      await updateEntry(editingEntry.id, data);
      setEditingEntry(null);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Error updating entry:", error);
    }
  };

  const handleProfileUpdate = () => {
    // The header will automatically refresh from localStorage
    // We could also trigger a refresh here if needed
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthWrapper>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto py-8 px-4">
            <Header
              onAddClick={() => setShowAddForm(true)}
              onProfileClick={() => setShowProfileSettings(true)}
            />

            <div className="space-y-8">
              <EntriesDataTable
                onEdit={setEditingEntry}
                refreshTrigger={refreshTrigger}
              />
            </div>

            {/* Add Entry Dialog */}
            <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Entry</DialogTitle>
                </DialogHeader>
                <EntryForm
                  title="Add New Movie or TV Show"
                  onSubmit={handleAddEntry}
                  isLoading={isCreating}
                  onImageUpload={handleImageUpload}
                />
              </DialogContent>
            </Dialog>

            {/* Edit Entry Dialog */}
            <Dialog
              open={!!editingEntry}
              onOpenChange={() => setEditingEntry(null)}
            >
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Entry</DialogTitle>
                </DialogHeader>
                {editingEntry && (
                  <EntryForm
                    title="Edit Movie or TV Show"
                    onSubmit={handleEditEntry}
                    initialData={editingEntry}
                    isLoading={isUpdating}
                    onImageUpload={handleImageUpload}
                  />
                )}
              </DialogContent>
            </Dialog>

            {/* Profile Settings Dialog */}
            <Dialog
              open={showProfileSettings}
              onOpenChange={setShowProfileSettings}
            >
              <DialogContent className="max-w-md px-10 py-8">
                <DialogHeader className="flex flex-row gap-2 text-xl items-center font-semibold">
                  <User className="h-5 w-5" />
                  <span>Profile Settings</span>
                </DialogHeader>
                <ProfileSettings
                  onClose={() => setShowProfileSettings(false)}
                  onProfileUpdate={handleProfileUpdate}
                />
              </DialogContent>
            </Dialog>
          </div>
          <Toaster />
        </div>
      </AuthWrapper>
    </ThemeProvider>
  );
}
export default App;
