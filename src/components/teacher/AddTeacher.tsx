import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import TeacherEnrollForm from "./TeacherEnrollForm";

export default function AddTeacher() {
  const navigate = useNavigate();

  return (
    <div className="container max-w-6xl mx-auto py-6 px-4">
      <div className="flex gap-2">


        <Button
          variant="ghost"
          onClick={() => navigate("/teachers")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />

        </Button>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Add New Teacher
          </h1>

          <p className="text-muted-foreground mt-2">
            Create a new student account and
            assign academic details.
          </p>
        </div>
      </div>

      <TeacherEnrollForm />
    </div>
  );
}