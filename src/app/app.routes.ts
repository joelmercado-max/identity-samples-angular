import { Routes } from "@angular/router";
import { HomeComponent } from "./pages/home/home";
import { ProfileComponent } from "./pages/profile/profile";
import { CallbackComponent } from "./pages/callback/callback";
import { AsgardeoAuthGuard } from "@asgardeo/auth-angular";

export const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "auth/callback", component: CallbackComponent },
  { path: "profile", component: ProfileComponent, canActivate: [AsgardeoAuthGuard] },
  { path: "**", redirectTo: "" }
];