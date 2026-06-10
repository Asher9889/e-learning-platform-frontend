import { useState } from "react";

import { Button } from "@/components/ui/button";

import { Plus } from "lucide-react";


import { dummyClasses } from "./data/classes";
import type { IClass } from "@/constants/user/user.constant";
import type { AddClassFormData } from "./schema/class.schema";
import { ClassesTable } from "#components/class/ClassesTable";
import AddClassDialog from "#components/class/AddClassDialog";

export default function ClassesPage() {
  const [classes, setClasses] =
    useState<IClass[]>(dummyClasses);

  const [open, setOpen] =
    useState(false);

  const handleAddClass = (
    values: AddClassFormData
  ) => {
    const totalStrength =
      values.sectionA +
      values.sectionB;

    const newClass: IClass = {
      id: crypto.randomUUID(),

      className: values.className,

      strength: totalStrength,

      sections: [
        {
          id: crypto.randomUUID(),
          sectionName: "A",
          strength: values.sectionA,
        },
        {
          id: crypto.randomUUID(),
          sectionName: "B",
          strength: values.sectionB,
        },
      ],
    };

    setClasses((prev) => [
      ...prev,
      newClass,
    ]);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            Classes &
            Sections
          </h1>

          <p className="text-muted-foreground">
            Manage classes and
            strength
          </p>
        </div>

        <Button
          onClick={() =>
            setOpen(true)
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Class
        </Button>
      </div>

      <ClassesTable
        data={classes}
      />

      <AddClassDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleAddClass}
      />
    </div>
  );
}