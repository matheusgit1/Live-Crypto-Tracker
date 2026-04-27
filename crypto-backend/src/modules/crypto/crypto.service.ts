import { Injectable } from '@nestjs/common';
import { CreateCryptoDto } from './dto/create-crypto.dto';
import { UpdateCryptoDto } from './dto/update-crypto.dto';

@Injectable()
export class CryptoService {
  create(createCryptoDto: CreateCryptoDto) {
    return 'This action adds a new crypto';
  }

  findAll() {
    return `This action returns all crypto`;
  }

  findOne(symbol: string) {
    return `This action returns the crypto with symbol ${symbol}`;
  }

  update(id: number, updateCryptoDto: UpdateCryptoDto) {
    return `This action updates a #${id} crypto`;
  }

  remove(id: string) {
    return `This action removes a #${id} crypto`;
  }

  historyOne(
    symbol?: string,
    from?: Date | undefined,
    to?: Date | undefined,
    interval?: string | undefined,
  ) {
    return `This action returns the history of a crypto`;
  }

  findUserAlerts() {
    return `This action returns the user's alerts`;
  }
}
