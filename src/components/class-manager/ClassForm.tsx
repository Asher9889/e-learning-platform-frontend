import { useState } from "react";
import type { Class, CreateClassInput, UpdateClassInput } from "@/pages/Classes/types/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface ClassFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateClassInput | UpdateClassInput) => void;
  classData?: Class | null;
  isLoading?: boolean;
}

const GRADES = [
  "1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade",
  "6th Grade", "7th Grade", "8th Grade", "9th Grade", "10th Grade",
  "11th Grade", "12th Grade", "Undergraduate", "Postgraduate",
];

const ACADEMIC_YEARS = [
  "2024-2025", "2025-2026", "2026-2027", "2027-2028",
];

export function ClassForm({
  isOpen,
  onClose,
  onSubmit,
  classData,
  isLoading = false,
}: ClassFormProps) {
  const isEditing = !!classData;
  const [name, setName] = useState(classData?.name || "");
  const [description, setDescription] = useState(classData?.description || "");
  const [grade, setGrade] = useState(classData?.grade || "");
  const [academicYear, setAcademicYear] = useState(classData?.academicYear || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Class name is required";
    if (!grade) newErrors.grade = "Grade is required";
    if (!academicYear) newErrors.academicYear = "Academic year is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditing && classData) {
      onSubmit({
        id: classData.id,
        name: name.trim(),
        description: description.trim(),
        grade,
        academicYear,
      });
    } else {
      onSubmit({
        name: name.trim(),
        description: description.trim(),
        grade,
        academicYear,
      });
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setName("");
      setDescription("");
      setGrade("");
      setAcademicYear("");
      setErrors({});
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Class" : "Create New Class"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the class information below."
                : "Set up a new class with its basic details."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="class-name">
                Class Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="class-name"
                placeholder="e.g., Computer Science"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                }}
                disabled={isLoading}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>
                  Grade <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={grade}
                  onValueChange={(value) => {
                    setGrade(value);
                    if (errors.grade) setErrors((prev) => ({ ...prev, grade: "" }));
                  }}
                  disabled={isLoading}
                >
                  <SelectTrigger className={errors.grade ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADES.map((g) => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.grade && (
                  <p className="text-xs text-destructive">{errors.grade}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label>
                  Academic Year <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={academicYear}
                  onValueChange={(value) => {
                    setAcademicYear(value);
                    if (errors.academicYear) setErrors((prev) => ({ ...prev, academicYear: "" }));
                  }}
                  disabled={isLoading}
                >
                  <SelectTrigger className={errors.academicYear ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACADEMIC_YEARS.map((y) => (
                      <SelectItem key={y} value={y}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.academicYear && (
                  <p className="text-xs text-destructive">{errors.academicYear}</p>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="class-description">Description</Label>
              <Textarea
                id="class-description"
                placeholder="Brief description of the class curriculum..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update Class" : "Create Class"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
