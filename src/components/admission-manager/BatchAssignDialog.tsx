import { useState } from "react";
import { Loader2 } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";

import type { Admission } from "@/pages/Admissions/types";
import type { Batch } from "@/pages/Batches/types";

interface BatchAssignDialogProps {
    open: boolean;
    admission: Admission | null;
    batches: Batch[];

    loading?: boolean;
    assigning?: boolean;

    onClose: () => void;
    onAssign: (batchId: string) => Promise<void>;
}

export function BatchAssignDialog({
    open,
    admission,
    batches,
    loading = false,
    assigning = false,
    onClose,
    onAssign,
}: BatchAssignDialogProps) {
    const [selectedBatch, setSelectedBatch] = useState("");
console.log(batches,"batches")
    const handleClose = () => {
        setSelectedBatch("");
        onClose();
    };

    const handleAssign = async () => {
        if (!selectedBatch) return;

        await onAssign(selectedBatch);
        setSelectedBatch("");
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    handleClose();
                }
            }}
        >
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Assign Batch & Approve</DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                ) : batches.length === 0 ? (
                    <div className="py-6 text-center">
                        <p className="text-base font-semibold text-destructive">
                            No batches found
                        </p>

                        <p className="mt-2 text-sm text-muted-foreground">
                            This program doesn't have any batches yet. Please
                            create a batch for this program first, then assign
                            it to the student.
                        </p>
                    </div>
                ) : (
                    <div className="flex items-end gap-4 py-2">
                        {/* Student */}
                        <div className="flex-1">
                            <p className="mb-2 text-sm font-medium">
                                Student
                            </p>

                            <Input
                                value={admission?.personal.fullName ?? ""}
                                readOnly
                                tabIndex={-1}
                                className="pointer-events-none select-none focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                        </div>

                        {/* Batch */}
                        <div className="flex-1">
                            <p className="mb-2 text-sm font-medium">
                                Select Batch
                            </p>

                            <Select
                                value={selectedBatch}
                                onValueChange={setSelectedBatch}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Choose Batch" />
                                </SelectTrigger>

                                <SelectContent>
                                    {batches.map((batch) => (
                                        <SelectItem
                                            key={batch.id}
                                            value={batch.id}
                                        >
                                            {batch.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={handleClose}
                    >
                        {batches.length === 0 ? "Close" : "Cancel"}
                    </Button>

                    {!loading && batches.length > 0 && (
                        <Button
                            onClick={handleAssign}
                            disabled={!selectedBatch || assigning}
                        >
                            {assigning ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Assigning...
                                </>
                            ) : (
                                "Assign Batch & Approve"
                            )}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}