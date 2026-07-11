import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Users,
  Megaphone,
  CalendarClock,
  UserCog,
  Plus,
  Lock,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { fadeUp } from "@/components/motion";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — AIML-B Hub" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const notify = () => toast("Connect Lovable Cloud to save changes.");

  return (
    <PageShell
      eyebrow="Internal"
      title="Admin panel"
      description="Manage class data. UI preview — backend not connected yet."
      action={
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
          <Lock className="h-3.5 w-3.5" /> Auth not enabled
        </span>
      }
    >
      <motion.div variants={fadeUp}>
        <Tabs defaultValue="timetable">
          <TabsList className="mb-6 flex h-auto w-full flex-wrap justify-start gap-1 rounded-2xl bg-muted p-1.5">
            <TabsTrigger value="timetable" className="rounded-xl">
              <CalendarDays className="h-4 w-4" /> Timetable
            </TabsTrigger>
            <TabsTrigger value="faculty" className="rounded-xl">
              <Users className="h-4 w-4" /> Faculty
            </TabsTrigger>
            <TabsTrigger value="announcements" className="rounded-xl">
              <Megaphone className="h-4 w-4" /> Announcements
            </TabsTrigger>
            <TabsTrigger value="events" className="rounded-xl">
              <CalendarClock className="h-4 w-4" /> Events
            </TabsTrigger>
            <TabsTrigger value="crs" className="rounded-xl">
              <UserCog className="h-4 w-4" /> CRs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timetable">
            <AdminForm title="Add / update class" onSave={notify}>
              <Field label="Subject" placeholder="Database Management Systems" />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Start time" placeholder="13:10" />
                <Field label="End time" placeholder="13:55" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Day" placeholder="Monday" />
                <Field label="Room" placeholder="2212" />
              </div>
              <Field label="Faculty" placeholder="Mr. P. Sravan Kumar" />
              <Field label="Type" placeholder="Theory / Lab / Online / Activity" />
            </AdminForm>
          </TabsContent>

          <TabsContent value="faculty">
            <AdminForm title="Add / update faculty" onSave={notify}>
              <Field label="Name" placeholder="Mrs. K. Beena" />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Department" placeholder="AI&ML" />
                <Field label="Designation" placeholder="Assistant Professor" />
              </div>
              <Field label="Subject" placeholder="Software Engineering" />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Phone" placeholder="98499 64204" />
                <Field label="Room" placeholder="2212" />
              </div>
              <Field label="Email" placeholder="beena.k@sreenidhi.edu.in" />
            </AdminForm>
          </TabsContent>

          <TabsContent value="announcements">
            <AdminForm title="Post announcement" onSave={notify}>
              <Field label="Title" placeholder="Lab exam rescheduled" />
              <AreaField label="Description" placeholder="Details of the announcement…" />
              <Field label="Posted by" placeholder="CR — John Doe" />
            </AdminForm>
          </TabsContent>

          <TabsContent value="events">
            <AdminForm title="Create event" onSave={notify}>
              <Field label="Title" placeholder="Hackathon 2026" />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Date & time" placeholder="2026-08-12 10:00" />
                <Field label="Venue" placeholder="Auditorium" />
              </div>
              <Field label="Register URL" placeholder="https://…" />
              <Field label="Poster URL" placeholder="https://…" />
            </AdminForm>
          </TabsContent>

          <TabsContent value="crs">
            <AdminForm title="Add / update CR" onSave={notify}>
              <Field label="Name" placeholder="Jane Doe" />
              <Field label="Role" placeholder="Class Representative" />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Phone" placeholder="98765 43210" />
                <Field label="WhatsApp" placeholder="98765 43210" />
              </div>
              <Field label="Email" placeholder="jane@sreenidhi.edu.in" />
              <AreaField label="Responsibilities" placeholder="One per line" />
            </AdminForm>
          </TabsContent>
        </Tabs>
      </motion.div>
    </PageShell>
  );
}

function AdminForm({
  title,
  children,
  onSave,
}: {
  title: string;
  children: React.ReactNode;
  onSave: () => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 soft-shadow">
      <h2 className="mb-5 text-lg font-semibold">{title}</h2>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSave();
        }}
      >
        {children}
        <Button type="submit" className="rounded-xl">
          <Plus className="h-4 w-4" /> Save
        </Button>
      </form>
    </div>
  );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input placeholder={placeholder} className="rounded-xl" />
    </div>
  );
}

function AreaField({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Textarea placeholder={placeholder} className="rounded-xl" rows={4} />
    </div>
  );
}
