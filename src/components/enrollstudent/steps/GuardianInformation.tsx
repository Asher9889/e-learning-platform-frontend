import { StepProps } from "../types";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

export default function GuardianInformation({
  form,
}: StepProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="roleInfo.guardianName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Guardian Name
            </FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="roleInfo.guardianPhoneNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Guardian Phone
            </FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}