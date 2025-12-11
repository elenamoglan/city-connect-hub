-- Add foreign key relationship from issue_reports.user_id to profiles.id
ALTER TABLE public.issue_reports
ADD CONSTRAINT issue_reports_user_id_profiles_fk
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;