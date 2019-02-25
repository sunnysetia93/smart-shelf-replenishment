import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Socket } from 'ngx-socket-io';
import { faBell,faTable,faVideo,faDatabase } from '@fortawesome/free-solid-svg-icons';


import {ApiService} from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Dashboard';
  videoInput1 = null;
  videoInput2 = null;
  shelves:Array<any>;
  products:any;
  shelfSelected:Array<any>=[
    { shelfId:1, product:'' },
    { shelfId:2, product:'' },
    { shelfId:3, product:'' },
    { shelfId:4, product:'' }
  ]

  faBell = faBell;
  faTable = faTable;
  faVideo = faVideo;
  faDatabase =faDatabase;


  
  constructor(private socket:Socket, private API:ApiService,public dialog: MatDialog){
    this.getMessageCam1();
    this.getMessageCam2();
    this.getRacks();
    this.getProducts();
    
  }
  
  ngOnInit(): void {
    
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '20em',
      position: {
        top: '10em',
        left: '35em'
      },
      data:{ type:'Warning', message:'Kindly allocate a product with each shelf to successfully submit the form!'}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openSuccessDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '20em',
      position: {
        top: '10em',
        left: '35em'
      },
      data:{ type:'Success', message:'Operation Successful !'}

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  formSubmit(){
    let isNone=false;
    this.shelfSelected.forEach(shelf => {
      if(shelf.product==''){
        isNone=true;
        }
    });
    
    if(isNone)
      this.openDialog();

    else{
        this.shelfSelected.forEach(shelf=>{
            this.updateProductAllocation(shelf.shelfId,shelf.product);
        })
        this.openSuccessDialog();
    }

  }
  
  selectionChange(optionValue){
    if(optionValue==""){
      this.products.forEach(product => {
          this.shelfSelected[product.shelf.id-1].product="";
          product.isSelected=false;
        });
      }
    else{
      
      this.products.forEach(product => {
        if(product.name==optionValue){
          product.isSelected=true;
        }
      });
    }
    }
    
  getRacks(){
    this.API.getRacks().subscribe(data=>{
      this.shelves=data[0].shelves;
      
      for (let index = 0; index < this.shelves.length; index++) {
        this.shelfSelected[index].shelfId=this.shelves[index].id;
          this.shelfSelected[index].product=this.shelves[index].product.name;
        }
      })
    }

    getProducts(){
      this.API.getProducts().subscribe(data=>{
        this.products=data;
      console.log(this.products)
      this.products.forEach(product => {
        product.isSelected=true
      });
    })
    
  }

  updateProductAllocation(productName,shelfId){
      this.API.updateProductAllocation(productName,shelfId).subscribe(data=>{
        console.log(data);
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

//Dialog Component
    
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data) {

    }



  onNoClick(): void {
    this.dialogRef.close();
  }

}
