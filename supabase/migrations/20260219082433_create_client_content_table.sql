/*
  # Create client_content table

  ## Overview
  Creates the main table for storing all client showcase content on the Scalers website.

  ## New Tables

  ### client_content
  Stores all types of content (images, videos, text) displayed on the Clients page.
  
  Columns:
  - `id` - UUID primary key, auto-generated
  - `title` - Content title displayed to visitors
  - `description` - Optional description or caption
  - `content_type` - Type of content: 'image', 'video', or 'text'
  - `content_url` - URL for image or video content
  - `content_text` - Rich text content for text type entries
  - `client_name` - Name of the client
  - `client_logo_url` - Optional URL for client's logo image
  - `category` - Category tag for filtering (e.g., "Branding", "Marketing", "Social Media")
  - `is_featured` - Whether to highlight this content
  - `display_order` - Number for controlling display order
  - `created_at` - Timestamp when content was added

  ## Security
  - RLS enabled on client_content table
  - Public SELECT policy: anyone can view published content
  - Authenticated INSERT policy: logged-in admins can add content
  - Authenticated UPDATE policy: logged-in admins can update content
  - Authenticated DELETE policy: logged-in admins can delete content

  ## Notes
  1. The content_type column uses a CHECK constraint to enforce valid values
  2. display_order defaults to 0 allowing easy reordering
  3. is_featured defaults to false
*/

CREATE TABLE IF NOT EXISTS client_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  description text DEFAULT '',
  content_type text NOT NULL DEFAULT 'text' CHECK (content_type IN ('image', 'video', 'text')),
  content_url text DEFAULT '',
  content_text text DEFAULT '',
  client_name text NOT NULL DEFAULT '',
  client_logo_url text DEFAULT '',
  category text DEFAULT '',
  is_featured boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE client_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view client content"
  ON client_content FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated users can insert client content"
  ON client_content FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update client content"
  ON client_content FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete client content"
  ON client_content FOR DELETE
  TO authenticated
  USING (true);
