import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { FirebaseService } from "../../utils/firebaseService";
import { off, onValue, ref } from "firebase/database";
import { db } from "../../utils/firebase";
import { useEffect, useState } from "react";
import { SearchResult } from "../../interfaces/searchResult";
import "./queue-item.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
export default function Queue() {
  const service = new FirebaseService();

  const [queue, setQueue] = useState<SearchResult[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);
  useEffect(() => {
    const queueRef = ref(db, "queue/queue1");
    const unsubscribe = onValue(queueRef, (snapshot) => {
      const data = snapshot.val();
      const queueArray = Object.values(data) as SearchResult[];
      console.log(queueArray);
      console.log("SETTING QUEUE");
      setQueue(queueArray);
    });

    const unsubscribeQueueIndex = onValue(ref(db, "queueIndex"), (snapshot) => {
      const index = snapshot.val();
      setQueueIndex(index - 1);
      // console.log("QUEUE INDEX CHANGED");
      // console.log(index);
      // service.setQueueIndex1(index);
    });

    return () => {
      // Clean up the listener when the component unmounts
      off(queueRef, "value", unsubscribe);
      off(ref(db, "queueIndex"), "value", unsubscribeQueueIndex);
    };
  }, []); // Empty dependency array means this effect runs only once, like componentDidMount
  // @ts-ignore
  function onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = Array.from(queue);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    // console.log("DRAG DETECTED");
    // console.log(items);
    setQueue(items);
    service.updateQueue(items);
  }

  function handleQueueIndex(e: number) {
    service.setQueueIndex1(e + 1);
    // console.log("QUEUE INDEX SET", e + 1);
  }
  function deleteFromQueue(e: any, selectedIndex: number) {
    e.stopPropagation();
    const items = Array.from(queue);
    // items.splice(e, 1);
    items.splice(selectedIndex, 1);
    // service.setQueueIndex()
    // await service.getQueueIndex();
    // index will be one above selectedIndex
    service.getQueueIndex().then((index) => {
      console.log("INDEX", index);
      console.log("SELECTED INDEX", selectedIndex + 1);
      if (index === selectedIndex + 1) {
        console.log("haZ!");
        if (index - 1 != 0) {
          console.log("haz2!");
          service.setQueueIndex1(index - 1);
          service.updateQueue(items);
        }
        service.updateQueue(items);
      } else if (selectedIndex + 1 < index) {
        console.log("you!");
        service.setQueueIndex1(index - 1);
        service.updateQueue(items);
      } else {
        console.log("me!");
        service.setQueueIndex1(index);
        service.updateQueue(items);
        // service.setQueueIndex1(index);
      }
      // if (index === 0) index = 1;
      // service.setQueueIndex1(index);
      // setQueue(items);
      // service.updateQueue(items);
    });
  }

  return (
    <>
      <div className="main-queue">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef}>
                {queue &&
                  queue.map((item, index) => (
                    <Draggable
                      key={item.videoUrl}
                      draggableId={item.videoUrl}
                      index={index}
                    >
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => handleQueueIndex(index)}
                          className="search-result-items"
                          // style={{
                          //   backgroundColor: index === queueIndex ? "gray" : "",
                          // }}
                        >
                          <div
                            className="search-result-wrapper"
                            style={{
                              backgroundColor:
                                index === queueIndex ? "gray" : "",
                            }}
                          >
                            <div className="queue-item">
                              <div className="content">
                                <img
                                  src={item.thumbnail}
                                  alt="thumbnail"
                                  className="thumbnail"
                                />
                                <div className="info">
                                  <p className="title">{item.title}</p>
                                  <span>{item.artist}</span>
                                </div>
                              </div>
                              <div className="icons">
                                <FontAwesomeIcon
                                  onClick={(e) => deleteFromQueue(e, index)}
                                  icon={faTrash}
                                />
                              </div>
                            </div>
                          </div>
                        </li>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </>
  );
}
