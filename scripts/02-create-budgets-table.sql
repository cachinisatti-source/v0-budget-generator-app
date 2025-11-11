-- Create budgets table to save user budgets
CREATE TABLE IF NOT EXISTS public.budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  items JSONB NOT NULL,
  total DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for budget searches
CREATE INDEX IF NOT EXISTS budgets_created_at_idx ON public.budgets(created_at DESC);

-- Allow public read/write for now (client-side app)
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.budgets FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.budgets FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.budgets FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.budgets FOR DELETE USING (true);
