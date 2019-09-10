import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
@Injectable()
export class NotificationService {
  constructor(private toastrService: ToastrService) {}

  success(content = '', title = '', options = {}) {
    this.toastrService.success(content, title, options);
  }

  warning(content = '', title = '', options = {}) {
    this.toastrService.warning(content, title, options);
  }

  error(content = '', title = '', options = {}) {
    this.toastrService.error(content, title, options);
  }
}
