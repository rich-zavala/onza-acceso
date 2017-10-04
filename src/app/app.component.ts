import { Component, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  display = true;
  servidor = 'http://192.168.0.6/onza/acceso/';
  title = 'app';
  form: FormGroup;

  verificando = false;
  clavesInvalidas = false;
  accesoCorrecto = false;
  error = false;

  usuario = {
    nombre: '',
    password: ''
  };

  constructor( @Inject(FormBuilder) fb: FormBuilder, private http: HttpClient) {
    this.form = fb.group({
      'login': fb.group({
        nombre: ['admin', [Validators.required, Validators.minLength(4)]],
        password: ['admin', [Validators.required, Validators.minLength(4)]],
      })
    });
  }

  login($event) {
    if (!this.verificando) {
      $event.stopPropagation();
      this.form.disable();
      this.resetMessages();
      this.verificando = true;

      setTimeout(() => {
        this.http.post(this.servidor + 'login.html', this.form.value.login)
          .subscribe(
          (data: any) => {
            this.resetMessages();
            if (data.error === 0) {
              this.accesoCorrecto = true;
            } else {
              this.clavesInvalidas = true;
              this.form.enable();
            }
          },
          () => {
            this.error = true;
            this.form.enable();
          },
          () => {
            setTimeout(() => this.resetMessages(), 2000);
          }
          );
      }, 2000);
    }
  }

  resetMessages() {
    this.verificando = false;
    this.clavesInvalidas = false;
    this.accesoCorrecto = false;
    this.error = false;
  }
}
