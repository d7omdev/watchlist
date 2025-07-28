import { useState, useCallback } from "react"
import { toast } from "sonner"
import { apiClient } from "@/lib/api"
import type { EntryFormData } from "@/lib/validations"

export function useEntries() {
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const createEntry = useCallback(async (data: EntryFormData) => {
    setIsCreating(true)
    
    const promise = apiClient.createEntry(data)
    
    toast.promise(promise, {
      loading: `Creating "${data.title}"...`,
      success: `"${data.title}" created successfully!`,
      error: (error) => `Failed to create "${data.title}": ${error.message || 'Unknown error'}`,
    })
    
    try {
      const result = await promise
      return result
    } catch (error) {
      console.error("Error creating entry:", error)
      throw error
    } finally {
      setIsCreating(false)
    }
  }, [])

  const updateEntry = useCallback(async (id: number, data: EntryFormData) => {
    setIsUpdating(true)
    
    const promise = apiClient.updateEntry(id, data)
    
    toast.promise(promise, {
      loading: `Updating "${data.title}"...`,
      success: `"${data.title}" updated successfully!`,
      error: (error) => `Failed to update "${data.title}": ${error.message || 'Unknown error'}`,
    })
    
    try {
      const result = await promise
      return result
    } catch (error) {
      console.error("Error updating entry:", error)
      throw error
    } finally {
      setIsUpdating(false)
    }
  }, [])

  const deleteEntry = useCallback(async (id: number, title?: string) => {
    setIsDeleting(true)
    
    const promise = apiClient.deleteEntry(id)
    
    toast.promise(promise, {
      loading: `Deleting ${title ? `"${title}"` : 'entry'}...`,
      success: `${title ? `"${title}"` : 'Entry'} deleted successfully!`,
      error: (error) => `Failed to delete ${title ? `"${title}"` : 'entry'}: ${error.message || 'Unknown error'}`,
    })
    
    try {
      await promise
    } catch (error) {
      console.error("Error deleting entry:", error)
      throw error
    } finally {
      setIsDeleting(false)
    }
  }, [])

  return {
    createEntry,
    updateEntry,
    deleteEntry,
    isCreating,
    isUpdating,
    isDeleting,
  }
}