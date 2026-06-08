import { useState } from "react";
import { Form, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


import AccountInformation from "./steps/AccountInformation";
import PersonalInformation from "./steps/PersonalInformation";
import AddressInformation from "./steps/AddressInformation";
import StudentInformation from "./steps/StudentInformation";
import ReviewSubmit from "./steps/ReviewSubmit";
import GuardianInformation from "./steps/GuardianInformation";
import { EnrollmentStepper } from "./EnrollmentStepper";
import { StepNavigation } from "./StepNavigation";
import { studentEnrollSchema, type StudentEnrollFormData } from "@/pages/EnrollStudent/schema/student.schema";




const steps = [
  "Account",
  "Personal",
  "Address",
  "Student",
  "Guardian",
  "Review",
];

export default function StudentEnrollForm() {
  const [step, setStep] = useState(0);

  const form = useForm<StudentEnrollFormData>({
    resolver: zodResolver(studentEnrollSchema),
    mode: "onChange",
  });

  const next = async () => {
    setStep((prev) => prev + 1);
  };

  const previous = () => {
    setStep((prev) => prev - 1);
  };

  const onSubmit = (
    values: StudentEnrollFormData
  ) => {
    console.log(values);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <AccountInformation form={form} />
        );

      case 1:
        return (
          <PersonalInformation form={form} />
        );

      case 2:
        return (
          <AddressInformation form={form} />
        );

      case 3:
        return (
          <StudentInformation form={form} />
        );

      case 4:
        return (
          <GuardianInformation form={form} />
        );

      case 5:
        return <ReviewSubmit form={form} />;

      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <EnrollmentStepper
          currentStep={step}
          steps={steps}
        />

        {renderStep()}

        <StepNavigation
          step={step}
          totalSteps={steps.length}
          onNext={next}
          onPrevious={previous}
          isLastStep={
            step === steps.length - 1
          }
        />
      </form>
    </Form>
  );
}