'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useSession } from '@/lib/auth-client';
import { updateUserProfile } from '@/lib/user-actions';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  schoolName: z.string().optional(),
  grade: z
    .number()
    .min(1, {
      message: 'Grade must be at least 1.',
    })
    .max(13, {
      message: 'Grade cannot be more than 13.',
    })
    .optional()
    .nullable(),
  phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface UserProfile {
  name: string;
  school: string | null;
  grade: number | null;
  phone: string | null;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile?: UserProfile;
  userId?: string;
}

export function EditProfileModal({ isOpen, onClose, userProfile, userId }: EditProfileModalProps) {
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: userProfile?.name || session?.user?.name || '',
      schoolName: userProfile?.school || '', // Removed session?.user?.school because it doesn't exist
      grade: (userProfile?.grade !== null && userProfile?.grade !== undefined) ? userProfile?.grade : null, // Removed session?.user?.grade because it doesn't exist
      phone: userProfile?.phone || '', // Removed session?.user?.phone because it doesn't exist
    },
  });

  function onSubmit(data: ProfileFormValues) {
    const actualUserId = userId || session?.user?.id;
    if (!actualUserId) {
      toast.error('User not authenticated');
      return;
    }

    startTransition(async () => {
      try {
        const result = await updateUserProfile(actualUserId, {
          name: data.name,
          schoolName: data.schoolName || undefined,
          grade: data.grade || undefined,
          phone: data.phone || undefined,
        });

        if (result.success) {
          toast.success('Profile updated successfully!');
          
          onClose();
          // Refresh the page to get updated data
          window.location.reload();
        } else {
          toast.error(result.error || 'Failed to update profile');
        }
      } catch (error) {
        toast.error('An error occurred while updating profile');
        console.error('Error updating profile:', error);
      }
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="schoolName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School</FormLabel>
                  <FormControl>
                    <Input placeholder="Your school" {...field} value={field.value || ''} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="grade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grade</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Your grade" 
                      {...field} 
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Your phone number" {...field} value={field.value || ''} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}