// @ts-nocheck
import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import VideoPlayer from "./components/VideoPlayer";
import { db } from "../src/utils/firebase";
import {
  getDatabase,
  ref,
  set,
  onValue,
  onDisconnect,
  off,
  increment,
} from "firebase/database";
import axios from "axios";
import SearchMenu from "./components/SearchMenu";
import Queue from "./components/queue/QueueItem";
import { FirebaseService } from "./utils/firebaseService";

function App() {
  const [count, setCount] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState("");
  const service = new FirebaseService();
  const [connections, setConnections] = useState(0);

  // useEffect(() => {
  //   // const urlRef = ref(db, "url");
  //   const connectionRef = ref(db, "connections");
  //   if (connections === 0) {
  //     // clear the queue
  //     set(ref(db, "queue/queue1"), null);
  //   }

  //   set(ref(db, "connections"), connections + 1);
  //   console.log(connections);

  //   const unsubscribe = onValue(connectionRef, (snapshot) => {
  //     const data = snapshot.val();
  //     setConnections(data);
  //   });

  //   return () => {
  //     // Clean up the listener when the component unmounts
  //     off(connectionRef, "value", unsubscribe);
  //   };
  // }, []);

  // const conRef = ref(db, "connections");
  // onDisconnect(conRef).set(connections - 1);

  const connectionRef = ref(db, "connections");
  useEffect(() => {
    // Increment connections when component mounts
    set(ref(db, "connections"), increment(1));

    // Listener to update connections state
    const unsubscribe = onValue(connectionRef, (snapshot) => {
      const data = snapshot.val();
      setConnections(data);
    });

    // Cleanup on component unmount
    return () => {
      off(connectionRef, "value", unsubscribe);
    };
  }, []);

  onDisconnect(connectionRef).set(increment(-1));
  function writeUserData(url: string) {
    set(ref(db, "url"), url);
  }
  useEffect(() => {
    console.log("searchResults", searchResults);
  }, [searchResults]);

  return (
    <>
      <div className="wrapper">
        <SearchMenu />
        <div className="card">
          <VideoPlayer />
          <Queue />
        </div>
      </div>
      {/* create input to change url on realtime database */}
      {/* <button onClick={handleTest}></button> */}
      {/* <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </>
  );
}

export default App;
