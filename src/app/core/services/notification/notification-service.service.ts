import { Injectable } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(public toastr: ToastrManager) {
  }
  showSuccess(message: string) {
    this.toastr.successToastr(`${message}`, 'Success!');
  }

  showError(message: string) {
    this.toastr.errorToastr(`${message}`, 'Oops!');
  }

  showWarning(message: string) {
    this.toastr.warningToastr(message, 'Warning!');
  }

  showInfo(message: string) {
    this.toastr.infoToastr(message, 'Success');
  }
  showInfoCustom(message: string) {
    this.toastr.customToastr(
      `<span style="color: green; font - size: 16px; text - align: center; margin-top:190px">${message}</span>`,
      null,
      { enableHTML: true }
    );
  }
  showToast(position: any, message: string) {
    this.toastr.errorToastr(`<h6 class="top-right">${message}</h6>`, 'Oops, something went Wrong', {
      position: position,
      enableHTML: true,
      timeOut: 50000000
    });
  }
}

