// Temporary pre-launch QA aid — remove this component and its usage once
// real accounts exist and test credentials are no longer needed.
//
// Deliberately does NOT show admin credentials here: this page is public
// and the repo is public, so an admin password baked into source would be
// permanently exposed in git history even after later removal. Admin login
// is shared out-of-band instead.
export function TestCredentialsNotice() {
  return (
    <div className="mt-8 rounded-xl border border-dashed border-brand/40 bg-brand-soft/40 p-4 text-xs leading-6 text-foreground/80" dir="ltr">
      <p className="font-semibold text-brand">Test customer login (temporary — remove before public launch)</p>
      <p className="mt-1">
        <span className="font-mono">customer@rosevarzan.com</span> / <span className="font-mono">TestUser1234</span>
      </p>
      <p className="mt-1 text-foreground/60">Admin login was shared separately — ask if you need it again.</p>
    </div>
  );
}
