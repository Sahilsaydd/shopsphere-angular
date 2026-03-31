import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface categories{
  id:number,
  name:string,
  desc:string,
  image:string
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

 private url = '/assets/data/categories_data/categories.json';
  constructor(private http:HttpClient){}

  getCategories(): Observable<categories[]>{
    return this.http.get<categories[]>(this.url);

  }
  
}