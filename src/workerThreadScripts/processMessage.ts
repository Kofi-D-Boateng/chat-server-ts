import { parentPort } from "worker_threads";
import { Message } from "../types/Message";

const jar: Set<string> = SwearJar.getJar();

parentPort?.on("message", (m: Message) => {
  console.log(m);
  const messageArray: Array<string> = new Array();
  m.text.split(" ").forEach((word: string) => {
    console.log(word);
    if (jar.has(word)) {
      const wordSwapArr: Array<string> = new Array();
      for (let i = word.length; i > 0; i--) wordSwapArr.push("*");
      messageArray.push(wordSwapArr.join(""));
    } else {
      messageArray.push(word);
    }
  });
  parentPort?.postMessage(messageArray.join(" "));
});
