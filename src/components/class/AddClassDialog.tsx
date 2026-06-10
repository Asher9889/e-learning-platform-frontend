import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
    FormProvider,
    useForm,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
    addClassSchema,
    type AddClassFormInput,
} from "@/pages/Classes/schema/class.schema";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (
        values: AddClassFormInput
    ) => void;
}

export default function AddClassDialog({
    open,
    onOpenChange,
    onSubmit,
}: Props) {
    const methods = useForm<AddClassFormInput>({
        resolver: zodResolver(addClassSchema),
        mode: "onSubmit",
        defaultValues: {
            className: "",
            sectionName: "",
            strength: 0,
        },
    });

    const {
        register,
        reset,
        formState: { errors },
    } = methods;

    const handleSubmit = (
        values: AddClassFormInput
    ) => {
        onSubmit(values);

        reset();

        onOpenChange(false);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        Add New Class
                    </DialogTitle>
                </DialogHeader>

                <FormProvider {...methods}>
                    <form
                        onSubmit={methods.handleSubmit(
                            handleSubmit
                        )}
                        className="space-y-5"
                    >
                        <div className="space-y-2">
                            <Label htmlFor="className">
                                Class Name
                            </Label>

                            <Input
                                id="className"
                                placeholder="Class 10"
                                {...register("className")}
                            />

                            <p className="text-sm text-red-500">
                                {errors.className?.message}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="sectionName">
                                    Section
                                </Label>

                                <Input
                                    id="sectionName"
                                    placeholder="A"
                                    {...register("sectionName")}
                                />

                                <p className="text-sm text-red-500">
                                    {errors.sectionName?.message}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="strength">
                                    Strength
                                </Label>

                                <Input
                                    id="strength"
                                    type="number"
                                    placeholder="30"
                                    {...register("strength", {
                                        valueAsNumber: true,
                                    })}
                                />

                                <p className="text-sm text-red-500">
                                    {errors.strength?.message}
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    onOpenChange(false)
                                }
                            >
                                Cancel
                            </Button>

                            <Button type="submit">
                                Add Class
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}