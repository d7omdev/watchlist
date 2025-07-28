import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { entryFormSchema } from '@/lib/validations';
import type { EntryFormData } from '@/lib/validations';
import type { Entry } from '@/types/entry';
import { useState } from 'react';
import { getImageUrl } from '@/lib/utils';

interface EntryFormProps {
  onSubmit: (data: EntryFormData) => void;
  initialData?: Entry;
  isLoading?: boolean;
  title: string;
  onImageUpload?: (file: File) => Promise<string>;
}

export function EntryForm({ onSubmit, initialData, isLoading, title, onImageUpload }: EntryFormProps) {
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [imagePreview, setImagePreview] = useState(initialData?.imageUrl || '');
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EntryFormData>({
    resolver: zodResolver(entryFormSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      type: initialData.type,
      director: initialData.director,
      budget: initialData.budget,
      location: initialData.location,
      duration: initialData.duration,
      yearTime: initialData.yearTime,
      description: initialData.description || '',
    } : {
      type: 'Movie',
    },
  });

  const handleFormSubmit = (data: EntryFormData) => {
    onSubmit({ ...data, imageUrl });
    if (!initialData) {
      reset();
      setImageUrl('');
      setImagePreview('');
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageUpload) {
      const url = await onImageUpload(file);
      setImageUrl(url);
      setImagePreview(url);
    } else if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Enter title"
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                {...register('type')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Movie">Movie</option>
                <option value="TV Show">TV Show</option>
              </select>
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="director">Director</Label>
              <Input
                id="director"
                {...register('director')}
                placeholder="Enter director name"
              />
              {errors.director && (
                <p className="text-sm text-red-500">{errors.director.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget</Label>
              <Input
                id="budget"
                {...register('budget')}
                placeholder="e.g., $160M, $3M/ep"
              />
              {errors.budget && (
                <p className="text-sm text-red-500">{errors.budget.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                {...register('location')}
                placeholder="e.g., LA, Paris"
              />
              {errors.location && (
                <p className="text-sm text-red-500">{errors.location.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                {...register('duration')}
                placeholder="e.g., 148 min, 49 min/ep"
              />
              {errors.duration && (
                <p className="text-sm text-red-500">{errors.duration.message}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="yearTime">Year/Time</Label>
              <Input
                id="yearTime"
                {...register('yearTime')}
                placeholder="e.g., 2010, 2008-2013"
              />
              {errors.yearTime && (
                <p className="text-sm text-red-500">{errors.yearTime.message}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <textarea
                id="description"
                {...register('description')}
                placeholder="Enter description"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="image">Image (Optional)</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <img src={imagePreview.startsWith('http') ? imagePreview : getImageUrl(imagePreview)} alt="Preview" className="mt-2 rounded-md max-h-40" />
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : initialData ? 'Update Entry' : 'Add Entry'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}