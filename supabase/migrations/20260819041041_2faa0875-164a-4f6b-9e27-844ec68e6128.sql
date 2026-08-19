CREATE TABLE public.cgpa_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  name TEXT NOT NULL CHECK (char_length(trim(name)) BETWEEN 2 AND 40),
  semester TEXT NOT NULL DEFAULT '1-2',
  sgpa NUMERIC(4,2) NOT NULL CHECK (sgpa >= 0 AND sgpa <= 10),
  credits INTEGER NOT NULL CHECK (credits >= 0 AND credits <= 200),
  grade_points NUMERIC(8,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.cgpa_results TO anon;
GRANT SELECT, INSERT, DELETE ON public.cgpa_results TO authenticated;
GRANT ALL ON public.cgpa_results TO service_role;

ALTER TABLE public.cgpa_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leaderboard is public" ON public.cgpa_results
  FOR SELECT USING (true);

CREATE POLICY "Anyone can post a result" ON public.cgpa_results
  FOR INSERT WITH CHECK (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY "Owners can delete their result" ON public.cgpa_results
  FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE INDEX cgpa_results_rank_idx ON public.cgpa_results (semester, sgpa DESC, created_at ASC);

CREATE TRIGGER update_cgpa_results_updated_at
  BEFORE UPDATE ON public.cgpa_results
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();