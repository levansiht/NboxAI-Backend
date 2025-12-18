import { Global, Module } from '@nestjs/common';
import { HashingService } from './services/hashing.service';

const sharedServices = [HashingService];
@Global()
@Module({
  providers: sharedServices,
  exports: sharedServices,
})
export class SharedModule {}
