// AccountInformation.tsx

import { UseFormReturn } from "react-hook-form";

import { StudentEnrollFormData } from "@/schemas/student.schema";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

interface Props {
  form: UseFormReturn<StudentEnrollFormData>;
}

export default function AccountInformation({
  form,
}: Props) {
  return (
    <div className="border rounded-xl p-6">
      <h2 className="font-semibold text-lg mb-4">
        Account Information
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>

              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter email"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Phone Number
              </FormLabel>

              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter phone number"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}