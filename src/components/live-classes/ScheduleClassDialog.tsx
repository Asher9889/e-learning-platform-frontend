import { useState } from "react";
import { CalendarPlus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ScheduleClassDialog({
  onAddClass,
}: any) {
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    startTime: "",
    endTime: "",
    maxStudents: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onAddClass(formData); // 🔥 send to parent

    setFormData({
      title: "",
      date: "",
      time: "",
      startTime: "",
      endTime: "",
      maxStudents: "",
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <CalendarPlus className="mr-2 h-4 w-4" />
          Schedule Class
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader className="space-y-2">
          <DialogTitle>
            Schedule Live Class
          </DialogTitle>

          <DialogDescription>
            Set up a new live session and define student capacity.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 py-2"
        >
          {/* Title */}
          <div className="space-y-2">
            <Label>Class Title</Label>
            <Input
              placeholder="e.g. React Advanced Masterclass"
              value={formData.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  title: e.target.value,
                })
              }
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label>Date</Label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  date: e.target.value,
                })
              }
            />
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Input
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    startTime: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>End Time</Label>
              <Input
                type="time"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    endTime: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* Student Strength */}
          <div className="space-y-2">
            <Label>
              Maximum Students (Capacity)
            </Label>

            <Input
              type="number"
              min={1}
              placeholder="e.g. 50"
              value={formData.maxStudents}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  maxStudents: e.target.value,
                })
              }
            />
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit">
              Schedule Class
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}