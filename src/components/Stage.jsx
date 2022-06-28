import { useCallback, useEffect, useRef, useState } from "react";
import { Space, SpaceEvent } from "@mux/spaces";

import Participant from "./Participant";

// 🚨 Don’t forget to add your own JWT!
const JWT =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJBbWpPWVp2MDF3blBoQ2tUOVBnM1VweFpWSG5oYWo2QkJOWGpuZ1dxYUZ6SSIsImV4cCI6MTY1NjAxNDUzMjc3Miwia2lkIjoic2dYaGpZMDFNVG1LeExrRnNLV2F0MDBoU0ZOSnJ3VUEwMll5aTAxQklGemxjM1kiLCJhdWQiOiJydCIsInJvbGUiOiJwdWJsaXNoZXIiLCJpYXQiOjE2NTYwMTQ0ODl9.EDUikFWsBn1tGg7zHPaEZ8AEb1Oc2RO8IyGa4bgnmBIxu9dok_4tUGlneIaCQ1nZ1THpDnEbaum0jiVMWp7y7mcsE75XwM1dTRSYm1ZG1la-2PX1zzyDYYn_8AVyveD_moF7Zcmsia33gTdSGzXDM7YP4hWpy9rzbqOIE0Do8hdU8skbhkjM_FxvRkUTTd8-XSV2vZtSdHtw8nang0uPXD5bGWsN2TpTGGmH5Iq7vYPA6XK8kUUf3gx0grQHtAwBiSSO1cZiVnvbFbXFoaknWW8BUGZvzzXcS2BpsI1lFCdH4EGhzriXvGpKhnJ45YGmqhMYKWvocCJ3NwBOjuzdCg";

function App() {
  const spaceRef = useRef(null);
  const [localParticipant, setLocalParticipant] = useState(null);

  // Our list of participants in React state
  const [participants, setParticipants] = useState([]);

  // Set the participant state to the current participants and the new one
  const addParticipant = useCallback(
    (participant) => {
      setParticipants((currentParticipants) => [
        ...currentParticipants,
        participant,
      ]);
    },
    [setParticipants]
  );

  // Filter out the participant who left and set the participant state
  const removeParticipant = useCallback(
    (participantLeaving) => {
      setParticipants((currentParticipants) =>
        currentParticipants.filter(
          (currentParticipant) =>
            currentParticipant.connectionId !== participantLeaving.connectionId
        )
      );
    },
    [setParticipants]
  );

  useEffect(() => {
    const space = new Space(JWT);

    // Setup event listeners for other people joining and leaving
    space.on(SpaceEvent.ParticipantJoined, addParticipant);
    space.on(SpaceEvent.ParticipantLeft, removeParticipant);
    spaceRef.current = space;

    return () => {
      // Cleanup event listeners when the component is unmounted
      space.off(SpaceEvent.ParticipantJoined, addParticipant);
      space.off(SpaceEvent.ParticipantLeft, removeParticipant);
    };
  }, [addParticipant, removeParticipant]);

  const join = useCallback(async () => {
    // Join the Space
    let localParticipant = await spaceRef.current.join();

    // Get and publish our local tracks
    let localTracks = await localParticipant.getUserMedia({
      audio: true,
      video: true,
    });
    await localParticipant.publishTracks(localTracks);

    // Set the local participant so it will be rendered
    setLocalParticipant(localParticipant);
  }, []);

  return (
    <div className="App">
      <button onClick={join}>Join</button>

      {localParticipant && (
        <Participant
          key={localParticipant.connectionId}
          participant={localParticipant}
        />
      )}

      {participants.map((participant) => {
        return (
          <Participant
            key={participant.connectionId}
            participant={participant}
          />
        );
      })}
    </div>
  );
}

export default App;
