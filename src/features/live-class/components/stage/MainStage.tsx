import { usePresenter } from "@/features/live-class/hooks/usePresenter";
import { usePresenterScreenShareTracks } from "@/features/live-class/hooks/usePresenterScreenShareTracks";
import { usePresenterTracks } from "@/features/live-class/hooks/usePresenterTracks";
import { ScreenShareStage } from "./ScreenShareStage";
import { EmptyState } from "@/features/live-class/components/shared/EmptyState";
import { User } from "lucide-react";

export function MainStage() {
  const presenter = usePresenter();
  const presenterIdentity = presenter?.identity ?? null;

  const screenShareTracks = usePresenterScreenShareTracks(presenterIdentity);
  const presenterCameraTracks = usePresenterTracks(presenterIdentity);

  const hasScreenShare = screenShareTracks.length > 0;
  const hasPresenterCamera = presenterCameraTracks.tracks.length > 0;

  if (hasScreenShare) {
    return (
      <div className="w-full h-full">
        <ScreenShareStage tracks={screenShareTracks} className="w-full h-full" />
      </div>
    );
  }

  if (hasPresenterCamera) {
    return (
      <div className="flex h-full w-full items-center justify-center p-4">
        <div className="w-full max-w-4xl aspect-video overflow-hidden rounded-xl border bg-muted">
          <div>remote</div>
          <div className=""> local</div>
        </div>
         <div className="w-full max-w-4xl aspect-video overflow-hidden rounded-xl border bg-muted">
          <div>remote</div>
          <div className=""> local</div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <EmptyState
        icon={User}
        title="Waiting for teacher"
        description="The class hasn't started yet. Stay tuned!"
        className="max-w-md"
      />
    </div>
  );
}
