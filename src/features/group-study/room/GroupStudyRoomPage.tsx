import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Mic,
  MicOff,
  PhoneOff,
  Square,
  Users,
  ScreenShare,
  ScreenShareOff,
  Eye,
  EyeOff,
  Paperclip,
  MessageCircle,
} from "lucide-react";
import {
  useLiveKitRoom,
  type IWhiteboardElement,
  type IViewportState,
  type IPresenterStatus,
  type IWhiteboardFile,
  type IActivityPing,
  type IChatMessage,
  type ISharedFile,
} from "../hooks/use-livekit-room";
import { useJoinGroupStudyRoom, useEndGroupStudyRoom } from "../hooks/use-group-study";
import { ExcalidrawBoard } from "./ExcalidrawBoard";
import { ConnectionState } from "livekit-client";
import type { ILiveKitJoinData } from "../types/group-study.types";
import { RoomAudioRenderer, RoomContext } from "@livekit/components-react";
import {  motion } from "framer-motion";
import { RightSidebar } from "./RightSidebar";
import { ChatPanel } from "./ChatPanel";
import { FilesPanel } from "./FilesPanel";
import { ParticipantPanel } from "./ParticipantPanel";

export function GroupStudyRoomPage() {
  const { roomName } = useParams<{ roomName: string }>();
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [incomingFile, setIncomingFile] = useState<IWhiteboardFile | null>(null);
  const stateData = location.state as ILiveKitJoinData | undefined;
  const [joinData, setJoinData] = useState<ILiveKitJoinData | undefined>(stateData);
  const [incomingElements, setIncomingElements] = useState<IWhiteboardElement[] | null>(null);
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [sharedFiles, setSharedFiles] = useState<ISharedFile[]>([]);
  // presenter-mode state
  const [incomingViewport, setIncomingViewport] = useState<IViewportState | null>(null);
  const [presenterIdentity, setPresenterIdentity] = useState<string | null>(null);
  const [presenterName, setPresenterName] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<"chat" | "files" | "participants">("chat");
  // bumped every time someone (including us) asks the current presenter
  // to resend their live viewport right now.
  const [viewportRequest, setViewportRequest] = useState<{
    requesterIdentity: string;
    nonce: number;
  } | null>(null);

  // NEW: latest activity ping per participant identity, keyed so repeated
  // pings from the same person just refresh their entry instead of piling up.
  const [activityPings, setActivityPings] = useState<Record<string, IActivityPing & { updatedAt: number }>>({});

  // NEW: one-shot "snap my own viewport here" request, bumped with a fresh
  // nonce each time so tapping the same badge twice still re-triggers.
  const [jumpToViewport, setJumpToViewport] = useState<{
    scrollX: number;
    scrollY: number;
    zoom: number;
    nonce: number;
  } | null>(null);

  const { mutate: joinRoom, isPending: isFetchingJoin } = useJoinGroupStudyRoom();
  const { mutate: endRoom, isPending: isEnding } = useEndGroupStudyRoom();

  useEffect(() => {
    if (joinData || !roomName) return;
    joinRoom(roomName, {
      onSuccess: (data) => setJoinData(data),
      onError: () => navigate("/group-study", { replace: true }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomName]);

  const handlePresenterStatus = (status: IPresenterStatus) => {
    if (status.presenting) {
      setPresenterIdentity(status.identity);
      setPresenterName(status.name);
      setIsFollowing(true);

      sendViewportRequest();
    } else if (status.identity === presenterIdentity) {
      setPresenterIdentity(null);
      setPresenterName(null);
      setIsFollowing(false);
    }
  };

  const handleParticipantLeft = (identity: string) => {
    setPresenterIdentity((current) => {
      if (current === identity) {
        setPresenterName(null);
        setIsFollowing(false);
        return null;
      }
      return current;
    });

    // NEW: drop their activity badge immediately rather than waiting for
    // the stale-ping sweep below.
    setActivityPings((prev) => {
      if (!(identity in prev)) return prev;
      const next = { ...prev };
      delete next[identity];
      return next;
    });
  };

  // NEW: activity badges expire on their own if that person stops editing —
  // otherwise a badge would linger forever after someone's last ping.
  useEffect(() => {
    const interval = setInterval(() => {
      setActivityPings((prev) => {
        const now = Date.now();
        let changed = false;
        const next: typeof prev = {};
        for (const [id, ping] of Object.entries(prev)) {
          if (now - ping.updatedAt < 5000) {
            next[id] = ping;
          } else {
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const {
    room,
    connectionState,
    participants,
    localParticipant,
    isMicEnabled,
    // error,
    toggleMic,
    sendWhiteboardElements,
    sendWhiteboardElementsPreview,
    sendViewportUpdate,
    sendPresenterStatus,
    sendWhiteboardFile,
    sendViewportRequest,
    sendActivityPing,
    // NEW
    sendChatMessage,
    sendSharedFile,
    leaveRoom,
  } = useLiveKitRoom({
    token: joinData?.liveKit.token,
    serverURL: joinData?.liveKit.serverURL,
    onWhiteboardMessage: setIncomingElements,
    onViewportMessage: setIncomingViewport,
    onPresenterStatusMessage: handlePresenterStatus,
    onParticipantLeft: handleParticipantLeft,
    onFileMessage: setIncomingFile,
    onViewportRequestMessage: (requesterIdentity) =>
      setViewportRequest({ requesterIdentity, nonce: Date.now() }),
    // NEW: someone (not presenting) is editing elsewhere — keep/refresh
    // their badge entry.
    onActivityMessage: (activity) =>
      setActivityPings((prev) => ({
        ...prev,
        [activity.identity]: { ...activity, updatedAt: Date.now() },
      })),
    // NEW
    onChatMessage: (chat) => {
      setMessages((prev) => [...prev, chat]);
    },

    // NEW
    onSharedFileMessage: (file) => {
      setSharedFiles((prev) => [...prev, file]);
    },
  });

  const handleLeave = () => {
    if (isPresenting) sendPresenterStatus(false);
    leaveRoom();
    navigate("/group-study");
  };

  const handleEndRoom = () => {
    if (!joinData?.room.id) return;
    if (isPresenting) sendPresenterStatus(false);
    endRoom(joinData.room.id, {
      onSuccess: () => {
        leaveRoom();
        navigate("/group-study");
      },
    });
  };

  const isConnecting =
    isFetchingJoin ||
    !joinData ||
    !room ||
    connectionState === ConnectionState.Connecting ||
    connectionState === ConnectionState.Disconnected;

  if (isConnecting) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Joining study room...</p>
      </div>
    );
  }
console.log(localParticipant,"localParticipant1455114")
const metaData = JSON.parse(localParticipant?.metadata ?? "{}");
            const isCreator = metaData?.roomCreator;
  {/* const isCreator = localParticipant?.permissions?.roomAdmin ?? false; */}

  // derived presenter-mode flags
  const isPresenting = !!localParticipant && localParticipant.identity === presenterIdentity;
  const isSomeoneElsePresenting = !!presenterIdentity && !isPresenting;

  const handleTogglePresenting = () => {
    if (isPresenting) {
      sendPresenterStatus(false);
      setPresenterIdentity(null);
      setPresenterName(null);
    } else {
      sendPresenterStatus(true);
      setPresenterIdentity(localParticipant!.identity);
      setPresenterName(localParticipant!.name || localParticipant!.identity);
    }
  };

  const handleSendMessage = (text: string) => {
    if (!localParticipant) return;

    const chat: IChatMessage = {
      id: crypto.randomUUID(),
      senderId: localParticipant.identity,
      senderName:
        localParticipant.name ||
        localParticipant.identity,
      message: text,
      timestamp: Date.now(),
    };

    // Local UI update
    setMessages((prev) => [...prev, chat]);

    // LiveKit par send
    sendChatMessage(chat);
  };
  const handleUploadFile = (selectedFile: File) => {
    const reader = new FileReader();

    reader.onload = () => {
      const sharedFile: ISharedFile = {
        id: crypto.randomUUID(),

        senderId: localParticipant?.identity || "",

        senderName:
          localParticipant?.name ||
          localParticipant?.identity ||
          "Unknown",

        fileName: selectedFile.name,

        mimeType: selectedFile.type,

        size: selectedFile.size,

        dataURL: reader.result as string,
      };

      // Sender ko bhi turant dikhe
      setSharedFiles((prev) => [...prev, sharedFile]);

      // Baaki participants ko bhejo
      sendSharedFile(sharedFile);
    };

    reader.readAsDataURL(selectedFile);
  };
  const handleToggleFollow = () => {
    const next = !isFollowing;
    setIsFollowing(next);
    if (next) sendViewportRequest();
  };

  // NEW: tapping someone's activity badge snaps our own viewport to them,
  // once — not a continuous follow like the presenter banner above.
  const handleJumpToActivity = (ping: IActivityPing) => {
    setJumpToViewport({
      scrollX: ping.scrollX,
      scrollY: ping.scrollY,
      zoom: ping.zoom,
      nonce: Date.now(),
    });
  };

  // NEW: the active presenter already has their own always-on banner/follow
  // UI, so exclude them here to avoid a redundant badge.
  const visibleActivity = Object.values(activityPings).filter(
    (p) => p.identity !== presenterIdentity
  );

  return (
    <RoomContext.Provider value={room}>
      <div className="flex h-[calc(100vh-4rem)] flex-col gap-4 p-4 sm:p-6">

        {/* <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-lg font-semibold">{joinData.room.name}</h1>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <Users className="h-3 w-3" />
                {participants.length}
              </Badge>
              <Badge
                variant="outline"
                className={
                  connectionState === ConnectionState.Connected
                    ? "border-green-300 bg-green-100 text-green-700"
                    : "border-amber-300 bg-amber-100 text-amber-700"
                }
              >
                {connectionState}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={isPresenting ? "default" : "outline"}
              size="sm"
              onClick={handleTogglePresenting}
              disabled={isSomeoneElsePresenting}
              title={
                isSomeoneElsePresenting
                  ? `${presenterName} is currently presenting`
                  : undefined
              }
            >
              {isPresenting ? (
                <ScreenShareOff className="h-4 w-4" />
              ) : (
                <ScreenShare className="h-4 w-4" />
              )}
              <span className="ml-1.5 hidden sm:inline">
                {isPresenting ? "Stop Presenting" : "Present"}
              </span>
            </Button>

            <Button variant={isMicEnabled ? "outline" : "secondary"} size="sm" onClick={toggleMic}>
              {isMicEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              <span className="ml-1.5 hidden sm:inline">{isMicEnabled ? "Mute" : "Unmute"}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSidebarTab("chat");
                setIsSidebarOpen(true);
              }}
            >
              Chat
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSidebarTab("files");
                setIsSidebarOpen(true);
              }}
            >
              Files
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSidebarTab("participants");
                setIsSidebarOpen(true);
              }}
            >
              Users
            </Button>

            {isCreator && (
              <Button variant="destructive" size="sm" onClick={handleEndRoom} disabled={isEnding}>
                {isEnding ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Square className="h-4 w-4" />
                )}
                <span className="ml-1.5 hidden sm:inline">End Room</span>
              </Button>
            )}

            <Button variant="outline" size="sm" onClick={handleLeave}>
              <PhoneOff className="h-4 w-4" />
              <span className="ml-1.5 hidden sm:inline">Leave</span>
            </Button>
          </div>
        </div> */}

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#355bc4] px-4 py-3 sm:px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/15">
              <ScreenShare className="h-4.5 w-4.5 text-primary-foreground" />
            </div>

            <div>
              <h1 className="text-[15px] font-semibold text-primary-foreground">
                {joinData.room.name}
              </h1>

              <div className="mt-0.5 flex items-center gap-3">
                <span className="flex items-center gap-1 text-xs text-primary-foreground/80">
                  <Users className="h-3 w-3" />
                  {participants.length} in room
                </span>

                <span className="flex items-center gap-1.5 text-xs text-primary-foreground/80">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${connectionState === ConnectionState.Connected
                        ? "bg-green-400"
                        : "bg-amber-400"
                      }`}
                  />
                  {connectionState === ConnectionState.Connected ? "Connected" : connectionState}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant={isPresenting ? "secondary" : "ghost"}
              size="sm"
              onClick={handleTogglePresenting}
              disabled={isSomeoneElsePresenting}
              title={
                isSomeoneElsePresenting
                  ? `${presenterName} is currently presenting`
                  : undefined
              }
              className="h-8 gap-1.5 px-2.5 text-xs text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground"
            >
              {isPresenting ? (
                <ScreenShareOff className="h-3.5 w-3.5" />
              ) : (
                <ScreenShare className="h-3.5 w-3.5" />
              )}
              <span className="hidden sm:inline">
                {isPresenting ? "Stop Presenting" : "Present"}
              </span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMic}
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground"
              aria-label={isMicEnabled ? "Mute" : "Unmute"}
            >
              {isMicEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSidebarTab("chat");
                setIsSidebarOpen(true);
              }}
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground"
              aria-label="Chat"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSidebarTab("files");
                setIsSidebarOpen(true);
              }}
              className="relative h-8 w-8 text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground"
              aria-label="Files"
            >
              <Paperclip className="h-4 w-4" />
              {sharedFiles.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-medium text-white">
                  {sharedFiles.length}
                </span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSidebarTab("participants");
                setIsSidebarOpen(true);
              }}
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground"
              aria-label="Participants"
            >
              <Users className="h-4 w-4" />
            </Button>

            {isCreator && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleEndRoom}
                disabled={isEnding}
                className="h-8 w-8 text-primary-foreground hover:bg-red-500/20 hover:text-red-100"
                aria-label="End Room"
              >
                {isEnding ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Square className="h-4 w-4" />
                )}
              </Button>
            )}

            <Button
              onClick={handleLeave}
              size="sm"
              className="h-8 gap-1.5 bg-primary-foreground px-2.5 text-xs text-primary hover:bg-primary-foreground/90"
            >
              <PhoneOff className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Leave</span>
            </Button>
          </div>
        </div>

        <div ref={containerRef} className="relative flex-1 overflow-hidden rounded-xl border bg-background">
          {isSomeoneElsePresenting && (
            <motion.div
              drag
              dragConstraints={containerRef}
              dragMomentum={false}
              className="absolute left-1/2 top-4 z-20 flex items-center gap-2 rounded-full border bg-background/95 px-3 py-1.5 text-xs shadow-lg backdrop-blur-md cursor-grab active:cursor-grabbing"
            >
              <ScreenShare className="h-3.5 w-3.5 text-primary" />

              <span>
                {isFollowing ? "Following" : "Not following"}{" "}
                <span className="font-semibold">{presenterName}</span>
              </span>

              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={handleToggleFollow}
              >
                {isFollowing ? (
                  <>
                    <EyeOff className="mr-1 h-3 w-3" />
                    Stop
                  </>
                ) : (
                  <>
                    <Eye className="mr-1 h-3 w-3" />
                    Follow
                  </>
                )}
              </Button>
            </motion.div>
          )}

          <ExcalidrawBoard
            onLocalChange={sendWhiteboardElements}
            onLocalPreviewChange={sendWhiteboardElementsPreview}
            incomingElements={incomingElements}
            isPresenting={isPresenting}
            isFollowing={isFollowing}
            incomingViewport={incomingViewport}
            activePresenterIdentity={presenterIdentity}
            onViewportChange={sendViewportUpdate}
            viewportRequest={viewportRequest}
            onFileAdd={sendWhiteboardFile}
            incomingFile={incomingFile}
            onActivityPing={sendActivityPing}
            jumpToViewport={jumpToViewport}
          />

          {/* NEW: badges for users editing elsewhere without presenting —
              tap one to jump your own view there. */}
          {visibleActivity.length > 0 && (
            <div className="absolute bottom-4 right-4 z-20 flex flex-col items-end gap-2">
              {visibleActivity.map((p) => (
                <button
                  key={p.identity}
                  onClick={() => handleJumpToActivity(p)}
                  className="flex items-center gap-2 rounded-full border bg-background/95 px-3 py-1.5 text-xs shadow-lg backdrop-blur-md hover:bg-accent"
                >
                  <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
                  <span className="font-medium">{p.name}</span>
                  <span className="text-muted-foreground">is drawing</span>
                </button>
              ))}
            </div>
          )}

          {/* <AnimatePresence>

            {isSidebarOpen && (

              <motion.div

                initial={{ x: 350 }}

                animate={{ x: 0 }}

                exit={{ x: 350 }}

                transition={{
                  duration: 0.25
                }}

                className="absolute right-0 top-0 z-30 h-full w-[360px] border-l bg-background shadow-xl"

              >

                <div className="flex items-center justify-between border-b p-4">

                  <h2 className="font-semibold capitalize">
                    {sidebarTab}
                  </h2>

                  <Button

                    variant="ghost"

                    size="icon"

                    onClick={() => setIsSidebarOpen(false)}

                  >

                    ✕

                  </Button>

                </div>
                <div className="h-[calc(100%-65px)] overflow-auto">
                  {sidebarTab === "chat" && (
                    <ChatPanel />
                  )}

                  {sidebarTab === "files" && (
                    <FilesPanel />
                  )}

                  {sidebarTab === "participants" && (
                    <ParticipantList />
                  )}
                </div>

              </motion.div>

            )}

          </AnimatePresence> */}
          <RightSidebar
            open={isSidebarOpen}
            title={sidebarTab}
            onClose={() => setIsSidebarOpen(false)}
          >

            {sidebarTab === "chat" && (
              <ChatPanel
                messages={messages}
                onSend={handleSendMessage}
              />
            )}

            {sidebarTab === "files" && (
              <FilesPanel
                files={sharedFiles}
                onUpload={handleUploadFile}
              />
            )}

            {sidebarTab === "participants" && (
              <ParticipantPanel
                participants={participants}
                localParticipant={localParticipant}
              />
            )}

          </RightSidebar>
        </div>

        <RoomAudioRenderer />
      </div>
    </RoomContext.Provider>
  );
}