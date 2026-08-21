Sample certificate PDF files for local testing.

This folder is intentionally kept lightweight and is meant to be replaced with real Supabase Storage objects later.

Recommended future structure:
- Store each certificate as a PDF file in a Supabase Storage bucket.
- Save the direct public URL or signed URL in the certificate metadata record.
- Example table fields:
  - participant_name
  - program
  - certificate_number
  - date_issued
  - date_completed
  - certificate_type
  - institution
  - status
  - pdf_url

For now, these sample PDFs can be swapped out with generated certificate PDFs that match your branding.
