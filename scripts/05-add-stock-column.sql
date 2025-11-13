-- Add stock column to products table
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0;

-- Create index on stock for faster filtering
CREATE INDEX IF NOT EXISTS idx_products_stock ON public.products(stock);
