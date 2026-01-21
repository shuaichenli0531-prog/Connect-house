export async function GET() {
  return Response.json({
    DATABASE_URL_exists: !!process.env.DATABASE_URL,
    DATABASE_URL_prefix: process.env.DATABASE_URL?.substring(0, 30) || 'NOT SET',
    DIRECT_URL_exists: !!process.env.DIRECT_URL,
    ADMIN_SECRET_exists: !!process.env.ADMIN_SECRET,
    NODE_ENV: process.env.NODE_ENV,
  });
}
