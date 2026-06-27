import { useState } from "react";
import { Search, GraduationCap, Loader2 } from "lucide-react";

import type { Admission, AdmissionStatus } from "./types";

import { Input } from "@/components/ui/input";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useGetAdmissions } from "./hooks/useGetAdmissions";
import { useUpdateAdmissionStatus } from "./hooks/useUpdateAdmissionStatus";
import { AdmissionTable } from "#components/admission-manager/Admissiontable";
import { AdmissionDetailDialog } from "#components/admission-manager/Admissiondetaildialog";
import { useGetPrograms } from "../Programs/hooks/useGetPrograms";
import type { Program } from "../Programs/types";
import { BatchAssignDialog } from "#components/admission-manager/BatchAssignDialog";
import { useGetBatches } from "../Batches/hooks/useGetBatches";
import { useAssignBatch } from "./hooks/useAssignBatch";

export default function AdmissionsPage() {
  const [manualAdmission, setManualAdmission] =
  useState<Admission | null>(null);
  const [open, setOpen] = useState(false);

const { data: batchData } = useGetBatches(
  manualAdmission?.programId
);

const batches = batchData?.batches ?? [];
console.log(batches,"batchesbatches")
const {
  assignBatchAsync,
  isAssigning,
} = useAssignBatch();
  const { data: admissionData, isLoading } = useGetAdmissions();
  const { data, isLoading: loading } = useGetPrograms();
  const programData: Program[] = data?.programs ?? [];
  const admissions: Admission[] = admissionData?.admissions ?? [];
  const { updateAdmissionStatusAsync, isUpdating } =
    useUpdateAdmissionStatus();

  const [searchQuery, setSearchQuery] = useState("");
  const [viewingAdmission, setViewingAdmission] = useState<Admission | null>(
    null,
  );
  const [pendingAction, setPendingAction] = useState<{
    admission: Admission;
    status: AdmissionStatus;
  } | null>(null);


  const handleAutoApprove = (admission: Admission) => {
    requestStatusChange(admission, "APPROVED");
  };


  const handleManualApprove = (admission: Admission) => {
    setManualAdmission(admission);
    setOpen(true)
  };
  const filteredAdmissions = admissions.filter((a) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.personal.fullName.toLowerCase().includes(q) ||
      a.personal.email.toLowerCase().includes(q) ||
      a.personal.mobile.toLowerCase().includes(q) ||
      a.status.toLowerCase().includes(q)
    );
  });

  const requestStatusChange = (admission: Admission, status: AdmissionStatus) => {
    setPendingAction({ admission, status });
  };

  const confirmStatusChange = async () => {
    if (!pendingAction) return;

    console.log(pendingAction, "pendingAction")
    try {
      await updateAdmissionStatusAsync({
        id: pendingAction.admission.id,
        status: pendingAction.status,
      });
      setPendingAction(null);
      // Keep the detail dialog in sync if it's open for the same admission
      setViewingAdmission((prev) =>
        prev && prev.id === pendingAction.admission.id
          ? { ...prev, status: pendingAction.status }
          : prev,
      );
    } catch {
      /* toast handles it */
    }
  };

  const actionVerb = pendingAction?.status === "APPROVED" ? "approve" : "reject";
  console.log(programData, "programData1231321", loading)

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-card/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Admissions
                </h1>
                <p className="text-xs text-muted-foreground">
                  {admissions.length}{" "}
                  {admissions.length === 1 ? "request" : "requests"} total
                </p>
              </div>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search admissions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-9"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {isLoading || loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <AdmissionTable
            admissions={filteredAdmissions}
            programData={programData}
            onView={setViewingAdmission}
            onManualApprove={handleManualApprove}
            onAutoApprove={handleAutoApprove}
            onStatusChange={requestStatusChange}
          />
        )}
      </main>

      <BatchAssignDialog
  open={!!open}
  admission={manualAdmission}
  batches={batches}
  loading={false}
  assigning={isAssigning}
  onClose={() => setOpen(false)}
  onAssign={async (batchId) => {
    if (!manualAdmission) return;

    await assignBatchAsync({
      admissionId: manualAdmission.id,
      batchId,
    });

    setManualAdmission(null);
    setOpen(false)
  }}
/>
      <AdmissionDetailDialog
        admission={viewingAdmission}
        isOpen={!!viewingAdmission}
        onClose={() => setViewingAdmission(null)}
        onStatusChange={(status) => {
          if (viewingAdmission) {
            requestStatusChange(viewingAdmission, status);
          }
        }}
        onManualApprove={handleManualApprove}
        onAutoApprove={handleAutoApprove}
        isUpdating={isUpdating}
      />

      <AlertDialog
        open={!!pendingAction}
        onOpenChange={() => setPendingAction(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingAction?.status === "APPROVED"
                ? "Approve Admission"
                : "Reject Admission"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {actionVerb} the admission request from{" "}
              <strong>{pendingAction?.admission.personal.fullName}</strong>?
              This action will update the student&apos;s application status.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmStatusChange}
              disabled={isUpdating}
              className={
                pendingAction?.status === "REJECTED"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
              }
            >
              {isUpdating
                ? "Updating..."
                : pendingAction?.status === "APPROVED"
                  ? "Approve"
                  : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}