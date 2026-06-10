import { useState } from "react";
import type { Section, CreateSectionInput, UpdateSectionInput } from "@/pages/Classes/types/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface SectionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSectionInput | UpdateSectionInput) => void;
  classId: string;
  section?: Section | null;
  isLoading?: boolean;
}

export function SectionForm({
  isOpen,
  onClose,
  onSubmit,
  classId,
  section,
  isLoading = false,
}: SectionFormProps) {
  const isEditing = !!section;
  const [name, setName] = useState(section?.name || "");
  const [strength, setStrength] = useState(section?.strength?.toString() || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Section name is required";
    if (!strength.trim()) {
      newErrors.strength = "Strength is required";
    } else if (isNaN(Number(strength)) || Number(strength) < 0) {
      newErrors.strength = "Strength must be a positive number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditing && section) {
      onSubmit({
        id: section.id,
        classId,
        name: name.trim(),
        strength: Number(strength),
      });
    } else {
      onSubmit({
        classId,
        name: name.trim(),
        strength: Number(strength),
      });
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setName("");
      setStrength("");
      setErrors({});
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Section" : "Add New Section"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the section details below."
                : "Add a new section to this class with student strength."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="section-name">
                Section Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="section-name"
                placeholder="e.g., Section A"
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

            <div className="grid gap-2">
              <Label htmlFor="section-strength">
                Student Strength <span className="text-destructive">*</span>
              </Label>
              <Input
                id="section-strength"
                type="number"
                min="0"
                placeholder="e.g., 30"
                value={strength}
                onChange={(e) => {
                  setStrength(e.target.value);
                  if (errors.strength) setErrors((prev) => ({ ...prev, strength: "" }));
                }}
                disabled={isLoading}
                className={errors.strength ? "border-destructive" : ""}
              />
              {errors.strength && (
                <p className="text-xs text-destructive">{errors.strength}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update Section" : "Add Section"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
