import { useCallback, useEffect, useRef } from "react";
import { ParticipantEvent, TrackSource } from "@mux/spaces";

const Participant = ({ participant }) => {
  const videoEl = useRef(null);

  const attachCameraTrack = useCallback((track) => {
    const el = videoEl.current;
    if (!el) {
      return;
    }
    if (track.source === TrackSource.Camera) {
      track.attach(el);
    }
  }, []);

  useEffect(() => {
    const cameraTrack = participant
      .getVideoTracks()
      .find((videoTrack) => videoTrack.source === TrackSource.Camera);

    if (cameraTrack) {
      attachCameraTrack(cameraTrack);
    }

    participant.on(ParticipantEvent.TrackSubscribed, attachCameraTrack);

    return () => {
      participant.off(ParticipantEvent.TrackSubscribed, attachCameraTrack);
    };
    
  }, [participant, attachCameraTrack]);

  return (
    <div>
      <h2>{participant.connectionId}</h2>
      <video
        ref={videoEl}
        autoPlay
        playsInline
        muted
        style={{ width: `400px` }}
      />
    </div>
  );
};

export default Participant;