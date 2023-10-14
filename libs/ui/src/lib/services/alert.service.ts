import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private translate = inject(TranslateService);
  private toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer),
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });
  public showAlert(alert: { icon: SweetAlertIcon; message: string }) {
    const { icon, message: title } = alert;
    this.toast.fire({
      icon,
      title: this.translate.instant(title),
    });
  }
}
