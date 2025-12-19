import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { CurrentExchangeRateResponse, DailyExchangeRateResponse } from '../models/exchange.model';
import { environment } from '../models/environment';

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {
  private cache = new Map<string, any>();

  constructor(private http: HttpClient) {}

  getCurrentExchangeRate(fromSymbol: string, toSymbol: string = 'BRL'): Observable<CurrentExchangeRateResponse> {
    const cacheKey = `current_${fromSymbol}_${toSymbol}`;

    if (this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey));
    }

    const params = new HttpParams()
      .set('apiKey', environment.apiKey)
      .set('from_symbol', fromSymbol)
      .set('to_symbol', toSymbol);

    return this.http.get<CurrentExchangeRateResponse>(
      `${environment.apiBaseUrl}/open/currentExchangeRate`,
      { params }
    ).pipe(
      map((res: any) => ({
        ...res,
        from: res.from ?? res.fromSymbol,
        to: res.to ?? res.toSymbol
      } as CurrentExchangeRateResponse)),
      tap(data => this.cache.set(cacheKey, data))
    );
  }

  getDailyExchangeRate(fromSymbol: string, toSymbol: string = 'BRL'): Observable<DailyExchangeRateResponse> {
    const cacheKey = `daily_${fromSymbol}_${toSymbol}`;
    
    if (this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey));
    }

    const params = new HttpParams()
      .set('apiKey', environment.apiKey)
      .set('from_symbol', fromSymbol)
      .set('to_symbol', toSymbol);

    return this.http.get<DailyExchangeRateResponse>(
      `${environment.apiBaseUrl}/open/dailyExchangeRate`,
      { params }
    ).pipe(
      map((res: any) => ({
        ...res,
        from: res.from ?? res.fromSymbol,
        to: res.to ?? res.toSymbol,
        data: res.data || []
      } as DailyExchangeRateResponse)),
      tap(data => this.cache.set(cacheKey, data))
    );
  }

  clearCache(): void {
    this.cache.clear();
  }
}
