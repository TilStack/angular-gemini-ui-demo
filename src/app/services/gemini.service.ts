import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  constructor(private http: HttpClient) {}
  apikey = 'AIzaSyDiNrEgQOfR7-Pe2yp44ecS0Lqix8qzAdM';
  prompt = 'Write a story about a magic backpack.';
  url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
  generateText(prompt: object[]): Observable<any> {
    return this.http
      .post<string>(
        `${this.url}?key=${this.apikey}`,
        {
          contents: [{ parts: prompt }],
        }
      )
      .pipe(
        tap((response) => {
          console.log(response);
        }),
        catchError((error) => this.handleError(error, null))
      );
  }

  private log(response: any) {
    console.table(response); 
  }

  private handleError(error: Error, errorValue: any) {
    console.error(error);
    return of(errorValue);
  }
}
