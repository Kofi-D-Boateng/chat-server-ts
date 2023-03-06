import { randomBytes } from "crypto";
import "jest";
import { Worker } from "worker_threads";
import { Message } from "../types/Message";

describe("Message Processing Suite", () => {
  let worker: Worker;
  beforeAll(() => {
    worker = new Worker("../workerThreadScripts/processMessage.ts");
  });
  afterAll(() => worker.terminate());
  test("process Message file performs functionality", () => {
    const message: Message = {
      id: randomBytes(10).toString("base64"),
      sender: "John Doe",
      text: "Damn Steve! What the hell happened to this shit?",
      createdAt: new Date().getMilliseconds(),
    };
    worker.on("message", (data) => console.log(data));
    worker.postMessage(message);
  });
});
