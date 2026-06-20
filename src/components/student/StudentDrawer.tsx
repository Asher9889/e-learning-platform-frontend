import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "#components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "#components/ui/avatar";
import { Separator } from "#components/ui/separator";
import { ScrollArea } from "#components/ui/scroll-area";
import type { StudentDataFromApi } from "@/pages/Student/schema/student.schema";
import {
  Mail,
  Phone,
  Calendar,
  Hash,
  UserCog,
  MapPin,
  BookOpen,
  Users,
} from "lucide-react";

interface Props {
  student: StudentDataFromApi | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudentDrawer({ student, open, onOpenChange }: Props) {
  if (!student) return null;

  const infoRows = [
    { icon: Mail, label: "Email", value: student.email },
    { icon: Phone, label: "Phone", value: student.phoneNumber },
    { icon: BookOpen, label: "Program", value: student.roleInfo?.programName || "-" },
    { icon: Users, label: "Batch", value: student.roleInfo?.batchName || "-" },
    { icon: Hash, label: "Roll Number", value: student.roleInfo?.rollNumber || "-" },
    { icon: Calendar, label: "Admission Date", value: student.roleInfo?.admissionDate || "-" },
    { icon: UserCog, label: "Guardian", value: student.roleInfo?.guardianName || "-" },
    { icon: Phone, label: "Guardian Phone", value: student.roleInfo?.guardianPhoneNumber || "-" },
  ];

  const address = student.personalInfo?.address;
  const hasAddress = address && (address.line1 || address.city || address.state || address.country);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0">
        <SheetHeader className="px-6 pt-6 pb-0">
          <SheetTitle>Student Profile</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 h-[calc(100vh-80px)] px-6 pb-6">
          <div className="flex flex-col items-center py-6">
            <Avatar className="h-20 w-20 border-2">
              <AvatarImage src={student.personalInfo?.profileImage || ""} />
              <AvatarFallback className="text-lg">
                {student.personalInfo?.name?.charAt(0)?.toUpperCase() || "S"}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-lg font-semibold mt-3">{student.personalInfo?.name}</h2>
            <Badge
              variant={student.status === "ACTIVE" ? "default" : "secondary"}
              className="mt-1"
            >
              {student.status}
            </Badge>
          </div>

          <Separator />

          <div className="py-4 space-y-4">
            {infoRows.map((row) => (
              <div key={row.label} className="flex items-start gap-3">
                <row.icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{row.label}</p>
                  <p className="text-sm font-medium truncate">{row.value}</p>
                </div>
              </div>
            ))}

            {hasAddress && (
              <>
                <Separator />
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Address</p>
                    <p className="text-sm font-medium">
                      {[address.line1, address.city, address.state, address.country, address.zipCode]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
