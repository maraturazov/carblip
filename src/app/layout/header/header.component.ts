import { Component, OnInit } from '@angular/core';
import { AuthServiceImpl } from 'app/shared/states/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(private authService: AuthServiceImpl) {}

  ngOnInit() {}

  isLoggedIn() {
    return this.authService.getToken();
  }
}
