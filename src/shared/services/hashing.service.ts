import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';

const SALT_ROUNDS = 10;

@Injectable()
export class HashingService {
  async hash(value: string) {
    return hash(value, SALT_ROUNDS);
  }

  async compare(value: string, hashedData: string) {
    return compare(value, hashedData);
  }
}
