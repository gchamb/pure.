import { useEffect } from "react";
import Open from "./open";
import { useAtom } from "jotai";
import { envAtom } from "@/hooks/environment";
import { Environment } from "../../wailsjs/runtime/runtime";
export default function Home() {
  const [env, setEnv] = useAtom(envAtom);
  useEffect(() => {
    // get info on init that won't change
    const getInfo = async () => {
      if (env === null) {
        console.log("env isn't here.");
        const envInfo = await Environment();
        setEnv(envInfo);
      }
    };
    getInfo();
  }, []);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-y-16">
      <h1 className="text-2xl font-semibold">pure.</h1>
      <Open />
    </div>
  );
}
