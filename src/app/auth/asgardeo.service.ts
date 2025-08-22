import { Injectable } from "@angular/core";
import { AsgardeoSPAClient } from "@asgardeo/auth-spa";
import { ASGARDEO_CONFIG } from "./asgardeo.config";

@Injectable({ providedIn: "root" })
export class AsgardeoService {
  private client = AsgardeoSPAClient.getInstance();
  private init = this.client?.initialize?.(ASGARDEO_CONFIG); // run once

  async isAuthenticated(): Promise<boolean> {
    await this.init;
    const result = await this.client?.isAuthenticated?.();
    return result === true;
  }

  async getAccessToken(): Promise<string | null> {
    await this.init;
    const isAuth = await this.client?.isAuthenticated?.();
    if (!isAuth) return null;
    return (await this.client?.getAccessToken?.()) ?? null;
  }

  async getBasicUserInfo(): Promise<any> {
    await this.init;
    return this.client?.getBasicUserInfo?.() ?? null;
  }

  async getIDToken(): Promise<string | null> {
    await this.init;
    const isAuth = await this.client?.isAuthenticated?.();
    if (!isAuth) return null;
    const idToken = await this.client?.getIDToken?.();
    return typeof idToken === "string" ? idToken : null;
  }

  ready(): Promise<void> {
    return Promise.resolve(this.init).then(() => {});
  }

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
    await this.init;
    if (!this.client?.signIn) {
      throw new Error("Asgardeo client is not initialized.");
    }
    await this.client.signIn();
  }

  async handleCallbackIfPresent(): Promise<void> {
    await this.init;
    if (!this.isOnCallbackURL()) {
      return;
    }
    if (!this.client?.signIn) {
      throw new Error("Asgardeo client is not initialized.");
    }
    await this.client.signIn({ callOnlyOnRedirect: true });
  }

  async signOut(): Promise<void> {
    await this.init;
    if (!this.client?.signOut) {
      throw new Error("Asgardeo client is not initialized.");
    }
    await this.client.signOut();
  }

  on(event: "sign-in" | "sign-out" | "token-refresh" | string, cb: (data?: any) => void): void {
    (this.client as any)?.on?.(event, cb);
  }
}