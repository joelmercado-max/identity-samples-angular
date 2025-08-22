// src/app/auth/auth.interceptor.ts
import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AsgardeoService } from "./asgardeo.service";
import { from, switchMap } from "rxjs";

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  // Only add token for your API
  if (!req.url.startsWith("http://localhost:8080")) {
    return next(req);
  }

  const auth = inject(AsgardeoService);

  return from(auth.getAccessToken()).pipe(
    switchMap((token) => {
      const authReq = token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;
      return next(authReq);
    })
  );
};