import { useState } from "react";
// import { useUpcomingLiveClasses } from "./hooks/useLiveClass";
import type { ILiveSession } from "@/pages/Live-Classes/types/index";
import { LiveClassStats, LiveClassSection, LiveClassCard, StartLiveClassModal, EmptyLiveClassState } from "@/components/live-classes";
import { useUpcomingLiveClasses } from "./hooks/useLiveClass";
import { ButtonGroup, ButtonGroupSeparator } from "#components/ui/button-group";
import { Button } from "#components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "#components/ui/dialog";
import StartLiveClassForm from "#components/live-classes/components/StartLiveClassForm";
import ScheduleLiveClassForm from "#components/live-classes/components/ScheduleLiveClassForm";
import { useTeachersSummary } from "../Teacher/hooks/useTeachersSummary";
import { mapToLabelValue } from "@/utils/helper";
import { useGetGrades } from "../Classes/hooks/useGetGrades";


const dummyStats = {
    totalClasses: 24,
    totalStudents: 342,
    hoursTaught: 86,
    avgAttendance: 78,
};

export default function LiveClassPage() {
    const { data: upcomingClassess, isLoading } = useUpcomingLiveClasses();
    const {data} = useTeachersSummary()
const teachers = data?.teachers ?? [];
 const {
    data: gradeData

  } = useGetGrades();
  const allGrades = gradeData?.grades || [];
    const [selectedClass, setSelectedClass] = useState<ILiveSession | null>(null);
    const [open, setOpen] = useState(false);
    const [modalType, setModalType] = useState<"live" | "schedule">("live");
    const [startModalOpen, setStartModalOpen] = useState(false);
console.log(gradeData,"teachersteachers 3132131321321321231",)
console.log(teachers,"teachersteachers")
    const handleStart = (liveClass: ILiveSession) => {
        setSelectedClass(liveClass);
        setStartModalOpen(true);
    };

    const handleStarted = (url: string) => {
        console.log("Live class started at:", url);
    };

    /**
     * Mock Data
     */
    // const isLoading = false;

    const upcomingClasses: ILiveSession[] = [
        // {
        //     id: "live-1",
        //     title: "React Fundamentals",
        //     description: "Learn components, props, state and hooks.",
        //     subject: {
        //         id: "3456789",
        //         name: "Frontend Development"
        //     },

        //     roomName: "room-123",
        //     teacher: {
        //         id: "teacher-1",
        //         name: "John Doe",
        //         profileImage: "https://example.com/teacher.jpg"
        //     },

        //     startedAt: null,
        //     endedAt: null,

        //     scheduledAt: "2026-06-10T10:00:00.000Z",

        //     durationMinutes: 60,
        //     maxParticipants: 50,

        //     isRecordingEnabled: true,
        //     isChatEnabled: true,
        //     isScreenShareAllowed: true,

        //     status: "SCHEDULED",

        //     createdBy: "teacher-1",

        //     createdAt: "2026-06-01T10:00:00.000Z",
        //     updatedAt: "2026-06-01T10:00:00.000Z",
        // },

        // {
        //     id: "live-2",
        //     title: "Advanced TypeScript",
        //     description:
        //         "Generics, utility types and advanced patterns.",
        //     subject:{
        //         id: "3456789",
        //         name: "Frontend Development"
        //     },
        //     teacher: {
        //         id: "teacher-1",
        //         name: "John Doe",
        //         profileImage: "https://example.com/teacher.jpg"
        //     },

        //     roomName: "room-456",

        //     startedAt: null,
        //     endedAt: null,

        //     scheduledAt: "2026-06-11T14:00:00.000Z",

        //     durationMinutes: 90,
        //     maxParticipants: 100,

        //     isRecordingEnabled: true,
        //     isChatEnabled: true,
        //     isScreenShareAllowed: true,

        //     status: "SCHEDULED",

        //     createdBy: "teacher-1",

        //     createdAt: "2026-06-01T10:00:00.000Z",
        //     updatedAt: "2026-06-01T10:00:00.000Z",
        // },
    ];

    const activeClasses: ILiveSession[] = [
        {
            id: "live-active-1",

            title: "Database Design",
            description:
                "Currently discussing indexing and query optimization.",

            subject: "Database Systems",

            scheduledAt: "2026-06-08T09:00:00.000Z",

            durationMinutes: 60,
            maxParticipants: 60,

            isRecordingEnabled: true,
            isChatEnabled: true,
            isScreenShareAllowed: true,

            status: "LIVE",

            meetingUrl: "https://live.example.com/room-123",

            passcode: "ABC123",

            createdBy: "teacher-1",

            createdAt: "2026-06-01T10:00:00.000Z",
            updatedAt: "2026-06-08T09:00:00.000Z",
        },
    ];

    return (
        <div className="space-y-8 p-6" >
            {/* Header */}
            <div className="flex items-start justify-between" >
                <div>
                    <h1 className="text-2xl font-bold tracking-tight" >
                        Live Classes
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground" >
                        Schedule, manage, and start your real-time teaching sessions.
                    </p>
                </div>
                <ButtonGroup>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                            setModalType("live");
                            setOpen(true);
                        }}
                    >
                        Start New Class
                    </Button>

                    <ButtonGroupSeparator />

                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                            setModalType("schedule");
                            setOpen(true);
                        }}
                    >
                        Schedule Class
                    </Button>
                </ButtonGroup>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="sm:max-w-xl">
                        <DialogHeader>
                            <DialogTitle>
                                {modalType === "live"
                                    ? "Start Live Class"
                                    : "Schedule Live Class"}
                            </DialogTitle>

                            <DialogDescription>
                                {modalType === "live"
                                    ? "Start a class immediately."
                                    : "Schedule a class for later."}
                            </DialogDescription>
                        </DialogHeader>

                        {modalType === "live" ? (
                            <StartLiveClassForm
                                onSuccess={() => {
                                    setOpen(false);
                                }}
                                 teachersOptions={mapToLabelValue(teachers, "name", "id")} 
                                 gradeOptions={mapToLabelValue(allGrades, "name", "id")}
                            />
                        ) : (
                            <ScheduleLiveClassForm
                                onSuccess={() => {
                                    setOpen(false);
                                }}
                                teachersOptions={mapToLabelValue(teachers, "name", "id")} 
                                gradeOptions={mapToLabelValue(allGrades, "name", "id")}
                            />
                        )}
                    </DialogContent>
                </Dialog>
                {/* <CreateLiveClassDialog /> */}
            </div>

            {/* Stats */}
            <LiveClassStats stats={dummyStats} />

            {/* Upcoming Classes */}
            <LiveClassSection
                title="Upcoming Sessions"
                description="Classes scheduled to start soon."
                action={
                    upcomingClasses.length > 0 ? (
                        <span className="text-xs font-medium text-muted-foreground" >
                            {upcomingClasses.length} scheduled
                        </span>
                    ) : null
                }
            >
                {isLoading ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" >
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-50 w-full rounded-xl bg-muted animate-pulse" />
                        ))}
                    </div>
                ) : upcomingClasses.length === 0 ? (
                    <EmptyLiveClassState /> // empty state component
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" >
                        {upcomingClasses.map((liveClass: ILiveSession) => (
                            <LiveClassCard
                                key={liveClass.id}
                                liveClass={liveClass}
                                variant="UPCOMING"
                                onJoin={(id) => {
                                    console.log("Joining", id);
                                }}
                                onStart={(id) => {
                                    const found = upcomingClasses.find(
                                        (c) => c.id === id
                                    );

                                    if (found) {
                                        handleStart(found);
                                    }
                                }}
                            />
                        ))}
                    </div>
                )}
            </LiveClassSection>

            {/* Active Now */}
            <LiveClassSection
                title="Active Now"
                description="Currently live sessions."
            >
                {activeClasses.length === 0 ? (
                    <EmptyLiveClassState />
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" >
                        {activeClasses.map((liveClass) => (
                            <LiveClassCard
                                key={liveClass.id}
                                liveClass={liveClass}
                                variant="LIVE"
                            />
                        ))}
                    </div>
                )}
            </LiveClassSection>

            {/* Start Modal */}
            {selectedClass && (
                <StartLiveClassModal
                    liveClass={selectedClass}
                    open={startModalOpen}
                    onOpenChange={setStartModalOpen}
                    onStarted={handleStarted}
                />
            )}
        </div>
    );
}
