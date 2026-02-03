const fs = require('fs');
const path = require('path');

const apiKey = process.env.EXCHANGE_API_KEY;
const apiBaseUrl = process.env.EXCHANGE_API_BASE_URL || 'https://api-brl-exchange.actionlabs.com.br/api/1.0';

if (!apiKey) {
  console.log('EXCHANGE_API_KEY não definida — config.json não será gerado (use o arquivo local ou defina na Vercel).');
  process.exit(0);
}

const config = {
  apiBaseUrl,
  apiKey
};

const outPath = path.join(__dirname, '..', 'public', 'config.json');
fs.writeFileSync(outPath, JSON.stringify(config, null, 2), 'utf8');
console.log('config.json gerado em public/ a partir das variáveis de ambiente.');
