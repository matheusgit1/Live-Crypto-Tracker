import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { CreateCryptoDto } from './dto/create-crypto.dto';
import { UpdateCryptoDto } from './dto/update-crypto.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Crypto')
@Controller('crypto')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  //   | `GET` | `/api/prices/latest` | Últimos preços de todas moedas | ❌ |
  // | `GET` | `/api/prices/:symbol` | Último preço de uma moeda | ❌ |
  // | `GET` | `/api/history/:symbol` | Histórico de preços (query: from, to, interval) | ❌ |
  // | `POST` | `/api/alerts` | Criar novo alerta | ✅ JWT |
  // | `GET` | `/api/alerts` | Listar alertas do usuário | ✅ JWT |
  // | `DELETE` | `/api/alerts/:id` | Remover alerta | ✅ JWT |

  @Get('prices/latest')
  findAll() {
    return this.cryptoService.findAll();
  }

  @Get('prices/:symbol')
  findOne(@Param('symbol') symbol: string) {
    return this.cryptoService.findOne(symbol);
  }

  @Get('history/:symbol')
  @ApiQuery({ name: 'from', required: false, type: String })
  @ApiQuery({ name: 'to', required: false, type: String })
  @ApiQuery({ name: 'interval', required: false, type: String })
  create(
    @Param('symbol') symbol: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('interval') interval?: string,
  ) {
    return this.cryptoService.historyOne(
      symbol,
      from ? new Date(from) : undefined,
      to ? new Date(to) : undefined,
      interval,
    );
  }

  @Post('alerts')
  createAlert(@Body() createCryptoDto: CreateCryptoDto) {
    return this.cryptoService.create(createCryptoDto);
  }

  @Get('alerts')
  findUserAlerts() {
    return this.cryptoService.findUserAlerts();
  }

  @Delete('alerts/:id')
  remove(@Param('id') id: string) {
    return this.cryptoService.remove(id);
  }
}
