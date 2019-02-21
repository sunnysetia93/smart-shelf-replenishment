import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import {HttpClientModule} from '@angular/common/http';

import {ApiService} from './api.service'
import { AppComponent } from './app.component';

const config: SocketIoConfig = { url: 'http://localhost:8000', options: {} };


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
