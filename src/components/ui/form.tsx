import * as React from "react"
import { Slot } from "radix-ui"
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const Form = FormProvider

const FormItemContext = React.createContext<{ id: string }>({ id: "" })

function useFormItem() {
  return React.useContext(FormItemContext)
}

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ ...props }: ControllerProps<TFieldValues, TName>) {
  return <Controller {...props} />
}

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = React.useId()
  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        className={cn("grid gap-2", className)}
        {...props}
      />
    </FormItemContext.Provider>
  )
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  const { error } = useFormContext()
  const { id } = useFormItem()

  return (
    <Label
      data-slot="form-label"
      data-error={!!error?.message}
      className={cn("data-[error=true]:text-destructive-foreground", className)}
      htmlFor={id}
      {...props}
    />
  )
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot.Root>) {
  const { error } = useFormContext()
  const { id } = useFormItem()

  return (
    <Slot.Root
      data-slot="form-control"
      id={id}
      aria-describedby={
        error?.message
          ? `${id}-description ${id}-message`
          : `${id}-description`
      }
      aria-invalid={!!error?.message}
      {...props}
    />
  )
}

function FormDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  const { id } = useFormItem()

  return (
    <p
      data-slot="form-description"
      id={`${id}-description`}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function FormMessage({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  const { error } = useFormContext()
  const { id } = useFormItem()
  const body = error?.message ?? children

  if (!body) return null

  return (
    <p
      data-slot="form-message"
      id={`${id}-message`}
      className={cn("text-sm text-destructive-foreground", className)}
      {...props}
    >
      {body}
    </p>
  )
}

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
}
