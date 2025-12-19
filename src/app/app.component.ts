import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExchangeService } from './core/services/exchange.service';
import { CurrentExchangeRateResponse, DailyExchangeRate } from './core/models/exchange.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currencyCode = '';
  currentRate: CurrentExchangeRateResponse | null = null;
  dailyRates: DailyExchangeRate[] = [];
  isLoadingCurrent = false;
  isLoadingDaily = false;
  error = '';
  showDailyRates = false;

  constructor(private exchangeService: ExchangeService) {}

  onSubmit(): void {
    const code = this.currencyCode.trim().toUpperCase();

    if (!this.isValidCurrencyCode(code)) {
      this.error = 'Por favor, insira um código de moeda válido (3 letras)';
      return;
    }

    this.error = '';
    this.currentRate = null;
    this.dailyRates = [];
    this.showDailyRates = false;
    this.isLoadingCurrent = true;

    this.exchangeService.getCurrentExchangeRate(code).subscribe({
      next: (data) => {
        if (data.success) {
          this.currentRate = {
            ...data,
            lastUpdatedAt: new Date().toISOString()
          };
        } else {
          this.error = 'Falha ao buscar câmbio. Tente novamente.';
        }
        this.isLoadingCurrent = false;
      },
      error: (err) => {
        this.error = 'Falha ao buscar câmbio. Tente novamente.';
        this.isLoadingCurrent = false;
        console.error(err);
      }
    });
  }

  toggleDailyRates(): void {
    this.showDailyRates = !this.showDailyRates;

    if (this.showDailyRates && this.dailyRates.length === 0 && this.currentRate) {
      this.isLoadingDaily = true;
      const code = this.currentRate.from;

      this.exchangeService.getDailyExchangeRate(code).subscribe({
        next: (data) => {
          if (data.success && data.data) {
            this.dailyRates = data.data.slice(0, 30);
          } else {
            this.error = 'Falha ao buscar histórico. Tente novamente.';
          }
          this.isLoadingDaily = false;
        },
        error: (err) => {
          this.error = 'Falha ao buscar histórico. Tente novamente.';
          this.isLoadingDaily = false;
          console.error(err);
        }
      });
    }
  }

  calculateCloseDiff(index: number): { value: number; isPositive: boolean; isNeutral: boolean } {
    if (index === this.dailyRates.length - 1) {
      return { value: 0, isPositive: false, isNeutral: true };
    }

    const current = this.dailyRates[index].close;
    const previous = this.dailyRates[index + 1].close;
    const diff = ((current - previous) / previous) * 100;

    return {
      value: diff,
      isPositive: diff > 0,
      isNeutral: diff === 0
    };
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }

  formatDateTime(dateStr: string): string {
    if (!dateStr) return '';

    const date = new Date(dateStr.replace(' ', 'T'));
    if (isNaN(date.getTime())) return dateStr;

    const formatted = new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date);

    return formatted.replace(',', ' -');
  }

  private isValidCurrencyCode(code: string): boolean {
    return /^[A-Z]{3}$/.test(code);
  }
}