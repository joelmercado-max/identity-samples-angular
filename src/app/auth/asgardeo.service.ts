import { Injectable } from "@angular/core";
import { AsgardeoSPAClient, AuthSPAClientConfig } from "@asgardeo/auth-spa";
import { ASGARDEO_CONFIG } from "./asgardeo.config";

@Injectable({ providedIn: "root" })
export class AsgardeoService {
  private client!: AsgardeoSPAClient;
  private readyPromise: Promise<void>;

  constructor() {
    this.client = AsgardeoSPAClient.getInstance()!;
    this.readyPromise = this.client.initialize(ASGARDEO_CONFIG as AuthSPAClientConfig).then(() => {});
  }

  /** Wait for client initialization */
  async ready(): Promise<void> {
    return this.readyPromise;
  }

  /** Check authentication state */
  async isAuthenticated(): Promise<boolean> {
    await this.ready();
    return (await this.client.isAuthenticated()) ?? false;
  }

  /** Get access token if authenticated */
  async getAccessToken(): Promise<string | null> {
    await this.ready();
    if (!(await this.client.isAuthenticated())) return null;
    return this.client.getAccessToken();
  }

  /** Get basic user info (ID token claims + userinfo) */
  async getBasicUserInfo(): Promise<any> {
    await this.ready();
    return this.client.getBasicUserInfo();
  }

  /** Get ID token if authenticated */
  async getIDToken(): Promise<string | null> {
    await this.ready();
    if (!(await this.client.isAuthenticated())) return null;
    const idToken = this.client.getIDToken();
    return typeof idToken === "string" ? idToken : null;
  }

  /** Detect whether current URL is a callback from Asgardeo */
  isOnCallbackURL(): boolean {
    try {
      if (typeof window === "undefined") return false;
      const qs = window.location.search || "";
      return /[?&](code|session_state)=/.test(qs);
    } catch {
      return false;
    }
  }

  async signIn(): Promise<void> {
    await this.ready();
    try {
      await this.client.signIn();
    } catch (e) {
      console.error("[Asgardeo] signIn failed:", e);
      throw e as Error;
    }
  }


  /** Handle redirect callback if present */
  async handleCallbackIfPresent(): Promise<void> {
    await this.ready();
    if (this.isOnCallbackURL()) {
      await this.client.signIn({ callOnlyOnRedirect: true });
    }
  }

  /** Trigger sign-out */
  async signOut(): Promise<void> {
    await this.ready();
    this.client.signOut();
  }

  /** Register event listeners */
  on(event: "sign-in" | "sign-out" | "token-refresh" | string, cb: (data?: any) => void): void {
    (this.client as any).on(event, cb);
  }
}

