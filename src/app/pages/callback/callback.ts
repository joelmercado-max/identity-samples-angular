import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { AsgardeoAuthService } from "@asgardeo/auth-angular";

@Component({
  selector: "app-callback",
  standalone: true,
  imports: [CommonModule],
  template: `<p>Finishing login…</p>`
})
export class CallbackComponent implements OnInit {
  private auth = inject(AsgardeoAuthService);
  private router = inject(Router);

  async ngOnInit() {
    // Complete the OIDC code flow and then go home (or wherever you prefer)
    try {
      await this.auth.signIn();     // SDK will detect it's the callback turn
      await this.router.navigateByUrl("/");
    } catch (e) {
      console.error(e);
    }
  }
}