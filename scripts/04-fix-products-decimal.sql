-- Drop the existing products table to recreate with larger decimal precision
DROP TABLE IF EXISTS public.products CASCADE;

-- Create products table with larger decimal precision to handle prices up to 999,999,999.99
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  desart TEXT NOT NULL UNIQUE,
  familia TEXT NOT NULL,
  nsubf TEXT NOT NULL,
  pventa_1 DECIMAL(15, 2) NOT NULL DEFAULT 0,
  pventa_2 DECIMAL(15, 2) NOT NULL DEFAULT 0,
  pventa_3 DECIMAL(15, 2) NOT NULL DEFAULT 0,
  pventa_4 DECIMAL(15, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on desart for faster searches
CREATE INDEX idx_products_desart ON public.products(desart);

-- Create index on familia for filtering
CREATE INDEX idx_products_familia ON public.products(familia);

-- Enable RLS (Row Level Security)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to products
CREATE POLICY "Allow public read access" ON public.products
  FOR SELECT USING (true);

-- Policy: Allow public insert (for adding products)
CREATE POLICY "Allow public insert" ON public.products
  FOR INSERT WITH CHECK (true);

-- Policy: Allow public update
CREATE POLICY "Allow public update" ON public.products
  FOR UPDATE USING (true);

-- Policy: Allow public delete
CREATE POLICY "Allow public delete" ON public.products
  FOR DELETE USING (true);
