// src/app/auth/auth.interceptor.ts
import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AsgardeoService } from "./asgardeo.service";
import { from, switchMap, tap } from "rxjs";

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  if (!req.url.startsWith("http://localhost:8080")) {
    return next(req);
  }

  const auth = inject(AsgardeoService);

  return from(auth.getAccessToken()).pipe(
    tap(token => {
      const preview = token ? token.slice(0, 12) + "…"
                            : "(none)";
      console.debug("[auth.interceptor] token:", preview);
    }),
    switchMap((token) => {
      const authReq = token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;

      console.debug("[auth.interceptor] →", authReq.method, authReq.url, "header attached?", !!token);
      return next(authReq);
    })
  );
};