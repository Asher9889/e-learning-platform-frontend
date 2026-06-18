import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "#components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "#components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "#components/ui/card";
import { useGetStudent } from "@/pages/Student/hooks/useGetStudent";
import { useUpdateStudent } from "@/pages/Student/hooks/useStudentMutations";
import { useGetPrograms } from "@/pages/Programs/hooks/useGetPrograms";
import { useGetBatches } from "@/pages/Batches/hooks/useGetBatches";

export default function EditStudentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: fetchRes, isLoading: loadingStudent } = useGetStudent(id!);
  const { mutate: update, isPending: saving } = useUpdateStudent();

  const student = fetchRes?.data;

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      email: "",
      phoneNumber: "",
      personalInfo: {
        name: "",
        dateOfBirth: "",
        gender: "MALE",
      },
      personalInfoAddress: {
        line1: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
      },
      roleInfo: {
        programId: "",
        batchId: "",
        rollNumber: "",
        admissionDate: "",
        guardianName: "",
        guardianPhoneNumber: "",
      },
    },
  });

  const { data: programData } = useGetPrograms();
  const programs = programData?.programs || [];

  const selectedProgram = watch("roleInfo.programId");
  const { data: batchesData } = useGetBatches(selectedProgram || undefined);
  const batches = batchesData?.batches || [];

  useEffect(() => {
    if (!student) return;
    reset({
      email: student.email || "",
      phoneNumber: student.phoneNumber || "",
      personalInfo: {
        name: student.personalInfo?.name || "",
        dateOfBirth: student.personalInfo?.dateOfBirth || "",
        gender: student.personalInfo?.gender || "MALE",
      },
      personalInfoAddress: {
        line1: student.personalInfo?.address?.line1 || "",
        city: student.personalInfo?.address?.city || "",
        state: student.personalInfo?.address?.state || "",
        country: student.personalInfo?.address?.country || "",
        zipCode: student.personalInfo?.address?.zipCode || "",
      },
      roleInfo: {
        programId: student.roleInfo?.programId || "",
        batchId: student.roleInfo?.batchId || "",
        rollNumber: student.roleInfo?.rollNumber || "",
        admissionDate: student.roleInfo?.admissionDate
          ? student.roleInfo.admissionDate.split("T")[0]
          : "",
        guardianName: student.roleInfo?.guardianName || "",
        guardianPhoneNumber: student.roleInfo?.guardianPhoneNumber || "",
      },
    });
  }, [student, reset]);

  const onSubmit = (formData: Record<string, any>) => {
    const payload: Record<string, unknown> = {
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      personalInfo: {
        name: formData.personalInfo.name,
        dateOfBirth: formData.personalInfo.dateOfBirth,
        gender: formData.personalInfo.gender,
        ...(formData.personalInfoAddress.city && {
          address: {
            line1: formData.personalInfoAddress.line1,
            city: formData.personalInfoAddress.city,
            state: formData.personalInfoAddress.state,
            country: formData.personalInfoAddress.country,
            zipCode: formData.personalInfoAddress.zipCode,
          },
        }),
      },
      roleInfo: {
        rollNumber: formData.roleInfo.rollNumber,
        batchId: formData.roleInfo.batchId,
        admissionDate: formData.roleInfo.admissionDate,
        guardianName: formData.roleInfo.guardianName,
        guardianPhoneNumber: formData.roleInfo.guardianPhoneNumber,
      },
    };

    update(
      { id: id!, data: payload },
      { onSuccess: () => navigate("/student") }
    );
  };

  if (loadingStudent) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="container max-w-4xl mx-auto py-6 px-4">
        <div className="text-center text-muted-foreground py-12">
          Student not found
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon-sm" onClick={() => navigate("/student")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold leading-tight">Edit Student</h1>
              <p className="text-sm text-muted-foreground leading-tight">
                {student.personalInfo?.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="container max-w-4xl mx-auto px-4 py-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" {...register("email")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" {...register("phoneNumber")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...register("personalInfo.name")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" type="date" {...register("personalInfo.dateOfBirth")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                className="border w-full rounded-md px-3 h-9 text-sm"
                {...register("personalInfo.gender")}
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" {...register("personalInfoAddress.line1")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register("personalInfoAddress.city")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" {...register("personalInfoAddress.state")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" {...register("personalInfoAddress.country")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zip">Zip Code</Label>
              <Input id="zip" {...register("personalInfoAddress.zipCode")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Academic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Program</Label>
              <Select
                value={watch("roleInfo.programId")}
                onValueChange={(v) => {
                  setValue("roleInfo.programId", v);
                  setValue("roleInfo.batchId", "");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Program" />
                </SelectTrigger>
                <SelectContent>
                  {programs.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="roll">Roll Number</Label>
              <Input id="roll" {...register("roleInfo.rollNumber")} />
            </div>
            <div className="space-y-2">
              <Label>Batch</Label>
              <Select
                value={watch("roleInfo.batchId")}
                onValueChange={(v) => setValue("roleInfo.batchId", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedProgram ? "Select Batch" : "Select Program first"} />
                </SelectTrigger>
                <SelectContent>
                  {batches.map((b) => (
                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="admission">Admission Date</Label>
              <Input id="admission" type="date" {...register("roleInfo.admissionDate")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Guardian Information</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guardian">Guardian Name</Label>
              <Input id="guardian" {...register("roleInfo.guardianName")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guardianPhone">Guardian Phone</Label>
              <Input id="guardianPhone" {...register("roleInfo.guardianPhoneNumber")} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate("/student")}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </div>
          </form>
        </div>
      </div>
    </div>
  );
}
