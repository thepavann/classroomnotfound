import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Building2, BadgeCheck, ArrowRight } from "lucide-react";
import { facultyData, type Faculty } from "@/data/faculty";
import { PageShell } from "@/components/page-shell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { fadeUp } from "@/components/motion";

export const Route = createFileRoute("/faculty")({
  head: () => ({
    meta: [
      { title: "Faculty — AIML-B Hub" },
      { name: "description", content: "Meet the AIML-B faculty. View subjects, departments and contact details." },
      { property: "og:title", content: "Faculty — AIML-B Hub" },
      { property: "og:description", content: "Meet the AIML-B faculty. View subjects, departments and contact details." },
    ],
  }),
  component: FacultyPage,
});

function initials(name: string) {
  return name
    .replace(/^(Mr|Mrs|Ms|Dr)\.?\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

function FacultyPage() {
  const [selected, setSelected] = useState<Faculty | null>(null);
  const hasData = facultyData.length > 0;

  return (
    <PageShell
      eyebrow="AIML-B"
      title="Faculty"
      description="Your subject faculty for this semester."
    >
      {!hasData ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-44 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {facultyData.map((f) => (
            <motion.div
              key={f.id}
              variants={fadeUp}
              className="hover-lift flex flex-col rounded-2xl border border-border bg-card p-5 soft-shadow"
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={f.photo} alt={f.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {initials(f.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h3 className="truncate font-semibold">{f.name}</h3>
                  <p className="truncate text-sm text-muted-foreground">{f.designation}</p>
                </div>
              </div>
              <p className="mt-4 line-clamp-2 text-sm font-medium">{f.subject}</p>
              <p className="mt-1 text-sm text-muted-foreground">{f.department} Department</p>
              <Button
                variant="ghost"
                className="mt-4 justify-between rounded-xl text-primary hover:text-primary"
                onClick={() => setSelected(f)}
              >
                View details <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      )}

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>Faculty profile</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col items-center text-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={selected.photo} alt={selected.name} />
                  <AvatarFallback className="bg-primary/10 text-2xl font-semibold text-primary">
                    {initials(selected.name)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="mt-4 text-xl font-bold">{selected.name}</h2>
                <p className="text-sm text-muted-foreground">{selected.designation}</p>
                <p className="mt-1 text-sm font-medium text-primary">{selected.subject}</p>
              </div>

              <div className="mt-8 space-y-3">
                <DetailRow icon={Building2} label="Department" value={selected.department} />
                <DetailRow icon={BadgeCheck} label="Designation" value={selected.designation} />
                {selected.room && <DetailRow icon={MapPin} label="Room" value={selected.room} />}
                {selected.phone && <DetailRow icon={Phone} label="Phone" value={selected.phone} />}
                {selected.email && <DetailRow icon={Mail} label="Email" value={selected.email} />}
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3">
                {selected.phone && (
                  <Button asChild className="rounded-xl">
                    <a href={`tel:${selected.phone}`}>
                      <Phone className="h-4 w-4" /> Call
                    </a>
                  </Button>
                )}
                {selected.email && (
                  <Button asChild variant="outline" className="rounded-xl">
                    <a href={`mailto:${selected.email}`}>
                      <Mail className="h-4 w-4" /> Email
                    </a>
                  </Button>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </PageShell>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
