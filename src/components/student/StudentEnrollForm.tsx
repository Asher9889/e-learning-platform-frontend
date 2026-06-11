import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  studentEnrollSchema,
  type StudentEnrollFormInput,
  type StudentEnrollFormOutput,
} from "@/pages/Student/schema/student.schema";
import AccountInformation from "./steps/AccountInformation";
import PersonalInformation from "./steps/PersonalInformation";
import AddressInformation from "./steps/AddressInformation";
import StudentInformation from "./steps/StudentInformation";
import GuardianInformation from "./steps/GuardianInformation";
import ReviewSubmit from "./steps/ReviewSubmit";
import EnrollmentStepper from "./EnrollmentStepper";
import StepNavigation from "./StepNavigation";
import { useUploadAvatar } from "@/pages/Teacher/hooks/useUploadAvtar";
import { useCreateStudent } from "@/pages/Student/hooks/useCreateStudent";

const steps = ["Account", "Personal", "Address", "Student", "Guardian", "Review"];
const stepFields: Record<number, string[]> = {
  0: ["email", "phoneNumber", "password", "confirmPassword"],
  1: ["personalInfo.name", "personalInfo.dateOfBirth", "personalInfo.gender"],
  2: ["personalInfo.address.line1", "personalInfo.address.city", "personalInfo.address.state", "personalInfo.address.country", "personalInfo.address.zipCode"],
  3: ["roleInfo.rollNumber", "roleInfo.batch", "roleInfo.admissionDate"],
  4: ["roleInfo.guardianName", "roleInfo.guardianPhoneNumber"],
};
export default function StudentEnrollForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const {
    handleCreateStudent,
  } = useCreateStudent();
  const {
    uploadAvatarAsync,
  } = useUploadAvatar();
  // ✅ useForm ko Input type do — raw form values (phoneNumber: string)
  const methods = useForm<StudentEnrollFormInput, unknown, StudentEnrollFormOutput>({
    resolver: zodResolver(studentEnrollSchema),
    mode: "all",
  });

  // ✅ onSubmit ko Output type milta hai — transform ke baad (phoneNumber: string E.164)
  // const onSubmit = (values: StudentEnrollFormOutput) => {
  //   console.log("form data:", values);
  //   console.log("phoneNumber (E.164):", values.phoneNumber); // +919876543210
  // };

  const onSubmit = async (
    values: StudentEnrollFormOutput
  ) => {
    let avatarUrl = "";
    console.log(
    "SUBMIT CALLED   debugging",
    currentStep
  );
console.log("asdasdasdasdasd",currentStep)
    if (
      values.personalInfo.profileImage
    ) {
      const uploadResponse =
        await uploadAvatarAsync(
          values.personalInfo.profileImage
        );

      avatarUrl =
        uploadResponse?.url;
    }


    handleCreateStudent({
      ...values,
      personalInfo: {
        ...values.personalInfo,
        profileImage: avatarUrl
      },
    });
  };
  const renderStep = () => {
    switch (currentStep) {
      case 0: return <AccountInformation />;
      case 1: return <PersonalInformation />;
      case 2: return <AddressInformation />;
      case 3: return <StudentInformation />;
      case 4: return <GuardianInformation />;
      case 5: return <ReviewSubmit />;
      default: return null;
    }
  };
  const nextStep = async () => {
    console.log("NEXT STEP debugging", currentStep);
    const fields = stepFields[currentStep];

    const isValid = await methods.trigger(fields as any);

    if (!isValid) return;

    if (
      currentStep === 0 &&
      methods.getValues("password") !==
      methods.getValues("confirmPassword")
    ) {
      methods.setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });

      return;
    }

    setCurrentStep((p) => p + 1);
  };
  return (
    <FormProvider {...methods}>
      <form
        // onSubmit={methods.handleSubmit(onSubmit, (errors) => {
        //   console.log("ERRORS:", errors);
        // })}
         onSubmit={(e) => {
    console.log("FORM SUBMIT debugging");
    methods.handleSubmit(onSubmit)(e);
  }}
        autoComplete="off"
        className="flex flex-col h-[calc(100vh-250px)]"
      >
        <input
          type="text"
          name="username"
          autoComplete="username"
          style={{ display: "none" }}
          tabIndex={-1}
          readOnly
        />
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          style={{ display: "none" }}
          tabIndex={-1}
          readOnly
        />
        <div className="mb-6">
          <EnrollmentStepper currentStep={currentStep} steps={steps} onNext={() => nextStep()} onPrevious={() => {
            // setCurrentStep((p) => p - 1)
          }} />
        </div>

        <div className="flex-1 overflow-y-auto">
          {renderStep()}
        </div>

        <div className="sticky bottom-0 bg-background border-t pt-4 mt-4">
          <StepNavigation
            currentStep={currentStep}
            totalSteps={steps.length}
            onNext={() => nextStep()}
            onPrevious={() => setCurrentStep((p) => p - 1)}
          />
        </div>
      </form>
    </FormProvider>
  );
}