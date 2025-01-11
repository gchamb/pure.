import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function getDirectoryName(path: string | undefined, pathSeparator: "\\" | "/") {
  if (path === undefined) {
    return "";
  }
  const pathStack = path.split(pathSeparator);
  return pathStack[pathStack.length - 1];
}
