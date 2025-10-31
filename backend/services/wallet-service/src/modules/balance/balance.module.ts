import { Module } from '@nestjs/common';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { BlockchainModule } from '../../providers/blockchain/blockchain.module';

@Module({
  imports: [BlockchainModule],
  controllers: [BalanceController],
  providers: [BalanceService],
  exports: [BalanceService], // 导出供其他模块使用
})
export class BalanceModule {}

