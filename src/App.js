import logo from "./logo.svg";
import "./App.css";

import { createClient, LiveList, LiveObject } from "@liveblocks/client";
import { LiveblocksProvider, RoomProvider, useOthers } from "@liveblocks/react";

import Stage from "./components/Stage"

const client = createClient({
  publicApiKey: process.env.REACT_APP_LIVEBLOCKS_PUBLIC_API_KEY,
});

const initialPresence = {
  cursor: {
    x: 0,
    y: 0,
  },
};

const initialStorage = {
  animals: new LiveList(["🦁", "🦊", "🐵"]),
  scientist: new LiveObject({
    firstName: "Grace",
    lastName: "Hopper",
  }),
};

function Root() {
  const others = useOthers();

  return (
    <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        There are {others.count} other users with you in the room.
      </p>
      <Stage />
    </header>
  </div>
  )
}

function App() {

  return (
    <LiveblocksProvider client={client}>
      <RoomProvider
        id="my-room-id"
        initialPresence={initialPresence}
        initialStorage={initialStorage}
      >
        <Root />
      </RoomProvider>
    </LiveblocksProvider>
  );
}

export default App;
