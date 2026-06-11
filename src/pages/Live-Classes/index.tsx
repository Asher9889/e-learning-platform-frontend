import { useState } from "react";
// import { useUpcomingLiveClasses } from "./hooks/useLiveClass";
import type { ILiveSession } from "@/pages/Live-Classes/types/index";
import { LiveClassStats, LiveClassSection, LiveClassCard, CreateLiveClassDialog, StartLiveClassModal, EmptyLiveClassState } from "@/components/live-classes";
import { useActiveLiveClasses, useStartLiveClass, useUpcomingLiveClasses } from "./hooks/useLiveClass";
import { queryClient } from "@/config";
import { sileo } from "sileo";
import { useNavigate } from "react-router-dom";
import { set } from "zod";


const dummyStats = {
    totalClasses: 24,
    totalStudents: 342,
    hoursTaught: 86,
    avgAttendance: 78,
};

export default function LiveClassPage() {
    const { data: upcomingClassesData , isLoading:upcomingSessionLoading } = useUpcomingLiveClasses();
    const startLiveClassMutation = useStartLiveClass();
    
    const { data: activeClassesData, isLoading:activeSessionLoading } = useActiveLiveClasses();
    const navigate = useNavigate();

    console.log("Active Classes Data:", activeClassesData);


    const upcomingClasses = upcomingClassesData?.sessions ?? [];
    const upcomingClassesPagination = upcomingClassesData?.pagination;

    const activeClasses = activeClassesData?.sessions ?? [];


    const [selectedClass, setSelectedClass] = useState<ILiveSession | null>(null);

    const [startModalOpen, setStartModalOpen] = useState(false);

    const handleStart = (liveClass: ILiveSession) => {
        setSelectedClass(liveClass);
        setStartModalOpen(true);
    };


    const handleLiveClassStarted = () => {
        // console.log("Live class started at:", url);
        startLiveClassMutation.mutate(selectedClass?.id || "", {
            onSuccess: async (data) => {
                setStartModalOpen(false);
                await queryClient.invalidateQueries({queryKey: ["live-classes", "upcoming"]});
                await queryClient.invalidateQueries({queryKey: ["live-classes", "active"]});
                console.log("Live class started successfully:", data);
                sileo.success({
                    title: "Live Class Started",
                    description: "Your live class is now active. Students can join using the link.",
                });
                const route = `/live-classes/${data.roomName}/class-room`;

                setTimeout(() => {
                    navigate(route); // Navigate to the live class details or dashboard page
                }, 3000); // Delay navigation to allow the success toast to be seen
                // Promise.resolve().then(() => {
                //     navigate(`/live-classes/${data.roomName}/class-room`); // Navigate to the live class details or dashboard page
                // }); // Ensure this runs after the success toast

                // navigate(`/live-classes/${data.roomName}/class-room`); // Navigate to the live class details or dashboard page
                // navigate(`/live-classes/${data.roomName}/class-room`); // Navigate to the live class details or dashboard page
                
            }, 
            onError: (error) => {
                sileo.error({
                    title: "Failed to Start",
                    description: error.message ||  "An error occurred while starting the live class. Please try again.",
                })
                console.error("Failed to start live class:", error);
                // Optionally show an error message to the user
            },
        });
    };

    const handleLiveClassJoin = (roomName: string) => {
        navigate(`/live-classes/${roomName}/class-room`);
        // Implement join logic, e.g., navigate to the live class room or open a modal
    };
    /**
     * Mock Data
     */
    // const isLoading = false;

    // const upcomingClasses: ILiveSession[] = [
    //     // {
    //     //     id: "live-1",
    //     //     title: "React Fundamentals",
    //     //     description: "Learn components, props, state and hooks.",
    //     //     subject: {
    //     //         id: "3456789",
    //     //         name: "Frontend Development"
    //     //     },

    //     //     roomName: "room-123",
    //     //     teacher: {
    //     //         id: "teacher-1",
    //     //         name: "John Doe",
    //     //         profileImage: "https://example.com/teacher.jpg"
    //     //     },

    //     //     startedAt: null,
    //     //     endedAt: null,

    //     //     scheduledAt: "2026-06-10T10:00:00.000Z",

    //     //     durationMinutes: 60,
    //     //     maxParticipants: 50,

    //     //     isRecordingEnabled: true,
    //     //     isChatEnabled: true,
    //     //     isScreenShareAllowed: true,

    //     //     status: "SCHEDULED",

    //     //     createdBy: "teacher-1",

    //     //     createdAt: "2026-06-01T10:00:00.000Z",
    //     //     updatedAt: "2026-06-01T10:00:00.000Z",
    //     // },

    //     // {
    //     //     id: "live-2",
    //     //     title: "Advanced TypeScript",
    //     //     description:
    //     //         "Generics, utility types and advanced patterns.",
    //     //     subject:{
    //     //         id: "3456789",
    //     //         name: "Frontend Development"
    //     //     },
    //     //     teacher: {
    //     //         id: "teacher-1",
    //     //         name: "John Doe",
    //     //         profileImage: "https://example.com/teacher.jpg"
    //     //     },

    //     //     roomName: "room-456",

    //     //     startedAt: null,
    //     //     endedAt: null,

    //     //     scheduledAt: "2026-06-11T14:00:00.000Z",

    //     //     durationMinutes: 90,
    //     //     maxParticipants: 100,

    //     //     isRecordingEnabled: true,
    //     //     isChatEnabled: true,
    //     //     isScreenShareAllowed: true,

    //     //     status: "SCHEDULED",

    //     //     createdBy: "teacher-1",

    //     //     createdAt: "2026-06-01T10:00:00.000Z",
    //     //     updatedAt: "2026-06-01T10:00:00.000Z",
    //     // },
    // ];

    // const activeClasses: ILiveSession[] = [
    //     // {
    //     //     id: "live-active-1",

    //     //     title: "Database Design",
    //     //     description:
    //     //         "Currently discussing indexing and query optimization.",

    //     //     subject: "Database Systems",

    //     //     scheduledAt: "2026-06-08T09:00:00.000Z",

    //     //     durationMinutes: 60,
    //     //     maxParticipants: 60,

    //     //     isRecordingEnabled: true,
    //     //     isChatEnabled: true,
    //     //     isScreenShareAllowed: true,

    //     //     status: "LIVE",

    //     //     meetingUrl: "https://live.example.com/room-123",

    //     //     passcode: "ABC123",

    //     //     createdBy: "teacher-1",

    //     //     createdAt: "2026-06-01T10:00:00.000Z",
    //     //     updatedAt: "2026-06-08T09:00:00.000Z",
    //     // },
    // ];

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

                <CreateLiveClassDialog />
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
                {upcomingSessionLoading ? (
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
                                onJoin={handleLiveClassJoin}
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
                    onStarted={handleLiveClassStarted}
                />
            )}
        </div>
    );
}
