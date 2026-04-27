# 🚀 Live Crypto Tracker

**Real-time Cryptocurrency Monitoring Platform**

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Supported-blue.svg)](https://www.docker.com/)
[![Status](https://img.shields.io/badge/Status-In%20Development-orange.svg)](#)

</div>

## 📖 Sumário

- [Visão Geral](#-visão-geral)
- [Diferenciais](#-diferenciais)
- [Arquitetura](#️-arquitetura)
- [Tech Stack](#-tech-stack)
- [Funcionalidades](#-funcionalidades)
- [Instalação](#-instalação)
- [Serviços e Portas](#-serviços-e-portas)
- [API & WebSocket](#-api--websocket)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Exemplos de Código](#-exemplos-de-código)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Checklist de Funcionalidades](#-checklist-de-funcionalidades)
- [Bônus](#-bônus)
- [Próximos Passos](#-próximos-passos)
- [Licença](#-licença)

---

## 📋 Visão Geral

Plataforma de tracking de criptomoedas em **tempo real** que consome dados diretamente da Binance WebSocket, exibe gráficos candlestick ao vivo, e permite configuração de alertas inteligentes.

**Diferencial:** Sistema de alertas que monitora variações percentuais e preços-alvo, com notificações via WebSocket e email.

**GitHub:** [live-crypto-tracker](https://github.com/seu-usuario/live-crypto-tracker)

---

## ✨ Diferenciais

| Feature | Descrição |
|---------|-----------|
| 🔴 **Dados Reais** | Consumo de WebSocket da Binance (não é simulado) |
| ⚡ **Tempo Real** | Broadcast de preços para todos clientes conectados |
| 🎯 **Alertas Inteligentes** | Condições personalizadas (preço alvo, variação percentual) |
| 📊 **Time-Series Database** | Uso de TimescaleDB para histórico eficiente |
| 🔄 **Fila Assíncrona** | Alertas processados com BullMQ |

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────┐
│  Frontend (Next.js)                 │
│  TradingView Lightweight Charts     │
└─────────────────┬───────────────────┘
                  │ WebSocket (Socket.io)
┌─────────────────▼───────────────────┐
│  NestJS WebSocket Gateway           │
│  (Price feed + Alert broadcaster)   │
└─────────────────┬───────────────────┘
                  │
      ┌───────────┼───────────┐
      │           │           │
 ┌────▼────┐ ┌──▼──────┐ ┌───▼─────────┐
 │ Binance  │ │  Redis  │ │ TimescaleDB │
 │ WebSocket│ │ (Cache +│ │ (Histórico) │
 │ (Stream) │ │ Queues) │ └─────────────┘
 └──────────┘ └─────────┘

┌──────────────────────────────────────┐
│  BullMQ Worker                       │
│  Processa alertas assincronamente    │
└──────────────────────────────────────┘
```


---

## 🛠️ Tech Stack

| Camada | Tecnologia | Finalidade |
|--------|------------|-----------|
| **Runtime** | Bun | Execução rápida |
| **Backend** | NestJS + WebSocket | API + comunicação real-time |
| **Frontend** | Next.js 15 + Tailwind | Interface responsiva |
| **Gráficos** | TradingView Charts | Candlesticks em tempo real |
| **Database** | PostgreSQL + TimescaleDB | Time-series otimizado |
| **Cache** | Redis | Preços + filas |
| **Queue** | BullMQ | Processamento assíncrono |
| **External** | Binance API | Dados de mercado |
| **Auth** | JWT | Autenticação |
| **Infra** | Docker Compose | Containerização |

---

## � Funcionalidades

### 📡 Tracking em Tempo Real
- Consumo de WebSocket da Binance para BTC, ETH, SOL, ADA, DOGE
- Broadcast de preços para todos clientes conectados
- Candlesticks atualizando a cada nova vela (1m, 5m, 15m)
- Indicador de variação percentual (24h)

### 🚨 Sistema de Alertas
- **Preço alvo:** "Me avise quando BTC > $70.000"
- **Variação percentual:** "Alertar se ETH cair 5% em 1 hora"
- **Notificações:** WebSocket (push) + Email (opcional)
- **Alertas persistentes:** Salvos no banco, verificados a cada novo preço

### 🔝 Screener
- Top 5 ganhadores/perdedores do dia
- Destaque de moedas com maior volume

### 📈 Dashboard
- Gráfico principal da moeda selecionada
- Cards com preços atualizados ao vivo
- Lista de alertas ativos do usuário
- Histórico de preços consultável

### 🔌 API Pública (opcional)
- `GET /api/prices/:symbol` - Último preço
- `GET /api/history/:symbol?from=&to=` - Histórico time-series

---

## � Instalação

### Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Docker** e **Docker Compose** ([Download aqui](https://www.docker.com/products/docker-desktop))
- **Node.js 20+** (opcional, apenas para desenvolvimento local) ([Download aqui](https://nodejs.org/))
- **Git** ([Download aqui](https://git-scm.com/))

### Passo a Passo

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/live-crypto-tracker
cd live-crypto-tracker

# 2. Configure as variáveis de ambiente
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# 3. Inicie todos serviços com Docker
docker-compose up -d

# 4. Acesse a aplicação
open http://localhost:3000

# 5. Para desenvolvimento local (opcional)
# Backend (porta 4000)
cd backend && bun install && bun run dev

# Frontend (porta 3000)
cd frontend && npm install && npm run dev
```

### 🌐 Serviços e Portas

| Serviço | Porta | URL |
|---------|-------|-----|
| Frontend | `3000` | [http://localhost:3000](http://localhost:3000) |
| Backend API | `4000` | [http://localhost:4000/api](http://localhost:4000/api) |
| WebSocket | `4001` | `ws://localhost:4001` |
| PostgreSQL | `5432` | `localhost:5432` |
| Redis | `6379` | `localhost:6379` |
| TimescaleDB | `5433` | `localhost:5433` |

---

## 📚 API & WebSocket

### REST API Endpoints

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| `GET` | `/api/prices/latest` | Últimos preços de todas moedas | ❌ |
| `GET` | `/api/prices/:symbol` | Último preço de uma moeda | ❌ |
| `GET` | `/api/history/:symbol` | Histórico de preços (query: from, to, interval) | ❌ |
| `POST` | `/api/alerts` | Criar novo alerta | ✅ JWT |
| `GET` | `/api/alerts` | Listar alertas do usuário | ✅ JWT |
| `DELETE` | `/api/alerts/:id` | Remover alerta | ✅ JWT |
| `POST` | `/api/auth/register` | Registrar usuário | ❌ |
| `POST` | `/api/auth/login` | Login (retorna JWT) | ❌ |

### WebSocket Events

**Eventos enviados pelo cliente:**

| Evento | Payload | Descrição |
|--------|---------|-----------|
| `subscribe` | `{ symbols: string[] }` | Inscrever em moedas |
| `unsubscribe` | `{ symbols: string[] }` | Cancelar inscrição |
| `create-alert` | `AlertConfig` | Criar alerta via WS |

**Eventos recebidos do servidor:**

| Evento | Payload | Descrição |
|--------|---------|-----------|
| `price:update` | `{ symbol, price, change24h, timestamp }` | Atualização de preço |
| `alert:triggered` | `{ id, symbol, condition, price }` | Alerta ativado |
| `alert:created` | `Alert` | Confirmação de criação |

---

## 📁 Estrutura do Projeto

```
live-crypto-tracker/
├── backend/
│   ├── src/
│   │   ├── price/
│   │   │   ├── price.gateway.ts       # WebSocket connection
│   │   │   ├── price.service.ts       # Binance integration
│   │   │   └── price.repository.ts    # TimescaleDB
│   │   ├── alerts/
│   │   │   ├── alerts.module.ts
│   │   │   ├── alerts.service.ts      # Alert logic
│   │   │   └── alerts.processor.ts    # BullMQ worker
│   │   ├── auth/                      # JWT authentication
│   │   └── main.ts
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PriceCard.tsx          # Card com preço ao vivo
│   │   │   ├── Chart.tsx              # TradingView chart
│   │   │   ├── AlertForm.tsx          # Criação de alertas
│   │   │   └── AlertList.tsx          # Alertas do usuário
│   │   ├── hooks/
│   │   │   └── useWebSocket.ts        # Socket.io client
│   │   └── pages/
│   │       ├── index.tsx              # Dashboard principal
│   │       └── alerts.tsx             # Gerenciamento de alertas
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 💡 Exemplos de Código

### Price Gateway (NestJS)

```typescript
@WebSocketGateway({ namespace: 'prices', cors: true })
export class PriceGateway implements OnGatewayConnection {
  private clients = new Map<string, Set<string>>();

  @SubscribeMessage('subscribe')
  async handleSubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() symbols: string[]
  ) {
    symbols.forEach(symbol => {
      client.join(`price:${symbol}`);
      this.clients.set(client.id, symbols);
    });
    
    // Envia preço atual imediatamente
    const prices = await this.priceService.getLatestPrices(symbols);
    client.emit('price:update', prices);
  }

  // Consome WebSocket da Binance
  async startBinanceFeed() {
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
    
    ws.on('message', async (data) => {
      const tickers = JSON.parse(data.toString());
      
      for (const ticker of tickers) {
        const symbol = ticker.s.replace('USDT', '');
        const price = parseFloat(ticker.c);
        const change24h = parseFloat(ticker.P);
        
        // 1. Broadcast para clientes inscritos
        this.server.to(`price:${symbol}`).emit('price:update', {
          symbol, price, change24h, timestamp: Date.now()
        });
        
        // 2. Salva no TimescaleDB (time-series)
        await this.priceRepository.save({ symbol, price, change24h });
        
        // 3. Verifica alertas (adicione na fila)
        await this.alertQueue.add('check-alerts', { symbol, price });
      }
    });
  }
}
```

### Alert Processor (BullMQ)

```typescript
@Processor('alerts')
export class AlertProcessor {
  @Process('check-alerts')
  async handleAlertCheck(job: Job<{ symbol: string; price: number }>) {
    const { symbol, price } = job.data;
    
    const alerts = await this.prisma.alert.findMany({
      where: {
        symbol,
        isActive: true,
        OR: [
          { targetPrice: { lte: price } },
          { targetPrice: { gte: price } }
        ]
      },
      include: { user: true }
    });
    
    for (const alert of alerts) {
      // Notifica via WebSocket
      this.priceGateway.notifyUser(alert.userId, {
        type: 'alert',
        symbol: alert.symbol,
        condition: alert.condition,
        targetPrice: alert.targetPrice,
        currentPrice: price
      });
      
      // Envia email (opcional)
      if (alert.user.email) {
        await this.emailService.sendAlertEmail(alert.user.email, {
          symbol: alert.symbol,
          targetPrice: alert.targetPrice,
          currentPrice: price
        });
      }
      
      // Desativa alerta (single-use)
      await this.prisma.alert.update({
        where: { id: alert.id },
        data: { isActive: false }
      });
    }
  }
}
```

### Frontend Hook - useWebSocket

```typescript
// hooks/useWebSocket.ts
export function useWebSocket(symbols: string[]) {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const socket = useMemo(() => io('http://localhost:4001/prices'), []);

  useEffect(() => {
    socket.emit('subscribe', symbols);
    
    socket.on('price:update', (data) => {
      setPrices(prev => ({
        ...prev,
        [data.symbol]: { price: data.price, change: data.change24h }
      }));
    });
    
    socket.on('alert:triggered', (alert) => {
      toast.success(`🚨 ${alert.symbol} atingiu ${alert.targetPrice}!`);
    });
    
    return () => {
      socket.emit('unsubscribe', symbols);
      socket.disconnect();
    };
  }, [symbols]);

  return { prices, socket };
}
```

---

## 📝 Variáveis de Ambiente

### Backend (.env)

```bash
PORT=4000
WS_PORT=4001

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/crypto_tracker
TIMESCALE_URL=postgresql://postgres:postgres@localhost:5433/crypto_metrics

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=your-super-secret-key-change-this

EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Frontend (.env.local)

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_WS_URL=ws://localhost:4001/prices
```

---

## ✅ Checklist de Funcionalidades

- [ ] Consumo de WebSocket da Binance
- [ ] Broadcast de preços em tempo real
- [ ] Gráfico candlestick atualizando ao vivo
- [ ] Cards com preços e variação percentual
- [ ] Criação de alertas (preço alvo / variação)
- [ ] Notificações WebSocket push
- [ ] Histórico de preços no TimescaleDB
- [ ] Screener (top gainers/losers)
- [ ] Autenticação JWT
- [ ] Containerização com Docker
- [ ] Testes unitários
- [ ] Documentação Swagger

---

## 🎁 Bônus

- 🤖 **Telegram Bot** - Receber alertas no Telegram
- 🔗 **Webhook** - Configurar URL para receber alertas via POST
- 🌍 **Multi-exchange** - Adicionar Coinbase, Kraken, Bybit
- 📊 **Trading Simulator** - Simular compra/venda com saldo fictício
- 📥 **Export CSV** - Exportar histórico de preços

---

## 📈 Próximos Passos

1. Adicionar mais exchanges (Coinbase, Kraken)
2. Implementar WebSocket nativo no frontend (sem socket.io)
3. Adicionar suporte a forex (EUR/USD, GBP/USD)
4. Criar status page pública
5. Implementar cache com Redis para queries frequentes
6. Adicionar testes E2E com Cypress
7. Implementar Dark Mode

---

## 📝 Licença

MIT - Sinta-se livre para usar este projeto em seus próprios projetos.

---

## 👨‍💻 Autor

**Matheus Pereira** - [GitHub](https://github.com/seu-usuario)

<div align="center">

Built with ☕, Node.js, and real-time WebSockets 🚀

</div>