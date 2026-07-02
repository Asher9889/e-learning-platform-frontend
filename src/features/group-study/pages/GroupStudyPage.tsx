import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import { RoomStats } from "../components/RoomStats";
import { RoomFilters } from "../components/RoomFilters";
import { RoomCard } from "../components/RoomCard";
import { CreateRoomDialog } from "../components/CreateRoomDialog";
import { useGroupStudyRooms, useJoinGroupStudyRoom } from "../hooks/use-group-study";
import type { TRoomFilter } from "../types/group-study.types";
import { useAppSelector } from "@/store/hooks";
import { useProgramStudents } from "@/pages/Student/hooks/useGetProgramStudent";

const LIMIT = 12;

export function GroupStudyPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filter, setFilter] = useState<TRoomFilter>("ALL");
  const [page, setPage] = useState(1);
   const user = useAppSelector((state) => state.auth.user);
  const batchId = user?.roleInfo?.batchId;
  const {  studentOptions } = useProgramStudents(batchId);
  console.log(studentOptions,"useruseruseruseruseruseruseruser147")
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filter]);

  const params = useMemo(
    () => ({ page, limit: LIMIT, search: debouncedSearch || undefined, filter }),
    [page, debouncedSearch, filter]
  );

  const { data, isLoading, isPlaceholderData } = useGroupStudyRooms(params);
  const { mutate: joinRoom, isPending: isJoining, variables: joiningRoomName } =
    useJoinGroupStudyRoom();

  const handleJoin = (roomName: string) => {
    joinRoom(roomName, {
      onSuccess: (data) => {
        // navigate to the actual room/video page with the LiveKit token in state
        navigate(`/group-study/room/${roomName}`, { state: data });
      },
    });
  };

  const rooms = data?.rooms ?? [];
  const pagination = data?.pagination;
console.log(rooms,"roomsroomsroomsroomsrooms",data,"params",params)
  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Group Study Rooms</h1>
          <p className="text-sm text-muted-foreground">
            Create or join a peer study room with live audio + whiteboard.
          </p>
        </div>
        <CreateRoomDialog studentOptions={studentOptions}/>
      </div>

      <RoomStats />

      <RoomFilters
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      ) : rooms?.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-16 text-center">
          <Inbox className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium">No study rooms found</p>
          <p className="text-xs text-muted-foreground">
            Try a different filter or create the first room.
          </p>
        </div>
      ) : (
        <div
          className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 ${
            isPlaceholderData ? "opacity-60" : ""
          }`}
        >
          {rooms.map((room) => (
            <RoomCard
              key={room._id}
              room={room}
              onJoin={handleJoin}
              isJoining={isJoining && joiningRoomName === room.roomName}
            />
          ))}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
