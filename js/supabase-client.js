/* ============================================================
   Creates ONE shared Supabase client for any page that needs it.
   Requires the SDK script tag to load first:
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>

   Uses the PUBLISHABLE key only — this is meant to be public and
   is safe to ship in browser code. It can only do what the Row
   Level Security policies on the database allow (see the SQL we
   ran when setting up the products/orders/order_items tables).
   The SEPARATE secret key is never used here and must never be
   added to this file.
   ============================================================ */
window.sb = supabase.createClient(
  'https://vehbygtyzufoyqkujqzy.supabase.co',
  'sb_publishable_JSLrL-HB6UpgMdBh0Zf74g_Ej5hZe7v'
);
