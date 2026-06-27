import {

  User,
  FileText,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Admission, AdmissionStatus } from "@/pages/Admissions/types";

interface AdmissionDetailDialogProps {
  admission: Admission | null;
  isOpen: boolean;
  onClose: () => void;
  onManualApprove: (admission: Admission) => void;
  onAutoApprove: (admission: Admission) => void;
  onStatusChange: (status: AdmissionStatus) => void;
  isUpdating?: boolean;
}

/**
 * A single document chip — pill-shaped, hairline border, opens in new tab.
 */
function DocLink({
  icon: Icon,
  label,
  url,
}: {
  icon: typeof FileText;
  label: string;
  url: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
    >
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
      <span className="truncate">{label}</span>
      <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" />
    </a>
  );
}

/**
 * A label/value pair used inside the personal-details grid.
 * Label is always a muted 12px caption; value is 14px medium.
 */
function DetailItem({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 break-words text-sm text-foreground">{value}</p>
    </div>
  );
}

/**
 * Section eyebrow label — replaces heavy h3 headers with a quiet
 * uppercase-tracking caption, consistent with the minimal direction.
 */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground">
      {children}
    </p>
  );
}

function statusBadgeClass(status: AdmissionStatus) {
  switch (status) {
    case "APPROVED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "REJECTED":
      return "bg-destructive/5 text-destructive border-destructive/20";
    default:
      return "bg-amber-50 text-amber-700 border-amber-200";
  }
}

function statusLabel(status: AdmissionStatus) {
  switch (status) {
    case "APPROVED":
      return "Approved";
    case "REJECTED":
      return "Rejected";
    default:
      return "Pending";
  }
}

export function AdmissionDetailDialog({
  admission,
  isOpen,
  onClose,
  onStatusChange,
  onManualApprove,
  onAutoApprove,
  isUpdating,
}: AdmissionDetailDialogProps) {
  if (!admission) return null;

  const { personal, academics, documents, status, createdAt } = admission;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/*
        DialogContent (shadcn/ui default) already renders a close button
        in the top-right corner via DialogPrimitive.Close — no need to add
        one manually. Just make sure custom header content doesn't cover
        that corner: pr-8 below reserves space for it.
      */}
      <DialogContent className="flex max-h-[88vh] w-[calc(100vw-2rem)] max-w-xl flex-col gap-0 overflow-hidden rounded-xl p-0 sm:w-full">
        {/* Header */}
        <DialogHeader className="border-b border-border px-6 py-5 pr-10">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
                {documents.photo ? (
                  <img
                    src={documents.photo}
                    alt={personal.fullName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0">
                <DialogTitle className="truncate text-base font-medium sm:text-lg">
                  {personal.fullName}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground sm:text-sm">
                  Submitted {new Date(createdAt).toLocaleDateString("en-IN")}
                </DialogDescription>
              </div>
            </div>
            <Badge
              variant="outline"
              className={`shrink-0 font-medium ${statusBadgeClass(status)}`}
            >
              {statusLabel(status)}
            </Badge>
          </div>
        </DialogHeader>

        {/* Scrollable body */}
        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
          {/* Personal Details */}
          <section>
            <SectionLabel>Personal details</SectionLabel>
            <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
              <DetailItem label="Father's name" value={personal.fatherName} />
              <DetailItem label="Mother's name" value={personal.motherName} />
              <DetailItem label="Email" value={personal.email} />
              <DetailItem label="Mobile" value={personal.mobile} />
              <DetailItem label="Gender" value={personal.gender} />
              <DetailItem
                label="Date of birth"
                value={new Date(personal.dob).toLocaleDateString("en-IN")}
              />
              <DetailItem
                label="Address"
                className="sm:col-span-2"
                value={[
                  personal.address?.line1,
                  personal.address?.city,
                  personal.address?.state,
                  personal.address?.zipCode,
                ]
                  .filter(Boolean)
                  .join(", ")}
              />
            </div>
          </section>

          <Separator />

          {/* Academics */}
          <section>
            <SectionLabel>Academic records</SectionLabel>
            <div className="space-y-2">
              {academics.map((a, idx) => (
                <div
                  key={idx}
                  className="rounded-md border border-border px-3.5 py-3"
                >
                  <p className="text-sm font-medium text-foreground">
                    {a.qualification}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {a.boardOrUniversity} · {a.institutionName} ·{" "}
                    {a.passingYear} · {a.percentage}%
                  </p>
                </div>
              ))}
            </div>
          </section>

          <Separator />

          {/* Documents */}
          <section>
            <SectionLabel>Documents</SectionLabel>
            <div className="flex flex-wrap gap-2">
              <DocLink icon={ImageIcon} label="Photo" url={documents.photo} />
              <DocLink icon={FileText} label="Aadhaar" url={documents.aadhaar} />
              <DocLink
                icon={FileText}
                label="Marksheet"
                url={documents.marksheet}
              />
            </div>
          </section>
        </div>

        {/* Sticky footer */}
        <DialogFooter className="flex-row gap-2 border-t border-border px-6 py-4 sm:px-6">
          <Button
            variant="outline"
            className="flex-1 border-destructive/30 text-destructive hover:bg-destructive/10 sm:flex-none"
            onClick={() => onStatusChange("REJECTED")}
            disabled={isUpdating || status === "REJECTED"}
          >
            Reject
          </Button>
          <Button
            variant="outline"
            className="flex-1 sm:flex-none"
            onClick={() => onAutoApprove(admission)}
            disabled={isUpdating || status === "APPROVED"}
          >
            Auto approve
          </Button>
          <Button
            className="flex-1 bg-foreground text-background hover:bg-foreground/90 sm:flex-none"
            onClick={() => onManualApprove(admission)}
            disabled={isUpdating || status === "APPROVED"}
          >
            Assign batch and approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}