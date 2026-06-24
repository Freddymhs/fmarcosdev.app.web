import * as Sentry from "@sentry/react";

// En Vite las variables públicas llevan prefijo VITE_ y se definen en Vercel
// (producción) o .env.local (dev). Sin DSN, Sentry queda desactivado.
const sentryDsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;

if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    environment: import.meta.env.MODE,
  });
}
