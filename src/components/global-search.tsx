import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { facultyData } from "@/data/faculty";
import { timetableData } from "@/data/timetable";
import { announcements } from "@/data/announcements";
import { events } from "@/data/events";

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const subjects = useMemo(() => {
    const map = new Map<string, string>();
    timetableData.forEach((c) => map.set(c.subject, c.room));
    return Array.from(map.entries());
  }, []);

  const rooms = useMemo(
    () => Array.from(new Set(timetableData.map((c) => c.room))),
    [],
  );

  const go = (to: string) => {
    setOpen(false);
    navigate({ to });
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground md:w-40 xl:w-56"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="hidden md:inline">Search…</span>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search faculty, subjects, rooms…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Faculty">
            {facultyData.map((f) => (
              <CommandItem key={`f-${f.id}`} value={`${f.name} ${f.subject}`} onSelect={() => go("/faculty")}>
                {f.name} · <span className="text-muted-foreground">{f.subject}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Subjects">
            {subjects.map(([subject, room]) => (
              <CommandItem key={`s-${subject}`} value={subject} onSelect={() => go("/timetable")}>
                {subject} · <span className="text-muted-foreground">{room}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Rooms">
            {rooms.map((room) => (
              <CommandItem key={`r-${room}`} value={`room ${room}`} onSelect={() => go("/timetable")}>
                Room {room}
              </CommandItem>
            ))}
          </CommandGroup>

          {announcements.length > 0 && (
            <CommandGroup heading="Announcements">
              {announcements.map((a) => (
                <CommandItem key={`a-${a.id}`} value={a.title} onSelect={() => go("/announcements")}>
                  {a.title}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {events.length > 0 && (
            <CommandGroup heading="Events">
              {events.map((e) => (
                <CommandItem key={`e-${e.id}`} value={e.title} onSelect={() => go("/events")}>
                  {e.title}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
