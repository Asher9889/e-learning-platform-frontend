import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Loader2 } from "lucide-react";
import { createGroupStudyRoomSchema, type TCreateGroupStudyRoomForm } from "../schemas/group-study.schema";
import { useCreateGroupStudyRoom } from "../hooks/use-group-study";
import { MultiSelect } from "@/components/ui/MultiSelect";
type Option = {
  value: string;
  label: string;
};

interface CreateRoomDialogProps {
  studentOptions: Option[];
}

export function CreateRoomDialog({
  studentOptions,
}: CreateRoomDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutate: createRoom, isPending } = useCreateGroupStudyRoom();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TCreateGroupStudyRoomForm>({
    resolver: zodResolver(createGroupStudyRoomSchema),
    defaultValues: {
      name: "",
      description: "",
      subject: "",
      isPrivate: true,
      memberIds: [],
    },
  });

  const isPrivate = watch("isPrivate");

  const onSubmit = (values: TCreateGroupStudyRoomForm) => {
    createRoom(values, {
      onSuccess: () => {
        reset();
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-1.5 h-4 w-4" />
          New Room
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Study Room</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Room Name</Label>
            <Input id="name" placeholder="DSA Group Study" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="subject">Subject (optional)</Label>
            <Input id="subject" placeholder="Data Structures" {...register("subject")} />
            {errors.subject && <p className="text-xs text-destructive">{errors.subject.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              rows={3}
              placeholder="What will you study in this room?"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Members</Label>

            <MultiSelect
              options={studentOptions}
              value={watch("memberIds")}
              onChange={(value) =>
                setValue("memberIds", value, {
                  shouldValidate: true,
                })
              }
              placeholder="Select students..."
            />

            {errors.memberIds && (
              <p className="text-xs text-destructive">
                {errors.memberIds.message}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <div className="space-y-0.5">
              <Label htmlFor="isPrivate">Private Room</Label>
              <p className="text-xs text-muted-foreground">
                Only invited members can join a private room
              </p>
            </div>
            <Switch
              id="isPrivate"
              checked={isPrivate}
              onCheckedChange={(checked) => setValue("isPrivate", checked)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
              Create Room
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
