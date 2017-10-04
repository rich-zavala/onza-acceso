import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
  selector: 'app-root',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  display = true;
  servidor = 'http://192.168.0.6/onza/acceso/';
  title = 'app';
  form: FormGroup;
  verificando = false;
  accesoConcedido = false;
  msgs: Message[] = [];

  constructor( @Inject(FormBuilder) fb: FormBuilder, private http: HttpClient, private messageService: MessageService) {
    this.form = fb.group({
      'login': fb.group({
        nombre: ['', [Validators.required, Validators.minLength(4)]],
        password: ['', [Validators.required, Validators.minLength(4)]],
      })
    });
  }

  login($event) {
    if (!this.verificando) {
      $event.stopPropagation();
      this.form.disable();
      this.resetMessages();
      this.verificando = true;
      this.msgs.push({ severity: 'info', summary: 'Verificando claves de accesso...' });
      this.http.post(this.servidor + 'login.html', this.form.value.login)
        .subscribe(
        (data: any) => {
          this.resetMessages();
          if (data.error === 0) {
            this.msgs.push({ severity: 'success', summary: 'Accesso correcto' });
          } else {
            this.msgs.push({ severity: 'warn', summary: 'Las claves de acceso no son válidas' });
            this.form.enable();
          }
        },
        () => {
          this.msgs.push({ severity: 'error', summary: 'Ha ocurrido un error', detail: 'Intente de nuevo más tarde' });
          this.form.enable();
        },
        () => this.goToSite());
    }
  }

  resetMessages() {
    this.msgs = [];
    this.verificando = false;
  }

  goToSite() {
    setTimeout(() => {
      this.accesoConcedido = true;
      setTimeout(() => window.location.href = 'http://google.com', 800);
    }, 1500);
  }
}
