-- Create products table for Alfonsa Distribuidora
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  desart TEXT NOT NULL UNIQUE,
  familia TEXT NOT NULL,
  nsubf TEXT NOT NULL,
  pventa_1 DECIMAL(10, 2) NOT NULL DEFAULT 0,
  pventa_2 DECIMAL(10, 2) NOT NULL DEFAULT 0,
  pventa_3 DECIMAL(10, 2) NOT NULL DEFAULT 0,
  pventa_4 DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on desart for faster searches
CREATE INDEX IF NOT EXISTS idx_products_desart ON products(desart);

-- Create index on familia for filtering
CREATE INDEX IF NOT EXISTS idx_products_familia ON products(familia);

-- Enable RLS (Row Level Security)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to products
CREATE POLICY "Allow public read access to products" ON products
  FOR SELECT USING (true);

-- Create budgets table to save user budgets
CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  user_email TEXT,
  items JSONB NOT NULL,
  total DECIMAL(12, 2) NOT NULL,
  price_list INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_email for filtering budgets by user
CREATE INDEX IF NOT EXISTS idx_budgets_user_email ON budgets(user_email);

-- Enable RLS on budgets
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- Policy: Allow users to read their own budgets
CREATE POLICY "Allow users to read own budgets" ON budgets
  FOR SELECT USING (user_email = current_user_email() OR user_email IS NULL);

-- Policy: Allow users to insert their own budgets
CREATE POLICY "Allow users to insert own budgets" ON budgets
  FOR INSERT WITH CHECK (user_email = current_user_email() OR user_email IS NULL);

-- Policy: Allow users to update their own budgets
CREATE POLICY "Allow users to update own budgets" ON budgets
  FOR UPDATE USING (user_email = current_user_email()) WITH CHECK (user_email = current_user_email());

-- Policy: Allow users to delete their own budgets
CREATE POLICY "Allow users to delete own budgets" ON budgets
  FOR DELETE USING (user_email = current_user_email());
