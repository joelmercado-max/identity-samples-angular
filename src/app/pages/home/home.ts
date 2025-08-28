// src/app/pages/home/home.ts
import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { RouterLink } from "@angular/router";
import { AsgardeoService } from "../../auth/asgardeo.service";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <h1>Angular + Asgardeo + Spring</h1>

    <p>isAuthenticated: {{ isAuthenticated }}</p>

    <p>
      <button (click)="login()">Sign in</button>
      <button (click)="logout()">Sign out</button>
    </p>

    <p>
      <a routerLink="/profile" *ngIf="isAuthenticated">Go to protected Profile</a>
    </p>

    <hr />
    <!-- WORKER-only button -->
    <button (click)="callHello()" *ngIf="hasRole('WORKER')">Call Spring /hello (WORKER)</button>

    <!-- ADMIN-only button -->
    <button (click)="callHelloRestrict()" *ngIf="hasRole('ADMIN')">Call Spring /helloRestrict (ADMIN)</button>

    <pre>{{ result | json }}</pre>
  `
})
export class HomeComponent {
  private auth = inject(AsgardeoService);
  private http = inject(HttpClient);

  isAuthenticated = false;
  result: any;
  roles: string[] = [];

  constructor() {
    // Initial state at page load
    this.auth.isAuthenticated()
      .then(async (v) => {
        this.isAuthenticated = v;
        if (v) {
          await this.loadRoles();
        }
      })
      .catch(err => console.error("[Home] isAuthenticated error", err));

    // React to auth events (if available in SDK)
    this.auth.on?.("sign-in", async () => {
      this.isAuthenticated = true;
      await this.loadRoles();
    });

    this.auth.on?.("sign-out", () => {
      this.isAuthenticated = false;
      this.roles = [];
    });
  }

  // ---- helpers -------------------------------------------------------------

  private normalizeRoles(input?: unknown): string[] {
    const arr = Array.isArray(input) ? input : [];
    return arr
      .map((v: any) => String(v))
      // some tenants return "Default/ADMIN" or "APPLICATION:app/WORKER"
      .map(s => s.split("/").pop()!)
      .map(s => s.toUpperCase().trim());
  }

  private async loadRoles(): Promise<void> {
    const info = await this.auth.getBasicUserInfo();     // userinfo claims
    const idt  = await this.auth.getIDToken();           // raw id_token string
    const payload = idt ? JSON.parse(atob(idt.split(".")[1])) : null;

    console.log("[userinfo]", info);
    console.log("[id_token payload]", payload);

    // Prefer groups/roles from userinfo; fall back to ID token if needed
    const uiGroups = this.normalizeRoles((info as any)?.groups);
    const uiRoles  = this.normalizeRoles((info as any)?.roles);
    const idGroups = this.normalizeRoles(payload?.groups);
    const idRoles  = this.normalizeRoles(payload?.roles);

    // union
    this.roles = Array.from(new Set([...uiGroups, ...uiRoles, ...idGroups, ...idRoles]));
    console.log("[roles assigned]", this.roles);
  }

  hasRole(r: "ADMIN" | "WORKER"): boolean {
    return this.roles.includes(r);
  }

  // ---- UI actions ----------------------------------------------------------

  login()  { this.auth.signIn().catch(console.error); }
  logout() { this.auth.signOut().catch(console.error); }

  callHello() {
    this.http.get("http://localhost:8080/hello").subscribe({
      next: r => this.result = r,
      error: e => this.result = e
    });
  }

  callHelloRestrict() {
    this.http.get("http://localhost:8080/helloRestrict").subscribe({
      next: r => this.result = r,
      error: e => this.result = e
    });
  }
}