import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule  } from '@angular/platform-browser/animations';
import {MatDialogModule} from '@angular/material/dialog';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import {HttpClientModule} from '@angular/common/http';
import {MatNativeDateModule} from '@angular/material';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



import {ApiService} from './api.service'
import { AppComponent, DialogOverviewExampleDialog } from './app.component';

const config: SocketIoConfig = { url: 'http://localhost:8000', options: {} };


@NgModule({
  declarations: [
    AppComponent,
    DialogOverviewExampleDialog
  ],
  entryComponents: [AppComponent, DialogOverviewExampleDialog],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule,
    MatNativeDateModule,
    MatDialogModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
