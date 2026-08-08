import { redirect } from "next/navigation";

// Every create/update/delete action redirects back to its list page on
// success. Appending the confirmation message as a query param lets
// SavedToastWatcher (mounted once in the admin layout) show a toast after
// the redirect completes, without every action needing its own client-side
// success-handling code.
export function redirectWithSaved(path: string, message: string): never {
  redirect(`${path}?saved=${encodeURIComponent(message)}`);
}
