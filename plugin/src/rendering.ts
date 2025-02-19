import { join, relative, dirname } from "node:path";
import { relative as relativeNormalized } from "node:path/posix";
import { writeFile, mkdir } from "node:fs/promises";
import YAML from "yaml";
import type { KnowledgeContext } from "./types";
import pc from "picocolors";

export async function writeIndexJson(
  outDir: string,
  knowledgeDir: string,
  groups: Record<string, KnowledgeContext[]>,
) {
  const file = join(knowledgeDir, "index.json");
  await mkdir(dirname(file), { recursive: true });

  await writeFile(
    file,
    JSON.stringify(
      Object.keys(groups).map(
        (groupName) =>
          "/" +
          relativeNormalized(outDir, getGroupPath(knowledgeDir, groupName)),
      ),
    ),
  );
  printFileWriteSuccess(file);
}

export async function writeKnowledgeFile(
  knowledgeDir: string,
  groupName: string,
  files: KnowledgeContext[],
): Promise<void> {
  const file = getGroupPath(knowledgeDir, groupName);
  await mkdir(dirname(file), { recursive: true });

  await writeFile(file, files.map(renderKnowledgeContext).join("\n\n"));
  printFileWriteSuccess(file);
}

/** Convert the data we collected into a string for the knowledge file. */
function renderKnowledgeContext(ctx: KnowledgeContext): string {
  const frontmatter: Record<string, any> = {
    url: ctx.pathname,
  };
  if (ctx.pageTitle !== ctx.siteTitle && ctx.pageTitle) {
    frontmatter.title = ctx.pageTitle;
  }
  if (ctx.pageDescription !== ctx.siteDescription && ctx.pageDescription) {
    frontmatter.description = ctx.pageDescription;
  }

  return `---\n${YAML.stringify(frontmatter).trim()}\n---\n\n${ctx.md.trim()}`;
}

function printFileWriteSuccess(file: string) {
  console.log(
    `${pc.green("✓")} ${pc.dim("[knowledge]")} generated ${pc.cyan(relative(process.cwd(), file))}`,
  );
}

function getGroupPath(knowledgeDir: string, groupName: string): string {
  return join(knowledgeDir, `${groupName}.txt`);
}
