export function getAdminAuthError(request) {
  const secret = request.headers.get("x-admin-secret");
  const expectedSecret = process.env.ADMIN_SECRET;

  if (!expectedSecret) {
    return "ADMIN_SECRET is not configured on the server.";
  }

  if (!secret) {
    return "Missing admin secret.";
  }

  if (secret !== expectedSecret) {
    return "Unauthorized. Check your admin secret.";
  }

  return null;
}

export function checkAdminAuth(request) {
  return getAdminAuthError(request) === null;
}
