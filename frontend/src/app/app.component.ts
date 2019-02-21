import { Component } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import {ApiService} from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Dashboard';
  videoInput1 = "";
  videoInput2 = "";
  shelves:Array<any>;
  products:any;
  shelfSelected:Array<any>=[
    { shelf_no:1, product:'' },
    { shelf_no:2, product:'' },
    { shelf_no:3, product:'' },
    { shelf_no:4, product:'' }
  ]

  
  constructor(private socket:Socket, private API:ApiService){
    this.getMessageCam1();
    this.getMessageCam2();
    this.getRacks();
    this.getProducts();
  }

  formSubmit(){
    console.log(this.shelfSelected);
  }

  getRacks(){
    this.API.getRacks().subscribe(data=>{
      this.shelves=data[0].shelves;
      console.log(this.shelves)
    })
  }

  getProducts(){
    this.API.getProducts().subscribe(data=>{
      this.products=data;
      console.log(this.products)
    })
  }

  getMessageCam1() {
      return this.socket
          .fromEvent("cam1")
          .subscribe( data => {
            this.videoInput1 = 'data:image/jpeg;base64,'+data;
          });
  }
  getMessageCam2() {
    return this.socket
        .fromEvent("cam2")
        .subscribe( data => {
          this.videoInput2 = 'data:image/jpeg;base64,'+data;
        });
}
}
