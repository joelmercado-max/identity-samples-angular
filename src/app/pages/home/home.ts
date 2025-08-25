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
    <button (click)="callHello()">Call Spring /hello</button>
    <pre>{{ result | json }}</pre>
  `
})
export class HomeComponent {
  private auth = inject(AsgardeoService);
  private http = inject(HttpClient);

  isAuthenticated = false;
  result: any;

  constructor() {
    this.auth.isAuthenticated()
      .then(v => this.isAuthenticated = v)
      .catch(err => console.error("[Home] isAuthenticated error", err));

    // Optional: if events exist in this SDK version
    this.auth.on?.("sign-in",  () => (this.isAuthenticated = true));
    this.auth.on?.("sign-out", () => (this.isAuthenticated = false));
  }

  login()  { this.auth.signIn().catch(console.error); }
  logout() { this.auth.signOut().catch(console.error); }

  
  callHello() {
  console.log("[Home] callHello clicked");
  this.http.get("http://localhost:8080/hello", { observe: "response" }).subscribe({
    next: (res) => {
      console.log("[Home] /hello OK:", res.status, res);
      this.result = res.body ?? res;
    },
    error: (err) => {
      console.error("[Home] /hello error:", err);
      this.result = err; // show the full HttpErrorResponse object
    }
  });
}
}