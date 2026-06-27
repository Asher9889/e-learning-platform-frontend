import { Eye, MoreHorizontal, Check, X } from "lucide-react";


import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Admission, AdmissionStatus } from "@/pages/Admissions/types";
import type { Program } from "@/pages/Programs/types";

interface AdmissionTableProps {
 admissions: Admission[];
  programData: Program[];
  onView: (admission: Admission) => void;

  onManualApprove: (admission: Admission) => void;
  onAutoApprove: (admission: Admission) => void;

  onStatusChange: (admission: Admission, status: AdmissionStatus) => void;
}

function statusBadgeClass(status: AdmissionStatus) {
  switch (status) {
    case "APPROVED":
      return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100";
    case "REJECTED":
      return "bg-destructive/10 text-destructive hover:bg-destructive/10";
    default:
      return "bg-amber-100 text-amber-700 hover:bg-amber-100";
  }
}

export function AdmissionTable({
 admissions,
  onView,
  programData,
  onManualApprove,
  onAutoApprove,
  onStatusChange
}: AdmissionTableProps) {
  const getProgramName = (programId: string) => {
    // if(!programData) return;
  const program = programData?.find(
    (item) => item.id === programId 
  );
console.log(program,"asdaghsfdhashdghsagd",programData)
  return program?.name ?? "N/A";
};
  if (admissions.length === 0 ) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
        No admission requests found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>Student</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Mobile</TableHead>
            <TableHead>Applied For</TableHead>
            <TableHead>Applied On</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-14" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {admissions.map((admission, index) => (
            <TableRow
              key={admission.id}
              className="hover:bg-muted/40 odd:bg-background even:bg-muted/20"
            >
              <TableCell className="font-medium text-muted-foreground">
                {index + 1}
              </TableCell>
              <TableCell>
                <span className="font-semibold">
                  {admission.personal.fullName}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {admission.personal.email}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {admission.personal.mobile}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {getProgramName(admission?.programId)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(admission.createdAt).toLocaleDateString("en-IN")}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={statusBadgeClass(admission.status)}
                >
                  {admission.status}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-xs">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-36">
                    <DropdownMenuItem onClick={() => onView(admission)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem
                       onClick={() => onAutoApprove(admission)}
                      disabled={admission.status === "APPROVED"}
                      className="text-emerald-600 focus:text-emerald-700"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Auto Approve
                    </DropdownMenuItem>

                    <DropdownMenuItem
                     onClick={() => onManualApprove(admission)}
                      disabled={admission.status === "APPROVED"}
                      className="text-emerald-600 focus:text-emerald-700"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Assign Batch & Approve
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onStatusChange(admission, "REJECTED")}
                      disabled={admission.status === "REJECTED"}
                      className="text-destructive focus:text-destructive"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Reject
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}