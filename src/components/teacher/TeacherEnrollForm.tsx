import { useEffect, useState } from "react";
import { FormProvider, useForm, type FieldPath } from "react-hook-form";
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
import { useUpdateTeacher } from "@/pages/Teacher/hooks/useUpdateTeacher"; // 👈 naya hook, banana padega agar nahi hai
import { useTeacher } from "@/pages/Teacher/hooks/useTeacherById"; // 👈 single teacher fetch hook, banana padega agar nahi hai
import { useUploadAvatar } from "@/pages/Teacher/hooks/useUploadAvtar";
import { sileo } from "sileo";
import { useNavigate, useParams } from "react-router-dom";

const stepFields: Record<
    number,
    FieldPath<TeacherEnrollFormInput>[]
> = {
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
    const navigate = useNavigate();
    const { id } = useParams(); // 👈 /teachers/edit/:id se id milega
    const isEditMode = Boolean(id);

    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const steps = [
        { label: "Account", completed: completedSteps.includes(0) },
        { label: "Personal", completed: completedSteps.includes(1) },
        { label: "Address", completed: completedSteps.includes(2) },
        { label: "Teacher", completed: completedSteps.includes(3) },
        { label: "Review", completed: false },
    ];

    const { mutate: handleCreateTeacher } = useCreateTeacher();
    const { mutate: handleUpdateTeacher } = useUpdateTeacher(); // 👈 update mutation
    const { uploadAvatarAsync } = useUploadAvatar();

    // 👇 edit mode mein existing teacher data fetch karo
    const { data: teacherData, isLoading: isTeacherLoading } = useTeacher(id!, {
        enabled: isEditMode,
    });

    const methods = useForm<TeacherEnrollFormInput, unknown, TeacherEnrollFormOutput>({
        resolver: zodResolver(teacherEnrollSchema),
        mode: "all",
    });

    // 👇 jaise hi teacher data aaye, form ko prefill karo
    useEffect(() => {
        if (isEditMode && teacherData) {
            methods.reset({
                email: teacherData.email,
                phoneNumber: teacherData.phoneNumber,
                // edit mode mein password/confirmPassword required nahi honge,
                // schema mein optional rakhna padega edit ke liye
                personalInfo: {
                    name: teacherData.personalInfo?.name,
                    dateOfBirth: teacherData.personalInfo?.dateOfBirth,
                    gender: teacherData.personalInfo?.gender,
                    profileImage: teacherData.personalInfo?.profileImage, // existing URL string
                    address: {
                        line1: teacherData.personalInfo?.address?.line1,
                        city: teacherData.personalInfo?.address?.city,
                        state: teacherData.personalInfo?.address?.state,
                        country: teacherData.personalInfo?.address?.country,
                        zipCode: teacherData.personalInfo?.address?.zipCode,
                    },
                },
                roleInfo: {
                    qualification: teacherData.roleInfo?.qualification,
                    specialization: teacherData.roleInfo?.specialization,
                    experienceYears: teacherData.roleInfo?.experienceYears,
                    joiningDate: teacherData.roleInfo?.joiningDate,
                    bio: teacherData.roleInfo?.bio,
                },
            } as TeacherEnrollFormInput);
        }
    }, [isEditMode, teacherData]);

    const onSubmit = async (values: TeacherEnrollFormOutput) => {
        let avatarUrl = teacherData?.personalInfo?.profileImage ?? "";

        // 👇 agar user ne nayi image select ki hai (File object), tabhi upload karo
        if (
            values.personalInfo.profileImage &&
            values.personalInfo.profileImage instanceof File
        ) {
            const uploadResponse = await uploadAvatarAsync(
                values.personalInfo.profileImage
            );
            avatarUrl = uploadResponse?.url;
        }

        const payload = {
            ...values,
            personalInfo: {
                ...values.personalInfo,
                profileImage: avatarUrl,
            },
        };

        const onSuccess = (response: any) => {
            sileo.success({
                title: isEditMode ? "Teacher Updated" : "Teacher Created",
                description:
                    response?.message ||
                    (isEditMode
                        ? "Teacher updated successfully"
                        : "Teacher created successfully"),
            });
            navigate("/teachers");
        };

        const onError = (error: unknown) => {
            sileo.error({
                title: isEditMode
                    ? "Failed to Update Teacher"
                    : "Failed to Create Teacher",
                description:
                    error instanceof Error
                        ? error.message
                        : "Something went wrong",
            });
        };

        if (isEditMode) {
            handleUpdateTeacher(
                { id: id!, ...payload },
                { onSuccess, onError }
            );
        } else {
            handleCreateTeacher(payload, { onSuccess, onError });
        }
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

    const nextStep = async (step?: number) => {
        const fields = stepFields[currentStep];

        const isValid = await methods.trigger(fields);

        if (!isValid) return;
        setCompletedSteps((prev) =>
            prev.includes(currentStep) ? prev : [...prev, currentStep]
        );

        // 👇 password match check sirf create mode ya jab user password change kar raha ho
        if (
            currentStep === 0 &&
            !isEditMode &&
            methods.getValues("password") !== methods.getValues("confirmPassword")
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

    // 👇 edit mode mein jab tak data load ho raha hai, loader dikhao
    if (isEditMode && isTeacherLoading) {
        return (
            <div className="flex h-[calc(100vh-250px)] items-center justify-center">
                <p className="text-muted-foreground">Loading teacher details...</p>
            </div>
        );
    }

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={methods.handleSubmit(onSubmit, (errors) => {
                    console.log("ERRORS:", errors);
                })}
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
                    <EnrollmentStepper
                        currentStep={currentStep}
                        steps={steps}
                        onNext={(step) => nextStep(step)}
                        onPrevious={(step) => setCurrentStep(step)}
                    />
                </div>

                <div className="flex-1 overflow-y-auto">{renderStep()}</div>

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