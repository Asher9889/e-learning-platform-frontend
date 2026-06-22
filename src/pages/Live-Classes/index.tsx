import { useState, useCallback } from "react";
import type { ILiveSession } from "@/pages/Live-Classes/types/index";
import { useUpcomingLiveClasses, useActiveLiveClasses, useCompletedLiveClasses, useStartLiveClass } from "./hooks/useLiveClass";
import { queryClient } from "@/config";
import { sileo } from "sileo";
import { useNavigate } from "react-router-dom";
import { useGetPrograms } from "../Programs/hooks/useGetPrograms";
import { useTeachersSummary } from "../Teacher/hooks/useTeachersSummary";
import {
  EmptyLiveClassState, LiveClassCard, LiveClassSection, LiveClassStats,
  StartLiveClassModal, DateFilter, Pagination,
} from "#components/live-classes/index";
import ScheduleLiveClassForm from "#components/live-classes/components/ScheduleLiveClassForm";
import StartLiveClassForm from "#components/live-classes/components/StartLiveClassForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { mapToLabelValue } from "@/lib/utils";
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group";
import { CalendarDays, Radio, Video } from "lucide-react";

const dummyStats = {
  totalClasses: 24,
  totalStudents: 342,
  hoursTaught: 86,
  avgAttendance: 78,
};

const today = () => new Date().toISOString().slice(0, 10);

function CardGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-[200px] w-full rounded-xl bg-muted animate-pulse" />
      ))}
    </div>
  );
}

function ClassGrid({ sessions, variant, onStart, onJoin }: {
  sessions: ILiveSession[];
  variant: "LIVE" | "UPCOMING" | "ENDED";
  onStart?: (id: string) => void;
  onJoin?: (roomName: string) => void;
}) {
  if (sessions.length === 0) return <EmptyLiveClassState />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sessions.map((liveClass) => (
        <LiveClassCard
          key={liveClass.id}
          liveClass={liveClass}
          variant={variant}
          onStart={onStart}
          onJoin={onJoin}
        />
      ))}
    </div>
  );
}

export default function LiveClassPage() {
  const navigate = useNavigate();
  const startLiveClassMutation = useStartLiveClass();

  const { data: teachersData } = useTeachersSummary();
  const { data: programData } = useGetPrograms();
  const teachers = teachersData?.teachers ?? [];
  const allPrograms = programData?.programs || [];

  const [selectedClass, setSelectedClass] = useState<ILiveSession | null>(null);
  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState<"live" | "schedule">("live");
  const [startModalOpen, setStartModalOpen] = useState(false);
  const [tab, setTab] = useState("live");

  const [upcomingFilters, setUpcomingFilters] = useState({ startDate: today(), endDate: "", page: 1 });
  const [activePage, setActivePage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);

  const { data: upcomingData, isLoading: upcomingLoading } = useUpcomingLiveClasses({
    page: upcomingFilters.page,
    limit: 20,
    startDate: upcomingFilters.startDate || undefined,
    endDate: upcomingFilters.endDate || undefined,
  });
  const { data: activeData, isLoading: activeLoading } = useActiveLiveClasses({ page: activePage, limit: 20 });
  const { data: completedData, isLoading: completedLoading } = useCompletedLiveClasses({ page: completedPage, limit: 20 });

  const upcomingClasses = upcomingData?.sessions ?? [];
  const upcomingPagination = upcomingData?.pagination;
  const activeClasses = activeData?.sessions ?? [];
  const activePagination = activeData?.pagination;
  const completedClasses = completedData?.sessions ?? [];
  const completedPagination = completedData?.pagination;
// console.log(upcomingData,"upcomingData")
  const handleStart = useCallback((liveClass: ILiveSession) => {
    setSelectedClass(liveClass);
    setStartModalOpen(true);
  }, []);

  const handleLiveClassStarted = useCallback(() => {
    startLiveClassMutation.mutate(selectedClass?.id || "", {
      onSuccess: async (data) => {
        setStartModalOpen(false);
        await queryClient.invalidateQueries({ queryKey: ["live-classes", "upcoming"] });
        await queryClient.invalidateQueries({ queryKey: ["live-classes", "active"] });
        sileo.success({
          title: "Live Class Started",
          description: "Your live class is now active. Students can join using the link.",
        });
        const route = `/live-classes/${data.roomName}/class-room`;
        setTimeout(() => navigate(route), 3000);
      },
      onError: (error) => {
        sileo.error({
          title: "Failed to Start",
          description: error.message || "An error occurred while starting the live class. Please try again.",
        });
      },
    });
  }, [selectedClass, startLiveClassMutation, navigate]);

  const handleLiveClassJoin = useCallback((roomName: string) => {
    navigate(`/live-classes/${roomName}/class-room`);
  }, [navigate]);

  const handleUpcomingStart = useCallback((id: string) => {
    const found = upcomingClasses.find((c) => c.id === id);
    if (found) handleStart(found);
  }, [upcomingClasses, handleStart]);

  return (
    <div className="space-y-8 p-6">
      <style>{`
        @keyframes tab-fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .tab-content[data-state="active"] {
          animation: tab-fade-in 0.2s ease-out;
        }
      `}</style>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Live Classes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Schedule, manage, and start your real-time teaching sessions.
          </p>
        </div>
        <ButtonGroup>
          <Button variant="secondary" size="sm" onClick={() => { setModalType("live"); setOpen(true); }}>
            Start New Class
          </Button>
          <ButtonGroupSeparator />
          <Button variant="secondary" size="sm" onClick={() => { setModalType("schedule"); setOpen(true); }}>
            Schedule Class
          </Button>
        </ButtonGroup>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>{modalType === "live" ? "Start Live Class" : "Schedule Live Class"}</DialogTitle>
              <DialogDescription>
                {modalType === "live" ? "Start a class immediately." : "Schedule a class for later."}
              </DialogDescription>
            </DialogHeader>
            {modalType === "live" ? (
              <StartLiveClassForm
                onSuccess={() => setOpen(false)}
                teachersOptions={mapToLabelValue(teachers, "name", "id")}
                programOptions={mapToLabelValue(allPrograms, "name", "id")}
              />
            ) : (
              <ScheduleLiveClassForm
                onSuccess={() => setOpen(false)}
                teachersOptions={mapToLabelValue(teachers, "name", "id")}
                programOptions={mapToLabelValue(allPrograms, "name", "id")}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <LiveClassStats stats={dummyStats} />

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList variant="line" className="mb-2">
          <TabsTrigger value="live" className="gap-4 cursor-pointer">
            <Video className="h-4 w-4" />
            Live
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="gap-4 cursor-pointer">
            <CalendarDays className="h-4 w-4" />
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-4 cursor-pointer">
            <Radio className="h-4 w-4" />
            Completed
          </TabsTrigger>
        </TabsList>

        {/* Live Tab */}
        <TabsContent value="live" className="tab-content space-y-4">
          <LiveClassSection title="Active Now" description="Currently live sessions.">
            {activeLoading ? (
              <CardGridSkeleton />
            ) : (
              <ClassGrid
                sessions={activeClasses}
                variant="LIVE"
                onJoin={handleLiveClassJoin}
              />
            )}
          </LiveClassSection>
          {activePagination && (
            <Pagination
              page={activePage}
              totalPages={activePagination.totalPages}
              total={activePagination.total}
              onPageChange={setActivePage}
            />
          )}
        </TabsContent>

        {/* Upcoming Tab */}
        <TabsContent value="upcoming" className="tab-content space-y-4">
          <DateFilter
            startDate={upcomingFilters.startDate}
            endDate={upcomingFilters.endDate}
            onStartDateChange={(d) => setUpcomingFilters((f) => ({ ...f, startDate: d, page: 1 }))}
            onEndDateChange={(d) => setUpcomingFilters((f) => ({ ...f, endDate: d, page: 1 }))}
            onClear={() => setUpcomingFilters({ startDate: "", endDate: "", page: 1 })}
          />
          <LiveClassSection title="Upcoming Sessions" description="Classes scheduled to start soon.">
            {upcomingLoading ? (
              <CardGridSkeleton />
            ) : (
              <ClassGrid
                sessions={upcomingClasses}
                variant="UPCOMING"
                onStart={handleUpcomingStart}
                onJoin={handleLiveClassJoin}
              />
            )}
          </LiveClassSection>
          {upcomingPagination && (
            <Pagination
              page={upcomingFilters.page}
              totalPages={upcomingPagination.totalPages}
              total={upcomingPagination.total}
              onPageChange={(p) => setUpcomingFilters((f) => ({ ...f, page: p }))}
            />
          )}
        </TabsContent>

        {/* Completed Tab */}
        <TabsContent value="completed" className="tab-content space-y-4">
          <LiveClassSection title="Completed Sessions" description="Classes that have ended.">
            {completedLoading ? (
              <CardGridSkeleton />
            ) : (
              <ClassGrid sessions={completedClasses} variant="ENDED" />
            )}
          </LiveClassSection>
          {completedPagination && (
            <Pagination
              page={completedPage}
              totalPages={completedPagination.totalPages}
              total={completedPagination.total}
              onPageChange={setCompletedPage}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Start Modal */}
      {selectedClass && (
        <StartLiveClassModal
          liveClass={selectedClass}
          open={startModalOpen}
          onOpenChange={setStartModalOpen}
          onStarted={handleLiveClassJoin}
        />
      )}
    </div>
  );
}
