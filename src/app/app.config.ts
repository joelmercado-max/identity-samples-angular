export const ASGARDEO_CONFIG = {
  clientID: "PASTE_YOUR_CLIENT_ID_HERE",
  baseUrl: "https://api.asgardeo.io/t/bprocess",
  signInRedirectURL:  "http://localhost:4200/auth/callback",
  signOutRedirectURL: "http://localhost:4200/",
  scope: ["openid", "profile"],
  storage: "sessionStorage",
  enablePKCE: true
};

export const appConfig = ASGARDEO_CONFIG;