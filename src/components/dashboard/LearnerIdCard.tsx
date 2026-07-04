import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";
import type { IStudentRoleInfo, ITeacherRoleInfo } from "@/constants/user/user.constant";
import { QRCodeSVG } from "qrcode.react";
interface Address {
    line1?: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
}

interface PersonalInfo {
    name: string;
    dateOfBirth: string;
    gender: string;
    profileImage?: string;
    address: Address;
}

// interface RoleInfo {
//   rollNumber: string;
//   admissionDate: string;
//   guardianName: string;
//   guardianPhoneNumber: string;
//   batchId?: string;
//   programId?: string;
//   batchName?: string;
//   programName?: string;
// }

export interface LearnerUser {
    id: string;
    email: string;
    phoneNumber: string;
    role: string;
    status?: string;
    personalInfo: PersonalInfo;
    roleInfo: ITeacherRoleInfo | IStudentRoleInfo;
    createdAt: string;
    updatedAt: string;
}

interface LearnerIdCardProps {
    user: LearnerUser | null;
    onDownload?: () => void;
    ref?: React.Ref<HTMLDivElement>;
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function initials(name: string) {
    return name.trim().charAt(0).toUpperCase();
}

function cleanSpaces(text: string) {
    return text.replace(/\s+/g, " ").trim();
}

export function LearnerIdCard({ user, onDownload, ref }: LearnerIdCardProps) {

    if (!user) {
        return <div className="w-full max-w-sm rounded-2xl border p-4 text-sm text-muted-foreground">Loading...</div>;
    }
    const { email, phoneNumber, role, status, personalInfo, roleInfo } = user;
    const { name, dateOfBirth, gender, profileImage, address } = personalInfo;
    const {
        rollNumber,
        admissionDate,
        guardianName,
        guardianPhoneNumber,
        //    batchName,
        //     programName, 
    } = roleInfo as IStudentRoleInfo; // Assuming roleInfo is of type IStudentRoleInfo for this card

    return (
        <div ref={ref} className="w-full max-w-sm rounded-2xl border bg-card overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between bg-foreground px-5 py-3 text-background">
                <span className="text-xs font-semibold tracking-wide">
                    E-Learning learner ID
                </span>
                <Badge
                    variant="secondary"
                    className="bg-white/15 text-background hover:bg-white/15 text-[10px]"
                >
                    {status === "ACTIVE" ? "Active" : status}
                </Badge>
            </div>

            {/* Identity */}
            <div className="flex items-center gap-3 px-5 pt-4">
                {profileImage ? (
                    <img
                        src={profileImage}
                        alt={name}
                        className="h-14 w-14 rounded-xl object-cover"
                    />
                ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted text-lg font-semibold text-muted-foreground">
                        {initials(name)}
                    </div>
                )}
                <div>
                    <p className="text-lg font-semibold leading-tight">{name}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                        {role.toLowerCase()}
                    </p>
                </div>
            </div>

            {/* Details table */}
            <div className="px-5 py-4 text-sm">
                {[
                    {
                        label: "Roll no",
                        value: rollNumber.slice(0, 8) + "..." + rollNumber.slice(-4),
                        mono: true,
                    },
                    { label: "Date of birth", value: formatDate(dateOfBirth) },
                    {
                        label: "Gender",
                        value: gender.charAt(0) + gender.slice(1).toLowerCase(),
                    },
                    { label: "Phone", value: phoneNumber },
                    { label: "Email", value: email },
                ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between py-1.5">
                        <span className="text-muted-foreground text-xs">{row.label}</span>
                        <span className={row.mono ? "font-mono text-xs" : "font-medium text-xs"}>
                            {row.value}
                        </span>
                    </div>
                ))}
            </div>
            {/* 
      {(batchName || programName) && (
        <>
          <div className="mx-5 border-t" />
          <div className="px-5 py-3 text-sm flex items-center justify-between">
            {programName && <span className="text-xs font-medium">{programName}</span>}
            {batchName && (
              <span className="text-xs text-muted-foreground">{batchName}</span>
            )}
          </div>
        </>
      )} */}

            <div className="mx-5 border-t" />

            {/* Address */}
            <div className="px-5 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                    Address
                </p>
                <p className="text-sm leading-snug">
                    {address.line1}, {address.city}, {address.state} {address.zipCode},{" "}
                    {address.country}
                </p>
            </div>

            <div className="mx-5 border-t" />

            {/* Guardian */}
            <div className="px-5 py-3 flex items-center justify-between">
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                        Guardian
                    </p>
                    <p className="text-sm">{cleanSpaces(guardianName)}</p>
                </div>
                <span className="text-sm text-muted-foreground">{guardianPhoneNumber}</span>
            </div>

            <div className="mx-5 border-t border-dashed" />

            {/* Footer: QR + download */}
            <div className="flex items-center gap-3 px-5 py-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <QRCodeSVG
                        value={`https://yourapp.com/verify/${user.id}`}
                        size={64}
                    />
                </div>
                <div className="flex-1">
                    <p className="text-xs text-muted-foreground">
                        Admitted {formatDate(admissionDate)}
                    </p>
                    <p className="text-xs text-muted-foreground/70 mb-2">
                        Scan to verify learner
                    </p>
                    <Button size="sm" className="h-7 text-xs gap-1.5" onClick={onDownload}>
                        <Download className="h-3.5 w-3.5" />
                        Download ID
                    </Button>
                </div>
            </div>
        </div>
    );
}