import { Mutex } from "async-mutex";

type Knowledge = {
  index: string[];
  version: string;
  files: string[];
};

let cache: Promise<Knowledge> | undefined;
const getKnowledgeMutex = new Mutex();

setInterval(
  () => {
    cache = undefined;
  },
  // Cache knowledge for up to 1 hour.
  60 * 60e3,
);

export function getKnowledgeFiles(docsUrl: string): Promise<Knowledge> {
  if (cache) return cache;

  return getKnowledgeMutex.runExclusive(async (): Promise<Knowledge> => {
    const index: string[] = await fetch(`${docsUrl}/knowledge/index.json`).then(
      (res) => res.json(),
    );

    const files = await Promise.all(
      index.map((file) => fetch(`${docsUrl}${file}`).then((res) => res.text())),
    );

    const knowledge: Knowledge = {
      index,
      version: "",
      files,
    };
    cache = Promise.resolve(knowledge);
    return knowledge;
  });
}
