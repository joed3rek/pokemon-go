/**
 * Deployment settings, read from EXPO_PUBLIC_* env vars (see .env.example).
 * Everything works offline without them — records just stay on the phone.
 */
export const config = {
  siteId: process.env.EXPO_PUBLIC_SITE_ID ?? 'nallurhalli',
  /** Base URL of the backend that receives observations and reports. */
  apiUrl: (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/$/, ''),
  /** WhatsApp number in international format without "+", e.g. 9198XXXXXXXX. */
  whatsappNumber: process.env.EXPO_PUBLIC_WHATSAPP_NUMBER ?? '',
};
