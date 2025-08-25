import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AsgardeoService } from "../../auth/asgardeo.service";

@Component({
  selector: "app-callback",
  standalone: true,
  template: `<p>Completing sign-in…</p>`
})
export class CallbackComponent {
  constructor(private auth: AsgardeoService, private router: Router) {
    this.finish();
  }

  private async finish() {
    try {
      await this.auth.handleCallbackIfPresent();
    } catch (e) {
      console.error("[Callback] handleCallbackIfPresent failed", e);
    } finally {
      // send the user somewhere sensible after login
      this.router.navigateByUrl("/");
    }
  }
}