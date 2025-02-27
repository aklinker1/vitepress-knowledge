import { Converter } from "showdown";

const converter = new Converter();
export function mdToHtml(md: string): string {
  return converter.makeHtml(md);
}
