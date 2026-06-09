import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AccountInformation from "./steps/AccountInformation";
import PersonalInformation from "./steps/PersonalInformation";
import AddressInformation from "./steps/AddressInformation";

import ReviewSubmit from "./steps/ReviewSubmit";
import EnrollmentStepper from "./EnrollmentStepper";
import StepNavigation from "./StepNavigation";
import { teacherEnrollSchema, type TeacherEnrollFormInput, type TeacherEnrollFormOutput } from "@/pages/Teacher/schema/teacher.schema";
import TeacherInformation from "./steps/TeacherInformation";
import { useCreateTeacher } from "@/pages/Teacher/hooks/useCreateTeacher";
import { useUploadAvatar } from "@/pages/Teacher/hooks/useUploadAvtar";

const steps = ["Account", "Personal", "Address", "Teacher", "Review"];
const stepFields: Record<number, string[]> = {
    0: [
        "email",
        "phoneNumber",
        "password",
        "confirmPassword",
    ],

    1: [
        "personalInfo.name",
        "personalInfo.dateOfBirth",
        "personalInfo.gender",
        "personalInfo.profileImage",
    ],

    2: [
        "personalInfo.address.line1",
        "personalInfo.address.city",
        "personalInfo.address.state",
        "personalInfo.address.country",
        "personalInfo.address.zipCode",
    ],

    3: [
        "roleInfo.qualification",
        "roleInfo.specialization",
        "roleInfo.experienceYears",
        "roleInfo.joiningDate",
        "roleInfo.bio",
    ],
};
export default function TeacherEnrollForm() {
    const [currentStep, setCurrentStep] = useState(0);
    const {
        
        handleCreateTeacher,
    } = useCreateTeacher();
    const {
  uploadAvatarAsync,
} = useUploadAvatar();
    // ✅ useForm ko Input type do — raw form values (phoneNumber: string)
    const methods = useForm<TeacherEnrollFormInput, unknown, TeacherEnrollFormOutput>({
        resolver: zodResolver(teacherEnrollSchema),
        mode: "all",
    });

    // // ✅ onSubmit ko Output type milta hai — transform ke baad (phoneNumber: string E.164)
    // const onSubmit = (values: TeacherEnrollFormOutput) => {
    //     console.log("form data:", values);
    //     console.log("phoneNumber (E.164):", values.phoneNumber); // +919876543210
    //     (
    //         handleCreateTeacher(values)
    //     )
    // };
    const onSubmit = async (
  values: TeacherEnrollFormOutput
) => {
  let avatarUrl = "";

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


  handleCreateTeacher({
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
            case 3: return <TeacherInformation />;

            case 4: return <ReviewSubmit />;
            default: return null;
        }
    };
    const nextStep = async () => {
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
                onSubmit={methods.handleSubmit(onSubmit, (errors) => {
                    console.log("ERRORS:", errors);
                })}
                className="flex flex-col h-[calc(100vh-250px)]"
            >
                <div className="mb-6">
                    <EnrollmentStepper currentStep={currentStep} steps={steps} onNext={() => nextStep()} onPrevious={() => setCurrentStep((p) => p - 1)} />
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