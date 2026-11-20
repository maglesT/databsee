// D-82: the login a person's name gives (Sameer Kale -> sameer.kale). One rule for the server (a hire who already has
// that login is left out of the hire list) and the Add a person form (it suggests that login). No Node APIs.
export function loginFromName(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.+|\.+$/g, '');
}
