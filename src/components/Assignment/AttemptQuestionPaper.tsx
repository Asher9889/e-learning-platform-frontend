// import { QUESTION_PAPERS } from "@/pages/Assignment/data/dummy-question-papers";
import { useMemo, useState } from "react";
import {  useNavigate, useParams } from "react-router-dom";
import { AttemptHeader } from "./Attempt/AttemptHeader";
import { QuestionCard } from "./Attempt/QuestionCard";
import { AttemptFooter } from "./Attempt/AttemptFooter";
import { QuestionNavigator } from "./Attempt/QuestionNavigator";
import { SubmitDialog } from "./Attempt/SubmitDialog";
import { useAssignment } from "@/pages/Assignment/hook/useAssignment";
import { useSubmitAssessment } from "@/pages/ScoreBoard/hooks/useScoreBoard";
import type { AssessmentReview } from "@/pages/Assignment/types/question-paper.types";

export default function AttemptQuestionPaper() {
    const navigate = useNavigate();
    const { id } = useParams();
    // const submitMutation =
    //     useSubmitAssessment();

    const submitMutation = useSubmitAssessment()
    const { data: assignment, isLoading } = useAssignment(id!);
    console.log(assignment, "assignmen1321321324t")
    const paper = useMemo(() => {
        if (!assignment) return null;
        console.log(assignment, "assignmen1321321324t")
        return assignment;
    }, [assignment, id]);

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [submitOpen, setSubmitOpen] = useState(false);
    console.log(isLoading, "isLoading1212")
    // 1) API abhi loading hai -> skeleton dikhao
    if (isLoading) {
        return (
            <div className="mx-auto max-w-7xl space-y-6 p-6">
                <div className="h-16 animate-pulse rounded-lg bg-muted" />
                <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                    <div className="space-y-6">
                        <div className="h-96 animate-pulse rounded-lg bg-muted" />
                        <div className="h-20 animate-pulse rounded-lg bg-muted" />
                    </div>
                    <div className="h-96 animate-pulse rounded-lg bg-muted" />
                </div>
            </div>
        );
    }

    // 2) API response aa gaya lekin paper nahi mila -> redirect ya "not found"
    // if (!paper) {
    //     return <Navigate to="/student/question-papers" replace />;
    // }

    // 3) Ab yahan se neeche paper GUARANTEED defined hai, koi optional chaining ki zaroorat nahi
    const totalQuestions = paper.questions.length;
    const question = paper.questions[currentQuestion];
    const questionIds = paper.questions.map((item :AssessmentReview) => item.id);
    const answeredQuestions = Object.keys(answers).length;

    const handleSelectAnswer = (questionId: string, option: string) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: option,
        }));
    };

    const handleNext = () => {
        if (currentQuestion >= totalQuestions - 1) return;
        setCurrentQuestion((prev) => prev + 1);
    };

    const handlePrevious = () => {
        if (currentQuestion <= 0) return;
        setCurrentQuestion((prev) => prev - 1);
    };

    const handleJump = (index: number) => {
        setCurrentQuestion(index);
    };

    // const handleSubmit = () => {
    //     console.clear();
    //     console.log("Submitted Answers");
    //     const result = {
    //         assessmentId: paper.id,
    //         answers,
    //     };

    //     console.log(answers, "Submitted Answers", result);

    //     /*
    //       API CALL
    //       await submitAssessment({ assessmentId: , answers })
    //     */
    //     navigate(`/assignments/${id}/result`, {
    //         state: {
    //             score: 85,
    //             totalQuestions: 20,
    //             answers: answers,
    //         },
    //     });
    // };

    const handleSubmit = async () => {
        try {

            const payload = {
                assessmentId: paper.id,
                answers,
            };

            const result =
                await submitMutation.mutateAsync(payload);
            console.log(result,"result location.statelocation.state")
            navigate(`/assignments/${id}/result`,
                {
                    state: {
                        result
                    }
                }
            );
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <div className="mx-auto max-w-7xl space-y-6 p-6">
                <AttemptHeader
                    title={paper.title}
                    currentQuestion={currentQuestion}
                    totalQuestions={totalQuestions}
                />

                <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                    <div className="space-y-6">
                        <QuestionCard
                            question={question}
                            selectedAnswer={answers[question.id]}
                            onSelect={(value) => handleSelectAnswer(question.id, value)}
                        />
                        <AttemptFooter
                            currentQuestion={currentQuestion}
                            totalQuestions={totalQuestions}
                            onPrevious={handlePrevious}
                            onNext={handleNext}
                            onSubmit={() => setSubmitOpen(true)}
                        />
                    </div>

                    <QuestionNavigator
                        totalQuestions={totalQuestions}
                        currentQuestion={currentQuestion}
                        answers={answers}
                        questionIds={questionIds}
                        onJump={handleJump}
                    />
                </div>
            </div>

            <SubmitDialog
                open={submitOpen}
                totalQuestions={totalQuestions}
                answeredQuestions={answeredQuestions}
                onCancel={() => setSubmitOpen(false)}
                onConfirm={handleSubmit}
            />
        </>
    );
}