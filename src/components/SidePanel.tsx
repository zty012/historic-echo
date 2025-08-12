import { Calendar, ChevronRight, MapPin, X } from "lucide-react";
import type { Poem } from "../types";
import { cn } from "../utils";

type SidePanelProps = {
  open: boolean;
  poem: Poem | null;
  onClose: () => void;
};

export default function SidePanel({ open, poem, onClose }: SidePanelProps) {
  return (
    <div
      className={cn(
        "absolute left-8 bottom-8 w-96 rounded-2xl top-8 transition z-20 backdrop-blur-3xl bg-black/35 border-2 border-black/20 p-8 gap-3 flex flex-col",
        !open && "scale-50 opacity-0",
      )}
      aria-hidden={!open}
    >
      <X className="absolute top-2 right-2" onClick={onClose} />
      <h1 className="text-4xl">{poem?.title}</h1>
      <div className="flex gap-1">
        <MapPin />
        <span>{poem?.place}</span>
      </div>
      <div className="flex gap-1">
        <Calendar />
        <span>{poem?.year}</span>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        {poem?.excerpt.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
      <div className="flex-1" />
      <div className="bg-black/70 rounded-full flex items-center justify-center gap-2 text-lg py-3 active:scale-90 transition cursor-pointer">
        <span>前往探索</span>
        <ChevronRight />
      </div>
    </div>
  );
}
