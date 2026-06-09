import { useState } from "react";
// import { useUpcomingLiveClasses } from "./hooks/useLiveClass";

import type { TLiveClass } from "./schema/live.schema";

import { LiveClassStats } from "./components/LiveClassStats";
import { LiveClassSection } from "./components/LiveClassSection";
import { LiveClassCard } from "./components/LiveClassCard";
import CreateLiveClassDialog from "./components/CreateLiveClassDialog";
import { StartLiveClassModal } from "./components/StartLiveClassModal";
import { EmptyLiveClassState } from "./components/EmptyLiveClassState";

const dummyStats = {
    totalClasses: 24,
    totalStudents: 342,
    hoursTaught: 86,
    avgAttendance: 78,
};

export default function TeacherLiveClassPage() {
    // const { data: upcomingClasses, isLoading } = useUpcomingLiveClasses();

    const [selectedClass, setSelectedClass] = useState<TLiveClass | null>(null);

    const [startModalOpen, setStartModalOpen] = useState(false);

    const handleStart = (liveClass: TLiveClass) => {
        setSelectedClass(liveClass);
        setStartModalOpen(true);
    };

    const handleStarted = (url: string) => {
        console.log("Live class started at:", url);
    };

    /**
     * Mock Data
     */
    const isLoading = false;

    const upcomingClasses: TLiveClass[] = [
        {
            id: "live-1",
            title: "React Fundamentals",
            description:
                "Learn components, props, state and hooks.",
            subject: "Frontend Development",

            scheduledAt: "2026-06-10T10:00:00.000Z",

            durationMinutes: 60,
            maxParticipants: 50,

            isRecordingEnabled: true,
            isChatEnabled: true,
            isScreenShareAllowed: true,

            status: "SCHEDULED",

            createdBy: "teacher-1",

            createdAt: "2026-06-01T10:00:00.000Z",
            updatedAt: "2026-06-01T10:00:00.000Z",
        },

        {
            id: "live-2",
            title: "Advanced TypeScript",
            description:
                "Generics, utility types and advanced patterns.",
            subject: "TypeScript",

            scheduledAt: "2026-06-11T14:00:00.000Z",

            durationMinutes: 90,
            maxParticipants: 100,

            isRecordingEnabled: true,
            isChatEnabled: true,
            isScreenShareAllowed: true,

            status: "SCHEDULED",

            createdBy: "teacher-1",

            createdAt: "2026-06-01T10:00:00.000Z",
            updatedAt: "2026-06-01T10:00:00.000Z",
        },

        {
            id: "live-3",
            title: "Node.js Backend Development",
            description:
                "Build production APIs using Express and MongoDB.",
            subject: "Backend Development",

            scheduledAt: "2026-06-12T16:00:00.000Z",

            durationMinutes: 120,
            maxParticipants: 75,

            isRecordingEnabled: true,
            isChatEnabled: true,
            isScreenShareAllowed: true,

            status: "SCHEDULED",

            createdBy: "teacher-1",

            createdAt: "2026-06-01T10:00:00.000Z",
            updatedAt: "2026-06-01T10:00:00.000Z",
        },
    ];

    const activeClasses: TLiveClass[] = [
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
        <div className= "space-y-8 p-6" >
            {/* Header */}
            <div className = "flex items-start justify-between" >
                <div>
                    <h1 className="text-2xl font-bold tracking-tight" >
                        Live Classes
                    </h1>

                    <p className = "mt-1 text-sm text-muted-foreground" >
                        Schedule, manage, and start your real-time teaching sessions.
                    </p>
                </div>

                <CreateLiveClassDialog />
            </div>

            {/* Stats */}
            <LiveClassStats stats={ dummyStats } />

            {/* Upcoming Classes */}
            <LiveClassSection
                title="Upcoming Sessions"
                description = "Classes scheduled to start soon."
                action = {
                    upcomingClasses.length > 0 ? (
                        <span className= "text-xs font-medium text-muted-foreground" >
                            { upcomingClasses.length } scheduled
                        </span>
                    ) : null
                }
            >
                {isLoading ? (
                    <div className = "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" >
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-[200px] w-full rounded-xl bg-muted animate-pulse" />
                        ))}
                    </div>
                ) : upcomingClasses.length === 0 ? (
                    <EmptyLiveClassState />
                ) : (
                    <div className= "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" >
                        {upcomingClasses.map((liveClass) => (
                            <LiveClassCard
                                key= { liveClass.id }
                                liveClass = { liveClass }
                                variant = "UPCOMING"
                                onJoin = {(id) => {
                                    console.log("Joining", id);
                                }}
                                onStart = {(id) => {
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
                description = "Currently live sessions."
            >
                {activeClasses.length === 0 ? (
                    <EmptyLiveClassState />
                ) : (
                    <div className= "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" >
                        {activeClasses.map((liveClass) => (
                            <LiveClassCard
                                key= { liveClass.id }
                                liveClass = { liveClass }
                                variant = "LIVE"
                            />
                        ))}
                    </div>
                )}
            </LiveClassSection>

            {/* Start Modal */}
            {selectedClass && (
                <StartLiveClassModal
                    liveClass={ selectedClass }
                    open = { startModalOpen }
                    onOpenChange = { setStartModalOpen }
                    onStarted = { handleStarted }
                />
            )}
        </div>
    );
}
