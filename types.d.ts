import type { Connection } from "mongoose";

declare global {
  var mongoose:
    | {
        conn: Connection | null;
        promise: Promise<Connection> | null;
      }
    | undefined;
}

export {};

// Ambient module declaration for packages without bundled type definitions.
// This silences "Cannot find module 'next-themes' or its corresponding type declarations." errors.
declare module "next-themes";
