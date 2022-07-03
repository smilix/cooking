import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, Validators} from '@angular/forms';
import {Credentials, SessionService} from '../state/session.service';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm = this.formBuilder.group({
    // must match signature of "Credentials"
    login: ['', Validators.required],
    password: ['', Validators.required],
  });

  errorMsg = '';

  constructor(
    private sessionService: SessionService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
  ) {
  }

  ngOnInit(): void {

  }

  onSubmit(data: Credentials): void {
    console.log('data', data);

    this.errorMsg = '';

    this.sessionService.login(data).subscribe({
      complete: () => this.router.navigate(['/']),
      error: (err: HttpErrorResponse) => {
        console.error('Can not login', err);
        if (err.status === 400) {
          this.errorMsg = 'Invalid user/password.';
        } else {
          this.errorMsg = 'Unknown login error: ' + JSON.stringify(err.error);
        }
      }
    });
  }
}
