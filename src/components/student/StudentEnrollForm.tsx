import { useState } from "react";
import { FormProvider, useForm, type FieldPath } from "react-hook-form";
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
import { mapToLabelValue } from "@/utils/helper";
import { sileo } from "sileo";
import { useNavigate } from "react-router-dom";
import { useGetPrograms } from "@/pages/Programs/hooks/useGetPrograms";
import { useGetBatches } from "@/pages/Batches/hooks/useGetBatches";

// const steps = ["Account", "Personal", "Address", "Student", "Guardian", "Review"];

const stepFields: Record<
  number,
  FieldPath<StudentEnrollFormInput>[]
> = {
  0: ["email", "phoneNumber", "password", "confirmPassword"],
  1: ["personalInfo.name", "personalInfo.dateOfBirth", "personalInfo.gender"],
  2: ["personalInfo.address.line1", "personalInfo.address.city", "personalInfo.address.state", "personalInfo.address.country", "personalInfo.address.zipCode"],
  3: ["roleInfo.programId", "roleInfo.rollNumber", "roleInfo.batchId", "roleInfo.admissionDate"],
  4: ["roleInfo.guardianName", "roleInfo.guardianPhoneNumber"],
};
export default function StudentEnrollForm() {
  const navigate = useNavigate();
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const steps = [
    { label: "Account", completed: completedSteps.includes(0) },
    { label: "Personal", completed: completedSteps.includes(1) },
    { label: "Address", completed: completedSteps.includes(2) },
    { label: "Student", completed: completedSteps.includes(3) },
    { label: "Guardian", completed: completedSteps.includes(4) },
    { label: "Review", completed: false },
  ];
  const [currentStep, setCurrentStep] = useState(0);
  const {
    mutate: handleCreateStudent,
  } = useCreateStudent();
  const {
    uploadAvatarAsync,
    isUploading,
  } = useUploadAvatar();
  const { data: programData } = useGetPrograms();
  console.log(programData, "programData")
  const allProgramData = programData?.programs || [];



  // ✅ useForm ko Input type do — raw form values (phoneNumber: string)
  const methods = useForm<StudentEnrollFormInput, unknown, StudentEnrollFormOutput>({
    resolver: zodResolver(studentEnrollSchema),
    mode: "onBlur",
  });

  const selectedProgram = methods.getValues("roleInfo.programId");

  const { data: batchesData } = useGetBatches(selectedProgram);
  const allBactchesData = batchesData?.batches || [];
  console.log(
    methods.getValues("roleInfo.programId"),
    "selectedProgram", batchesData
  );

  // ✅ onSubmit ko Output type milta hai — transform ke baad (phoneNumber: string E.164)
  // const onSubmit = (values: StudentEnrollFormOutput) => {
  //   console.log("form data:", values);
  //   console.log("phoneNumber (E.164):", values.phoneNumber); // +919876543210
  // };

  const onSubmit = (
    values: StudentEnrollFormOutput
  ) => {
    handleCreateStudent(
      values,
      {
        onSuccess: (response) => {
          sileo.success({
            title: "Student Created",
            description:
              response?.message ||
              "Student created successfully",
          });
          navigate("/student");
        },

        onError: (error) => {
          sileo.error({
            title: "Failed to Create Student",
            description:
              error instanceof Error
                ? error.message
                : "Something went wrong",
          });
        },
      }
    );
  };
  const renderStep = () => {
    switch (currentStep) {
      case 0: return <AccountInformation />;
      case 1: return <PersonalInformation uploadAvatarAsync={uploadAvatarAsync} isUploading={isUploading} />;
      case 2: return <AddressInformation />;
      case 3: return <StudentInformation programOptions={mapToLabelValue(allProgramData, "name", "id")} batchesOptions={mapToLabelValue(allBactchesData, "name", "id")} />;
      case 4: return <GuardianInformation />;
      case 5: return <ReviewSubmit programOptions={mapToLabelValue(allProgramData, "name", "id")} batchesOptions={mapToLabelValue(allBactchesData, "name", "id")} />;
      default: return null;
    }
  };
  const nextStep = async (step?: number) => {
    console.log("NEXT STEP debugging", currentStep);
    const fields = stepFields[currentStep];

    const isValid = await methods.trigger(fields);

    if (!isValid) return;
    setCompletedSteps((prev) =>
      prev.includes(currentStep)
        ? prev
        : [...prev, currentStep]
    );
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
    if (step) {
      setCurrentStep(step);
    } else {
      setCurrentStep((p) => p + 1);

    }
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
          <EnrollmentStepper currentStep={currentStep} steps={steps} onNext={(step) => nextStep(step)} onPrevious={(step) => {
            setCurrentStep(step)
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