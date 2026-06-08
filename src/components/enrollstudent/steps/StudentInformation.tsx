import { StepProps } from "../types";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function StudentInformation({
  form,
}: StepProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="roleInfo.rollNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Roll Number
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
        name="roleInfo.batch"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Batch</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="roleInfo.admissionDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Admission Date
            </FormLabel>
            <FormControl>
              <Input
                type="date"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}