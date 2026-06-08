import { StepProps } from "../types";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

export default function PersonalInformation({
  form,
}: StepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        Personal Information
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="personalInfo.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Full Name
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
          name="personalInfo.dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>DOB</FormLabel>
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

        <FormField
          control={form.control}
          name="personalInfo.gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Gender
              </FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="w-full border rounded-md h-10 px-3"
                >
                  <option value="male">
                    Male
                  </option>
                  <option value="female">
                    Female
                  </option>
                  <option value="other">
                    Other
                  </option>
                </select>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="personalInfo.profileImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Profile Image URL
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}