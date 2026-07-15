// import { QUESTION_PAPERS } from "@/pages/Assignment/data/dummy-question-papers";
import {  useLocation } from "react-router-dom";
import { ResultHeader } from "./component/ResultHeader";
import { ScoreCard } from "./component/ScoreCard";
import { StatisticsCard } from "./component/StatisticsCard";
import { QuestionReviewCard } from "./component/QuestionReviewCard";
import type { AssessmentResult } from "@/pages/Assignment/types/question-paper.types";



export default function QuestionPaperResult() {
    // const { id } = useParams();

    const location = useLocation();

    const answers =
        (location.state?.result as AssessmentResult) ??
        {};
console.log(location.state,"location.statelocation.state",answers)
    // const paper = QUESTION_PAPERS.find(
    //     (item) => item.id === id
    // );

if (!answers?.assessmentId) {
        return (
            // <Navigate
            //     to="/student/question-papers"
            //     replace
            // />
            <></>
        );
    }

    // const correctQuestions = answers?.correctCount
    // paper.questions.filter(
    //     (question) =>
    //         answers[question.id] ===
    //         question.correctAnswer
    // );

    const correctCount = answers?.correctCount ?? 0

    const wrongCount = answers?.wrongCount
    
    // paper.questions.filter(
    //     (question) =>
    //         answers[question.id] &&
    //         answers[question.id] !==
    //         question.correctAnswer
    // ).length;

    const skippedCount = answers?.skippedCount ?? 0
        // paper.questions.length -
        // correctCount -
        // wrongCount;

    const obtainedMarks = answers?.obtainedMarks ?? 0

    return (
        <div className="mx-auto max-w-7xl space-y-6 p-6">

            <ResultHeader
                title={answers?.title}
            />

            <div className="grid gap-6 lg:grid-cols-2">

                <ScoreCard
                    obtainedMarks={Number(obtainedMarks)}
                    totalMarks={answers.totalMarks}
                />

                <StatisticsCard
                    totalQuestions={
                        answers.reviews.length
                    }
                    correctCount={Number(correctCount)}
                    wrongCount={Number(wrongCount)}
                    skippedCount={Number(skippedCount)}
                />

            </div>

            <div className="space-y-4">

                <h2 className="text-2xl font-bold">
                    Question Review
                </h2>
                 {answers && answers.reviews.map((question) => (
                    <QuestionReviewCard
                        key={question.questionId}
                        number={question.number}
                        question={question.question}
                        selectedAnswer={question.selectedAnswer}
                        correctAnswer={question.correctAnswer}
                        explanation={question.explanation}
                    />
                ))}

            </div>
        </div>
    );
}
