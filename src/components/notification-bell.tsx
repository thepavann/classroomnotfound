import { Bell, Megaphone, CalendarClock, DoorOpen, RefreshCw } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Notification {
  id: number;
  type: "announcement" | "event" | "room" | "timetable";
  title: string;
  time: string;
  read: boolean;
}

// Placeholder notifications — wire to Cloud later.
const notifications: Notification[] = [];

const iconFor = {
  announcement: Megaphone,
  event: CalendarClock,
  room: DoorOpen,
  timetable: RefreshCw,
};

export function NotificationBell() {
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          aria-label="Notifications"
          className="relative grid h-9 w-9 place-items-center rounded-full border border-border bg-card/60 text-muted-foreground transition-colors hover:text-foreground"
        >
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
              {unread}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 rounded-2xl p-0">
        <div className="border-b border-border px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          <p className="text-xs text-muted-foreground">Announcements · Events · Room & timetable changes</p>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="grid place-items-center gap-2 px-4 py-10 text-center">
              <Bell className="h-6 w-6 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">You're all caught up</p>
            </div>
          ) : (
            notifications.map((n) => {
              const Icon = iconFor[n.type];
              return (
                <div
                  key={n.id}
                  className={cn(
                    "flex items-start gap-3 px-4 py-3 transition-colors hover:bg-accent/50",
                    !n.read && "bg-primary/5",
                  )}
                >
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{n.title}</p>
                    <p className="text-xs text-muted-foreground">{n.time}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
