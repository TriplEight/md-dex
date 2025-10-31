import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { Token } from './entities/token.entity';
import { BlockchainModule } from '../../providers/blockchain/blockchain.module';

/**
 * Token Module
 * 提供代币信息管理功能
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Token]),
    BlockchainModule,
  ],
  controllers: [TokenController],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}

