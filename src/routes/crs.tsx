import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Phone, Mail, MessageCircle, Users, CheckCircle2 } from "lucide-react";
import { crData, type CR } from "@/data/crs";
import { PageShell } from "@/components/page-shell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/components/motion";

export const Route = createFileRoute("/crs")({
  head: () => ({
    meta: [
      { title: "Class Representatives — Classmate" },
      { name: "description", content: "Contact your AIML-B class representatives via WhatsApp, call or email." },
      { property: "og:title", content: "Class Representatives — Classmate" },
      { property: "og:description", content: "Contact your AIML-B class representatives." },
    ],
  }),
  component: CRPage,
});

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

function CRPage() {
  return (
    <PageShell
      eyebrow="AIML-B"
      title="Class Representatives"
      description="Reach out to your CRs for anything class related."
    >
      {crData.length === 0 ? (
        <motion.div
          variants={fadeUp}
          className="grid place-items-center gap-3 rounded-2xl border border-dashed border-border py-20 text-center"
        >
          <Users className="h-8 w-8 text-muted-foreground/50" />
          <p className="font-medium">CR details coming soon</p>
          <p className="text-sm text-muted-foreground">This section will be updated shortly.</p>
        </motion.div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {crData.map((cr) => (
            <CRCard key={cr.id} cr={cr} />
          ))}
        </div>
      )}
    </PageShell>
  );
}

function CRCard({ cr }: { cr: CR }) {
  const wa = cr.whatsapp ?? cr.phone;
  const primaryHref = wa
    ? `https://wa.me/${wa.replace(/\D/g, "")}`
    : cr.email
      ? `mailto:${cr.email}`
      : "#";

  return (
    <motion.div
      variants={fadeUp}
      className="hover-lift flex flex-col rounded-2xl border border-border bg-card p-6 soft-shadow"
    >
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={cr.photo} alt={cr.name} />
          <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
            {initials(cr.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold">{cr.name}</h3>
          <p className="text-sm font-medium text-primary">{cr.role}</p>
        </div>
      </div>

      {cr.responsibilities.length > 0 && (
        <ul className="mt-4 space-y-1.5">
          {cr.responsibilities.map((r) => (
            <li key={r} className="flex items-start gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {r}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto flex flex-col gap-2 pt-5">
        <Button asChild className="rounded-xl">
          <a href={primaryHref} target="_blank" rel="noreferrer">
            {wa ? <MessageCircle className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
            {wa ? "WhatsApp" : "Email"}
          </a>
        </Button>
        <div className="grid grid-cols-2 gap-2">
          {cr.phone && (
            <Button asChild variant="outline" className="rounded-xl">
              <a href={`tel:${cr.phone}`}>
                <Phone className="h-4 w-4" /> Call
              </a>
            </Button>
          )}
          {cr.email && (
            <Button asChild variant="outline" className="rounded-xl">
              <a href={`mailto:${cr.email}`}>
                <Mail className="h-4 w-4" /> Email
              </a>
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
