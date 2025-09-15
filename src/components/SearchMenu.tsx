import { useEffect, useState } from "react";
import { API_KEY } from "../../config.ts";
import axios from "axios";
import { FirebaseService } from "../utils/firebaseService.ts";
import { SearchResult } from "../interfaces/searchResult.ts";
import SearchDisplay from "./SearchDisplay.tsx";
// import { set } from "firebase/database";

export default function SearchMenu() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const service = new FirebaseService();

  const [showSearch, setShowSearch] = useState(false);

  function testFunc() {
    // service.addDubbyToQueue();
    service.testFunc();
  }

  // interface SearchResult {
  //   title: string;
  //   artist: string;
  //   description: string;
  //   thumbnail: string;
  //   videoUrl: string;
  // }

  function getSearch(num: number = 50) {
    // console.log(API_KEY);
    axios
      .get(
        `https://youtube.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${query}&key=${API_KEY}&maxResults=${num}&hl=en`
      )
      .then((res) => {
        const results = res.data.items.map((item: any): SearchResult => {
          return {
            title: item.snippet.title,
            artist: item.snippet.channelTitle,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails.default.url,
            videoUrl: "https://www.youtube.com/watch?v=" + item.id.videoId,
          };
        });
        setSearchResults(results);
        setShowSearch(true);
        if (num === 1) {
          // service.updateVideo(results[0].videoUrl);
          service.addToQueue1(results[0]);
          // service.addToQueue(results[0].videoUrl);
        } else {
        }
      });
  }
  useEffect(() => {
    if (searchResults.length != 0) {
      console.log(searchResults[0].title);
      console.log(searchResults[0].videoUrl);
    }
  }, [searchResults]);

  function clearSearch() {
    // setQuery("");
    setShowSearch(false);
    // setSearchResults([]);
  }
  return (
    <div>
      <p onClick={testFunc}>Search Bar</p>
      <input
        type="text"
        value={query}
        onFocus={() => {
          setShowSearch(true);
        }}
        onChange={(e) => {
          setQuery(e.target.value);
          // if (e.target.value === "") {
          //   setSearchResults([]);
          // } else getSearch();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            // getSearch(1);
            // setQuery("");
            // // clear searchResults
            // setSearchResults([]);
            if (query === "") {
              setSearchResults([]);
            } else getSearch();
          }
        }}
        tabIndex={0}
      />
      <div className="" style={{ position: "relative" }}>
        <ul
          style={{
            position: "absolute",
            width: "400px",
            maxHeight: "500px",
            overflowY: "scroll",
            overflowX: "hidden",
            margin: "auto",
            left: "0",
            right: "0",
          }}
        >
          {showSearch
            ? searchResults.map((result) => {
                return (
                  <SearchDisplay parentCallback={clearSearch} info={result} />
                );
              })
            : null}
        </ul>
      </div>
    </div>
  );
}
