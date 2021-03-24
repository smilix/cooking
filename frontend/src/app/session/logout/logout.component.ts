import { Component, OnInit } from '@angular/core';
import {SessionService} from '../state/session.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  error?: string;

  constructor(
    private sessionService: SessionService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.sessionService.logout().subscribe({
      complete: () => {
        this.router.navigate(['']);
      },
      error: (err: Error) => this.error = err.message
    });
  }

}
