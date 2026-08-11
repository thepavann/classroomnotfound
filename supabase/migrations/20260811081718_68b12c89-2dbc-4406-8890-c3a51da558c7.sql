CREATE TABLE public.attendance_overall (
  user_id UUID NOT NULL PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  attended INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0,
  target NUMERIC NOT NULL DEFAULT 75,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.attendance_overall TO authenticated;
GRANT ALL ON public.attendance_overall TO service_role;
ALTER TABLE public.attendance_overall ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own attendance overall" ON public.attendance_overall FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.attendance_subjects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  attended INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0,
  target NUMERIC NOT NULL DEFAULT 75,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.attendance_subjects TO authenticated;
GRANT ALL ON public.attendance_subjects TO service_role;
ALTER TABLE public.attendance_subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own attendance subjects" ON public.attendance_subjects FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_attendance_overall_updated_at BEFORE UPDATE ON public.attendance_overall FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_attendance_subjects_updated_at BEFORE UPDATE ON public.attendance_subjects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();