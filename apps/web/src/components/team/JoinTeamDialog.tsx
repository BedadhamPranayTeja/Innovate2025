import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Ticket } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTeamStore } from "@/stores/teamStore";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";

const joinTeamSchema = z.object({
  inviteCode: z.string().length(6, "Invite code must be 6 characters").toUpperCase(),
  message: z.string().max(200).optional(),
});

type JoinTeamValues = z.infer<typeof joinTeamSchema>;

interface JoinTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefillCode?: string;
}

export function JoinTeamDialog({ open, onOpenChange, prefillCode }: JoinTeamDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { joinTeam } = useTeamStore();
  const { user } = useAuthStore();

  const form = useForm<JoinTeamValues>({
    resolver: zodResolver(joinTeamSchema),
    defaultValues: {
      inviteCode: prefillCode || "",
      message: "",
    },
  });

  const onSubmit = async (values: JoinTeamValues) => {
    if (!user) {
      toast.error("Please log in to join a team");
      return;
    }

    setIsSubmitting(true);
    try {
      await joinTeam(values.inviteCode, user.id, user.name, values.message);
      
      toast.success("Join request sent!", {
        description: "The team leader will review your request.",
      });
      
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error("Team not found", {
        description: "Please check the invite code and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-primary" />
            Join a Team
          </DialogTitle>
          <DialogDescription>
            Enter the 6-character invite code shared by the team leader.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="inviteCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invite Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ABCD12"
                      className="text-center font-mono text-lg tracking-widest uppercase"
                      maxLength={6}
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
                  <FormDescription>
                    The code is case-insensitive
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Hi! I'd love to join your team because..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Introduce yourself to the team leader
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Request to Join
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
