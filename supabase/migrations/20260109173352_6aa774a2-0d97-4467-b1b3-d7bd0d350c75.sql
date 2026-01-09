-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  issue_id UUID REFERENCES public.issue_reports(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view their own notifications"
ON public.notifications
FOR SELECT
USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications"
ON public.notifications
FOR UPDATE
USING (auth.uid() = user_id);

-- System can insert notifications (via triggers)
CREATE POLICY "System can insert notifications"
ON public.notifications
FOR INSERT
WITH CHECK (true);

-- Function to notify user when issue status changes
CREATE OR REPLACE FUNCTION public.notify_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.notifications (user_id, issue_id, message, type)
    VALUES (
      NEW.user_id,
      NEW.id,
      'Your issue "' || NEW.title || '" status changed to ' || NEW.status,
      'status_change'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for status changes
CREATE TRIGGER on_issue_status_change
AFTER UPDATE ON public.issue_reports
FOR EACH ROW
EXECUTE FUNCTION public.notify_status_change();

-- Function to notify admins when new issue is created
CREATE OR REPLACE FUNCTION public.notify_admin_new_issue()
RETURNS TRIGGER AS $$
DECLARE
  admin_id UUID;
BEGIN
  FOR admin_id IN 
    SELECT user_id FROM public.user_roles WHERE role = 'ADMIN'
  LOOP
    INSERT INTO public.notifications (user_id, issue_id, message, type)
    VALUES (
      admin_id,
      NEW.id,
      'New issue reported: "' || NEW.title || '"',
      'new_issue'
    );
  END LOOP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for new issues
CREATE TRIGGER on_new_issue_created
AFTER INSERT ON public.issue_reports
FOR EACH ROW
EXECUTE FUNCTION public.notify_admin_new_issue();