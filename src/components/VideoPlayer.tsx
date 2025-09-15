// @ts-nocheck
import React, { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import screenfull from "screenfull";
import { db } from "../utils/firebase";
import { getDatabase, ref, onValue, off, set } from "firebase/database";
import { FirebaseService } from "../utils/firebaseService";
import { SearchResult } from "../interfaces/searchResult";

export default function VideoPlayer() {
  const [urlState, setUrlState] = useState();
  const playerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.2);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [played, setPlayed] = useState(null);
  const [time, setTime] = useState(0);
  const [queueIndex, setQueueIndex] = useState(1000);
  const [queuedVids, setQueuedVids] = useState<SearchResult[]>([]);

  const service = new FirebaseService();

  // set listener for first
  // useEffect(() => {
  //   const urlRef = ref(db, "url");
  //   const unsubscribe = onValue(urlRef, (snapshot) => {
  //     const data = snapshot.val();
  //     setUrlState(data);
  //   });

  //   return () => {
  //     // Clean up the listener when the component unmounts
  //     off(urlRef, "value", unsubscribe);
  //   };
  // }, []);
  useEffect(() => {
    console.log(urlState);
  }, [urlState]);
  useEffect(() => {
    // const urlRef = ref(db, "url");
    const queueRef = ref(db, "queue/queue1");
    const queueIndexRef = ref(db, "queueIndex");

    const queueUnsubscribe = onValue(queueIndexRef, (snapshot) => {
      const index = snapshot.val();
      setQueueIndex(index - 1);
      console.log("QUEUE INDEX CHANGED");
      console.log(queueIndex);
      console.log(index);
    });

    const unsubscribe = onValue(queueRef, (snapshot) => {
      const data = snapshot.val();
      const queueArray = Object.values(data) as SearchResult[];
      console.log("WEITJWOGJWGOI");
      console.log("referecem", queueIndex);
      setQueuedVids(queueArray);
      console.log(queueArray);
      // setUrlState(queueArray[queueIndex].videoUrl);
      console.log(urlState);
    });

    return () => {
      // Clean up the listener when the component unmounts
      // off(urlRef, "value", unsubscribe);
      off(queueIndex, "value", queueUnsubscribe);
    };
  }, []);

  useEffect(() => {
    // console.log("SHIT");
    // console.log(queueIndex);
    // console.log("search reuslts  tis", queuedVids);
    if (queuedVids.length) {
      setUrlState(queuedVids[queueIndex].videoUrl);
    }
  }, [queueIndex]);

  useEffect(() => {
    if (queuedVids.length && queueIndex !== -1) {
      // this shit cost me like 30 mins WTF
      setUrlState(queuedVids[queueIndex].videoUrl);
    }
  }, [queuedVids]);

  useEffect(() => {
    const statusRef = ref(db, "status");
    const rateRef = ref(db, "rate");
    const timeRef = ref(db, "time");

    const statusUnsubscribe = onValue(statusRef, (snapshot) => {
      const status = snapshot.val();
      setPlaying(status === "playing");
      //   console.log(status);
    });

    const rateUnsubscribe = onValue(rateRef, (snapshot) => {
      const rate = snapshot.val();
      setPlaybackRate(rate);
    });

    const timeUnsubscribe = onValue(timeRef, (snapshot) => {
      const time = snapshot.val();
      setPlayed(time);
      //   console.log("time", time);
      playerRef.current.seekTo(time);
    });

    // setUrlState(queuedVids[queueIndex].videoUrl);
    return () => {
      off(statusRef, "value", statusUnsubscribe);
      off(rateRef, "value", rateUnsubscribe);
      off(timeRef, "value", timeUnsubscribe);
    };
  }, []);

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    // setPlayed(time);
    set(ref(db, "time"), time);
    // playerRef.current.seekTo(time);
  };

  const handlePlay = () => {
    setPlaying(true);
    set(ref(db, "status"), "playing");
    // playerRef.current.seekTo(played);
  };

  const handlePause = () => {
    setPlaying(false);
    set(ref(db, "status"), "paused");
  };

  const forceSync = () => {
    set(ref(db, "time"), time);
    playerRef.current.seekTo(time);
    // set(ref(db, "status"), playing ? "playing" : "paused");
    set(ref(db, "rate"), playbackRate);
  };

  function handleProgress({ played }) {
    // console.log("played", played);
    // setPlayed(played);
    // check if played is more than 3 seconds away from the current time
    if (Math.abs(played - time) > 0.05) {
      console.log("SETTING TIME NOW");
      set(ref(db, "time"), played);
    }
    setTime(played);
    // set(ref(db, "time"), played);
  }

  function handleNext() {
    console.log("NEXT NOW");
    console.log(queueIndex);
    console.log(queuedVids.length);
    if (queueIndex + 1 === queuedVids.length) {
      // setQueueIndex(0);
    } else {
      service.setQueueIndex(queueIndex + 2);
    }
  }

  function testFunc() {
    console.log(queueIndex);
    console.log(urlState);
  }
  return (
    <div>
      <button onClick={testFunc}>AKSdnasijdn</button>
      <ReactPlayer
        ref={playerRef}
        className="react-player"
        url={urlState}
        playing={playing}
        volume={volume}
        playbackRate={playbackRate}
        onProgress={handleProgress}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleNext}
        // onSeek={() => console.log("SEEKING")}
        controls={true}
      />
      <button onClick={() => setPlaying(!playing)}>
        {playing ? "Pause" : "Play"}
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step="any"
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
      />
      <button onClick={() => setPlaybackRate(0.5)}>0.5x</button>
      <button onClick={() => setPlaybackRate(1.0)}>1x</button>
      <button onClick={() => setPlaybackRate(1.5)}>1.5x</button>
      <button onClick={() => setPlaybackRate(2.0)}>2x</button>
      <input
        type="range"
        min={0}
        max={1}
        step="any"
        value={time}
        onChange={handleSeek}
      />
      <button
        onClick={() =>
          screenfull.request(document.querySelector(".react-player"))
        }
      >
        Fullscreen
      </button>
      <button onClick={forceSync}>Force Sync</button>
    </div>
  );
}
