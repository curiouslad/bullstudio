import { FlowProducer } from "bullmq";

const flow = new FlowProducer({
  connection: { host: "localhost", port: 6378 },
});
await flow.add({
  name: "root-job",
  queueName: "printQueue",
  children: [
    { name: "child-1", queueName: "printQueue", data: { hello: "world" } },
    { name: "child-2", queueName: "printQueue", data: { hello: 2 } },
  ],
});
