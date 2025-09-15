import {
  Database,
  // child,
  get,
  // limitToFirst,
  push,
  query,
  ref,
  runTransaction,
  // remove,
  set,
} from "firebase/database";
import { db } from "./firebase";
import { SearchResult } from "../interfaces/searchResult";
export class FirebaseService {
  private db: Database;
  private queueRef = ref(db, "queue/queue1");
  private connectionsRef = ref(db, "connections");
  private queueIndexRef = ref(db, "queueIndex");
  private queueIndexUpdatedRef = ref(db, "queueIndexUpdate");

  constructor() {
    this.db = db;
  }

  // connections/disconnections
  public async userConnected() {
    get(query(this.connectionsRef)).then((res) => {
      if (res.exists()) {
        const users = res.val();
        set(this.connectionsRef, users + 1);
      }
    });
  }
  public async userDisconnected() {
    get(query(this.connectionsRef)).then((res) => {
      if (res.exists()) {
        const users = res.val();
        set(this.connectionsRef, users - 1);
      }
    });
  }

  public async updateVideo(url: string) {
    set(ref(this.db, "url"), url);
  }
  public async updateVideo1(info: SearchResult) {
    set(ref(this.db, "url"), info);
  }
  public async getQueueIndex() {
    // return get(query(this.queueIndexRef)).val();
    const index = (await get(query(this.queueIndexRef))).val();
    return index;
  }

  public async addToQueue(url: string) {
    // Add a URL to the queue
    push(this.queueRef, url);
  }
  public async addToQueue1(info: SearchResult) {
    // const queueRef = ref(this.db, "queue/queue1");
    // Add a URL to the queue
    push(this.queueRef, info);
  }

  public async addDubbyToQueue() {
    const info = {
      artist: "ツユ",
      description:
        "ツユ3rdアルバム☔ 『アンダーメンタリティ』 2023年6月21日(水)発売 配信：https://tuyu.lnk.to/undermentality ...",
      thumbnail: "https://i.ytimg.com/vi/TBoBfT-_sfM/default.jpg",
      title: "ツユ - アンダーキッズ MV",
      videoUrl: "https://www.youtube.com/watch?v=TBoBfT-_sfM",
    };
    // @ts-ignore
    const info2 = {
      artist: "Evan Call - Topic",
      description:
        "ツユ3rdアルバム☔ 『アンダーメンタリティ』 2023年6月21日(水)発売 配信：https://tuyu.lnk.to/undermentality ...",
      thumbnail: "https://i.ytimg.com/vi/TBoBfT-_sfM/default.jpg",
      title: "Zoltraak",
      videoUrl: "https://youtu.be/M7gm_r8hXoU",
    };

    push(this.queueRef, info);
  }

  /**
   * Replaces the queue in the database, called when people modify queue when dragging around.
   * @param queue update queue
   */
  public async updateQueue(queue: SearchResult[]) {
    set(this.queueRef, queue);
  }

  public async testFunc() {
    const currentTime = (await get(query(this.queueIndexUpdatedRef))).val();
    // change currentTime to a date object
    console.log(currentTime);
    const d = new Date();
    set(this.queueIndexUpdatedRef, d.toISOString())
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  public async setQueueIndex1(index: number) {
    set(this.queueIndexRef, index);
  }
  // @ts-ignore
  public async setQueueIndex(index: number) {
    // set(this.queueIndexRef, index);
    // const currentTime = (await get(query(this.queueIndexUpdatedRef))).val;
    const currentTime = (await get(query(this.queueIndexUpdatedRef))).val();
    const now = new Date(currentTime);
    const now2 = new Date();
    // check if current time is lesser than 3 seconds
    if (now.getTime() + 3000 < now2.getTime()) {
      await runTransaction(this.queueIndexRef, (currentData) => {
        const newValue = (currentData || 0) + 1; // Handle initial value as 0
        const d = new Date();
        set(this.queueIndexUpdatedRef, d.toISOString());
        return newValue;
      });
    }
  }

  // public async nextQueued() {
  //   // const nextUrl = await get(this.queueRef);
  //   const q = query(this.queueRef, limitToFirst(1));
  //   get(q).then((res) => {
  //     if (res.exists()) {
  //       const data = res.val();
  //       const key = Object.keys(data)[0]; // Get the first key of the object
  //       const url = data[key].videoUrl; // Get the value of the first key
  //       console.log(url);
  //       set(ref(this.db, "url"), url);

  //       // const urlRef = child(this.queueRef, key);
  //       // // @ts-ignore
  //       // remove(urlRef).then((res) => {
  //       //   console.log("remove success");
  //       // });
  //     }
  //   });
  // }
}
