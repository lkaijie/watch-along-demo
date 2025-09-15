import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { SearchResult } from "../interfaces/searchResult.ts";
import { FirebaseService } from "../utils/firebaseService.ts";
import "./search-display.css";

export default function SearchDisplay({
  info,
  parentCallback,
}: {
  info: SearchResult;
  parentCallback: any;
}) {
  const service = new FirebaseService();

  function handleAddQueue(_e: React.MouseEvent<HTMLLIElement, MouseEvent>) {
    // e.stopPropagation();
    service.addToQueue1(info);
  }

  function handleCutQueue(e: any) {
    e.stopPropagation();
    service.updateVideo1(info);
    // service.updateVideo(info.videoUrl);
  }

  return (
    <>
      <li
        className="search-item"
        onClick={(e) => {
          handleAddQueue(e);
          parentCallback(info);
        }}
      >
        <div className="item">
          <FontAwesomeIcon icon={faPlay} onClick={handleCutQueue} />
          <div className="description">
            <h6>{info.title}</h6>
            <p>{info.artist}</p>
          </div>
          <img src={info.thumbnail} alt="thumbnail" />
        </div>
      </li>
    </>
  );
}
