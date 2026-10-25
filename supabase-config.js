/* ============================================================
   Elliana The Shop — Supabase cloud sync
   ------------------------------------------------------------
   This file turns the app from "per-browser localStorage" into
   "a few users sharing ONE synced dataset".

   SETUP (one time):
   1) Create a free project at https://supabase.com
   2) Project Settings → API → copy the two values below.
   3) SQL Editor → paste supabase-schema.sql → Run.
   See SUPABASE_SETUP.md for the full walkthrough.

   If you leave the placeholders unchanged, the app simply keeps
   working the old way (local to this browser) — nothing breaks.
   ============================================================ */

/* ---- PASTE YOUR PROJECT VALUES HERE ---- */
const SUPABASE_URL      = 'https://YOUR-PROJECT-ref.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR-PUBLIC-ANON-KEY';
/* ---------------------------------------- */

/* The anon key is a PUBLIC key — safe to ship in the browser.
   Never paste the service_role key here. */

window.Cloud = (function () {
  const configured =
    SUPABASE_URL && SUPABASE_ANON_KEY &&
    !SUPABASE_URL.includes('YOUR-PROJECT') &&
    !SUPABASE_ANON_KEY.includes('YOUR-PUBLIC');

  let sb = null;
  if (configured && window.supabase) {
    sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false }
    });
  }

  let saveTimer = null;

  return {
    ready: !!sb,
    client: sb,

    /* Load the single shared dataset. Returns the stored object,
       or null when the row has no data yet. */
    async loadState() {
      const { data, error } = await sb
        .from('app_state').select('data').eq('id', 1).single();
      if (error) throw error;
      return data && data.data && Object.keys(data.data).length ? data.data : null;
    },

    /* Debounced write so rapid edits coalesce into one request. */
    saveState(dataObj) {
      if (!sb) return;
      clearTimeout(saveTimer);
      saveTimer = setTimeout(async () => {
        try {
          await sb.from('app_state').upsert({
            id: 1, data: dataObj, updated_at: new Date().toISOString()
          });
        } catch (e) { console.warn('Cloud saveState failed', e); }
      }, 500);
    },

    /* Live updates: cb(newData) fires whenever ANOTHER device saves. */
    subscribe(cb) {
      if (!sb) return;
      sb.channel('app_state_sync')
        .on('postgres_changes',
            { event: '*', schema: 'public', table: 'app_state', filter: 'id=eq.1' },
            payload => { if (payload.new && payload.new.data) cb(payload.new.data); })
        .subscribe();
    }
  };
})();
