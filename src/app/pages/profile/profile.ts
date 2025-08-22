import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AsgardeoAuthService } from "@asgardeo/auth-angular";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Profile (protected)</h2>
    <button (click)="load()">Load claims</button>
    <pre>{{ claims | json }}</pre>
  `
})
export class ProfileComponent {
  private auth = inject(AsgardeoAuthService);
  claims: any;

  async load() {
    this.claims = await this.auth.getBasicUserInfo();
  }
}