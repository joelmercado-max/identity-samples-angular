// src/app/auth/asgardeo.config.ts
import type { AuthSPAClientConfig } from "@asgardeo/auth-spa";

export const ASGARDEO_CONFIG: AuthSPAClientConfig = {
  clientID: "5Ui1B0K1RDtIW9Chcds3qg8esOoa",
  baseUrl: "https://api.asgardeo.io/t/bprocess",

  signInRedirectURL:  "http://localhost:4200/auth/callback",
  signOutRedirectURL: "http://localhost:4200/",
  scope: ["openid", "profile"],
  storage: "sessionStorage",
  enablePKCE: true
};