// Temporary pre-launch QA aid — remove this component and its usage once
// real accounts exist and test credentials are no longer needed. Rotate
// the admin password again once this is removed, since committing it here
// puts it in the (public) repo's git history permanently.
export function TestCredentialsNotice() {
  return (
    <div className="mt-8 rounded-xl border border-dashed border-brand/40 bg-brand-soft/40 p-4 text-xs leading-6 text-foreground/80" dir="ltr">
      <p className="font-semibold text-brand">Test logins (temporary — remove before public launch)</p>
      <p className="mt-1">
        Customer: <span className="font-mono">customer@rosevarzan.com</span> / <span className="font-mono">TestUser1234</span>
      </p>
      <p className="mt-1">
        Admin: <span className="font-mono">admin@rosevarzan.com</span> / <span className="font-mono">ksJ6RsUvs9DnNk5aC4LE32ec</span>
      </p>
    </div>
  );
}
