import { atomWithStorage, createJSONStorage } from "jotai/utils";
import { EnvironmentInfo } from "wailsjs/runtime/runtime";

const storage = createJSONStorage<EnvironmentInfo | null>(
  // getStringStorage
  () => localStorage // or sessionStorage, asyncStorage or alike
  // options (optional)
);

export const envAtom = atomWithStorage<EnvironmentInfo | null>(
  "env",
  null,
  storage,
  {
    getOnInit: true,
  }
);
