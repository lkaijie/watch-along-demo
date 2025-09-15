// @ts-nocheck
import React, { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import screenfull from "screenfull";

export default function VideoPlayer() {
  const url = "https://www.youtube.com/watch?v=Gu5vTt8Bh9g";
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.2);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [played, setPlayed] = useState(0);
  const playerRef = useRef(null);

  //   useEffect(() => {
  //     // if (playing) {
  //     //   playerRef.current.seekTo(played);
  //     // }
  //   }, [playing]);

  //   useEffect(() => {
  //     playerRef.current.seekTo(played);
  //   }, [played]);

  const handleSeek = (e) => {
    setPlayed(parseFloat(e.target.value));
    playerRef.current.seekTo(parseFloat(e.target.value));
  };

  return (
    <div>
      <ReactPlayer
        ref={playerRef}
        className="react-player"
        url={url}
        playing={playing}
        volume={volume}
        playbackRate={playbackRate}
        onProgress={({ played }) => setPlayed(played)}
        onPlay={() => {
          if (!playing) setPlaying(true);
        }} // Add this line
        onPause={() => {
          if (playing) setPlaying(false);
        }} // Add this line
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
        value={played}
        onChange={handleSeek}
      />
      <button
        onClick={() =>
          screenfull.request(document.querySelector(".react-player"))
        }
      >
        Fullscreen
      </button>
    </div>
  );
}
