import { Button } from "@/components/primitives/Button";

export function Gestures() {
  return (
    <div className="w-full flex items-center justify-between max-w-sm mx-auto">
      <article className="scale-150 flex-1 flex flex-col justify-center items-center gap-4">
        <Button className=" px-4 rounded-full bg-blue-500 text-white active:scale-[0.96] duration-150 ease-in-out transition-all hover:bg-blue-600">
          Click me
        </Button>
      </article>
    </div>
  );
}
