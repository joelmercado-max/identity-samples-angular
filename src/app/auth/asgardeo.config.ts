// src/app/auth/asgardeo.config.ts
export const ASGARDEO_CONFIG = {
  // TODO: paste your SPA client id from Asgardeo Console
  clientID: "PASTE_YOUR_CLIENT_ID_HERE",

  // Your tenant base
  baseUrl: "https://api.asgardeo.io/t/bprocess",

  // These must match the app’s allowed URLs in Asgardeo
  signInRedirectURL:  "http://localhost:4200/auth/callback",
  signOutRedirectURL: "http://localhost:4200/",

  scope: ["openid", "profile"],
  enablePKCE: true
};