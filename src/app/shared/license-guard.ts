import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { Observable, map } from "rxjs";
import { LicenseService } from "../services/license.service";

@Injectable({ providedIn: 'root' })
export class LicenseGuard implements CanActivate {

  constructor(
    private license: LicenseService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.license.checkLicense().pipe(
      map(res => {
        if (res.status === 'EXPIRED') {
          this.router.navigate(['/subscription']);
          return false;
        }
        return true;
      })
    );
  }
}
