import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  BASE_URL= "http://localhost:8000/";
  httpOptions={
    "Content-Type":"application/json"
  }

  constructor(private http:HttpClient) { }

  getRacks(){
    return this.http.get(this.BASE_URL+'api/rack/all');
  }

  getProducts(){
    return this.http.get(this.BASE_URL+'api/product');
  }

  updateProductAllocation(shelfId,productName){
    let body = {
      productName:productName,
      shelfId:shelfId
    }
    return this.http.post(this.BASE_URL+'api/shelf/allocateProduct',body);
  }
}
