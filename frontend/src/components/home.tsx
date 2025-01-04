import Open from "./open";

export default function Home() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-y-16">
      <h1 className="text-2xl font-semibold">pure.</h1>
      <Open />
    </div>
  );
}
