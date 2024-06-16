import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  addAlert() {
    Swal.fire({
      title: 'Thank you...',
      text: 'Added succesfully!',
      showConfirmButton: false, icon: 'success', timer: 3000
    });
  }
  updateAlert() {
    Swal.fire({
      title: 'Thank you...',
      text: 'Updated succesfully!',
      showConfirmButton: false, icon: 'success', timer: 3000
    });
  }
  DeletealertWithSuccess() {
    Swal.fire({
      title: 'Thank you...',
      text: 'Deleted succesfully!',
      showConfirmButton: false, icon: 'success', timer: 4000
    });
  }
  failureAlert(title:any,message:any) {
    Swal.fire({
      title: title,
      text: message,
      showConfirmButton: true, icon: 'error', //timer: 4000
    });
  }
  importAlert() {
    Swal.fire({
      title: 'Thank you...',
      text: 'File imported succesfully!',
      showConfirmButton: false, icon: 'success', timer: 3000
    });
  }
}
