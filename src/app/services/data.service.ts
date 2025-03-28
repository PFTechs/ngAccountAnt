import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Collection, Item } from '../models/objects';

@Injectable({
  providedIn: 'root'
})
export class DataService {

//url: string = "https://localhost:44387/";
url: string = "http://localhost:5000/";

  constructor(private http: HttpClient) { }

  getItems() : Observable<Item[]> {
    return this.http.get<Item[]>(this.url + "api/Items")
    // .pipe(tap(data => console.log('All', JSON.stringify(data))),
    // catchError(this.handleError);
  }

  postItem(items: Item[]): Observable<any> {
    return this.http.post(this.url + "api/Items", items)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateItem(item: Item): Observable<any> {
    return this.http.put(this.url + "api/Items/" + item.id, item)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteItem(id: number): Observable<any> {
    return this.http.delete(this.url + "api/Items/" + id)
      .pipe(
        catchError(this.handleError)
      );
  }

  getCollections() : Observable<Collection[]> {
    return this.http.get<Collection[]>(this.url + "api/Collections")
    // .pipe(tap(data => console.log('All', JSON.stringify(data))),
    // catchError(this.handleError);
  }

  postCollection(collection: Collection): Observable<any> {
    return this.http.post(this.url + "api/Collections", collection)
      .pipe(
        catchError(this.handleError)
      );
  }

updateCollection(collection: Collection): Observable<Collection> {
  return this.http.put<Collection>(this.url + "api/Collections/" + collection.id, collection)
}

  deleteCollection(collectionId: number): Observable<any> {
    return this.http.delete(this.url + "api/Collections/" + collectionId)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(err: HttpErrorResponse) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }

}
