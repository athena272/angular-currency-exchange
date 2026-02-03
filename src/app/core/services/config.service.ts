import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AppConfig } from '../models/app-config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: AppConfig | null = null;

  constructor(private http: HttpClient) {}

  loadConfig(): Promise<void> {
    return firstValueFrom(
      this.http.get<AppConfig>('/config.json')
    ).then(c => {
      this.config = c;
    }).catch(err => {
      console.error(
        'Não foi possível carregar config.json. Crie o arquivo a partir de config.example.json (veja README).',
        err
      );
      throw err;
    });
  }

  get apiBaseUrl(): string {
    this.ensureLoaded();
    return this.config!.apiBaseUrl;
  }

  get apiKey(): string {
    this.ensureLoaded();
    return this.config!.apiKey;
  }

  get isLoaded(): boolean {
    return this.config !== null;
  }

  private ensureLoaded(): void {
    if (!this.config) {
      throw new Error('Config ainda não foi carregada. Verifique se APP_INITIALIZER está configurado.');
    }
  }
}
