import { useEffect, useState } from "react";
import { Pencil, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { updateNameSchema, type TUpdateNameForm } from "@/pages/Profile/schema/profile.schema";
import { useUpdateName } from "@/pages/Profile/hooks";
import { sileo } from "sileo";




export function EditNameDialog({
    defaultName,
}: {
    defaultName: string;
}) {
    const [open, setOpen] = useState(false);
    const mutation = useUpdateName();

    const form = useForm<TUpdateNameForm>({
        resolver: zodResolver(updateNameSchema),

        defaultValues: {
            name: defaultName,
        },
    });

    useEffect(() => {
        form.reset({
            name: defaultName,
        });
    }, [defaultName]);

    function onSubmit(values: TUpdateNameForm) {

        mutation.mutate(values, {

            onSuccess() {
                setOpen(false);
                sileo.success({
                    title: "Name Updated",
                    description: "Your name has been updated successfully.",
                });
                form.reset(values);

            },

        });

    }

    return (

        <Dialog
            open={open}
            onOpenChange={setOpen}
        >

            <DialogTrigger asChild>

                <Button>

                    <Pencil className="mr-2 h-4 w-4" />

                    Edit Name

                </Button>

            </DialogTrigger>

            <DialogContent>

                <DialogHeader>

                    <DialogTitle>

                        Edit Name

                    </DialogTitle>

                </DialogHeader>

                <Form {...form}>

                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >

                        <FormField

                            control={form.control}

                            name="name"

                            render={({ field }) => (

                                <FormItem>

                                    <FormLabel>

                                        Full Name

                                    </FormLabel>

                                    <FormControl>

                                        <Input
                                            placeholder="Enter name"
                                            {...field}
                                        />

                                    </FormControl>

                                    <FormMessage />

                                </FormItem>

                            )}

                        />

                        <DialogFooter>

                            <Button
                                type="submit"
                                disabled={mutation.isPending}
                            >

                                {mutation.isPending && (

                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                                )}

                                Save Changes

                            </Button>

                        </DialogFooter>

                    </form>

                </Form>

            </DialogContent>

        </Dialog>

    );

}