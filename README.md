# BRL Exchange Rate

Webapp Angular para consultar a taxa de câmbio do Real Brasileiro (BRL) contra outras moedas.

## 📋 Visão Geral

Este projeto foi desenvolvido como parte do teste técnico da Action Labs. A aplicação permite que o usuário consulte:
- Taxa de câmbio atual entre uma moeda e o Real (BRL)
- Histórico dos últimos 30 dias de câmbio com cálculo de variação percentual

## 🚀 Requisitos

- Node.js 18+ 
- npm 9+
- Angular CLI 19+

## 📦 Instalação

```bash
npm install --legacy-peer-deps
```

## ▶️ Como Rodar

```bash
ng serve
```

Acesse: `http://localhost:4200`

## 🎯 Como Usar

1. Digite um código de moeda de 3 letras (ex: USD, EUR, GBP, JPY, CAD)
2. Clique em "EXCHANGE RESULT"
3. Visualize a taxa de câmbio atual
4. Clique em "LAST 30 DAYS" para expandir o histórico (carregamento sob demanda)
5. Veja a variação percentual (CLOSE DIFF %) de cada dia em relação ao anterior

## ⚙️ Configuração da API

**Base URL:** `https://api-brl-exchange.actionlabs.com.br/api/1.0`
**API Key:** `RVZG0GHEV2KORLNA`

A configuração está em: `src/app/core/models/environment.ts`

### Endpoints Utilizados

1. **Taxa Atual:**
   `GET /open/currentExchangeRate?apiKey={key}&from_symbol={moeda}&to_symbol=BRL`

2. **Histórico Diário:**
   `GET /open/dailyExchangeRate?apiKey={key}&from_symbol={moeda}&to_symbol=BRL`

### Rate Limits

- 5 chamadas/minuto
- 500 chamadas/dia

**Estratégia implementada:**
- Busca apenas ao clicar no botão (não a cada tecla)
- Cache em memória por moeda durante a sessão
- Histórico carregado apenas ao expandir o accordion (lazy loading)

## 🎨 Design

Cores utilizadas (conforme Figma):
- Azul: `#07B0FB`
- Verde: `#69C669` (variação positiva)
- Vermelho: `#E54E4E` (variação negativa)

## 🧮 Cálculo do CLOSE DIFF (%)

```typescript
closeDiffPercent = ((closeAtual - closeAnterior) / closeAnterior) * 100
```

- **Positivo:** exibe `+X.XX%` em verde com seta ▲
- **Negativo:** exibe `-X.XX%` em vermelho com seta ▼
- **Primeiro item (sem anterior):** exibe `—` (neutro)

## 🧮 Cálculo do CLOSE DIFF (%)

```typescript
closeDiffPercent = ((closeAtual - closeAnterior) / closeAnterior) * 100
```

- **Positivo:** exibe `+X.XX%` em verde com seta ▲
- **Negativo:** exibe `-X.XX%` em vermelho com seta ▼
- **Primeiro item (sem anterior):** exibe `—` (neutro)

**Observação:** O "dia anterior" refere-se ao item anterior na série temporal retornada pela API, não necessariamente D-1 no calendário (devido a fins de semana/feriados).

## 📁 Estrutura de Pastas

```
angular-currency-exchange/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── models/
│   │   │   │   ├── exchange.model.ts      # Interfaces TypeScript
│   │   │   │   └── environment.ts         # Config API
│   │   │   └── services/
│   │   │       └── exchange.service.ts    # Service com cache
│   │   ├── app.component.ts               # Componente principal
│   │   ├── app.component.html             # Template
│   │   └── app.component.scss             # Estilos
│   ├── index.html
│   ├── main.ts
│   └── styles.scss                        # Estilos globais
├── public/
│   └── assets/
│       └── action-labs-logo.svg
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Decisões Técnicas

### Arquitetura
- **Standalone Components:** Utilizado o padrão standalone do Angular 19+ para simplificar a estrutura
- **Service com Cache:** Implementado cache em memória (Map) para evitar chamadas desnecessárias à API
- **Lazy Loading:** Histórico de 30 dias carregado apenas ao expandir o accordion

### Validação
- Código de moeda: 3 letras, convertido automaticamente para uppercase
- Validação simples com regex: `/^[A-Z]{3}$/`

### Formatação
- **Moeda:** `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`
- **Data:** `dd/MM/yyyy` para cards diários
- **Data/Hora:** `dd/MM/yyyy - HHmm` para taxa atual

### Acessibilidade
- Labels associados aos inputs
- Botão com `type="submit"`
- `aria-expanded` no accordion
- Estados de loading com feedback visual

### Tratamento de Erros
- Mensagem genérica: "Falha ao buscar câmbio. Tente novamente."
- Não trata especificamente `rateLimitExceeded` (conforme especificação)
- Erros logados no console para debug

## 📝 Observações

- O app não trata o erro de rate limit da API (conforme solicitado nas specs)
- A ordenação dos dados diários segue a ordem retornada pela API
- O primeiro item do histórico não possui "dia anterior", então exibe `—` no CLOSE DIFF

## 🧪 Testes

Para rodar os testes (quando implementados):

```bash
ng test
```

## 🏗️ Build

```bash
ng build
```

Os arquivos de build estarão em `dist/angular-currency-exchange/`

## 📄 Licença

Este projeto foi desenvolvido para fins de avaliação técnica.

---

**Desenvolvido para:** Action Labs  
**Tecnologias:** Angular 19, TypeScript, SCSS, RxJS
