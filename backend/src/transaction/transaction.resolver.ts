import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionInput, TransactionFiltersArgs, TransactionConnection } from './dto/transaction.dto';

@Resolver(() => Transaction)
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Query(() => TransactionConnection, { name: 'transactions' })
  async getTransactions(
    @Args() filters: TransactionFiltersArgs,
  ): Promise<TransactionConnection> {
    return this.transactionService.getTransactions(filters);
  }

  @Mutation(() => Transaction)
  async createTransaction(
    @Args('input') input: CreateTransactionInput,
  ): Promise<Transaction> {
    return this.transactionService.createTransaction(input);
  }
} 
