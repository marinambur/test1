import { Injectable, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionInput, TransactionFiltersArgs, TransactionConnection } from './dto/transaction.dto';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async createTransaction(input: CreateTransactionInput): Promise<Transaction> {
    // Check for idempotency
    if (input.idempotencyKey) {
      const existingTransaction = await this.transactionRepository.findOne({
        where: { idempotencyKey: input.idempotencyKey },
      });

      if (existingTransaction) {
        this.logger.log(`Duplicate request detected with key: ${input.idempotencyKey}`);
        throw new ConflictException('Transaction with this idempotency key already exists');
      }
    }

    // Convert string date to Date object
    const transactionData = {
      ...input,
      date: new Date(input.date),
    };

    const transaction = this.transactionRepository.create(transactionData);
    const savedTransaction = await this.transactionRepository.save(transaction);

    this.logger.log(`Transaction created: ${savedTransaction.id}`);
    
    // Mock notification logic
    this.mockNotificationService(savedTransaction);

    return savedTransaction;
  }

  async getTransactions(filters: TransactionFiltersArgs): Promise<TransactionConnection> {
    const { startDate, endDate, type, minAmount, page, limit } = filters;
    
    const queryBuilder = this.transactionRepository
      .createQueryBuilder('transaction')
      .orderBy('transaction.date', 'DESC')
      .addOrderBy('transaction.createdAt', 'DESC');

    // Apply filters
    if (startDate && endDate) {
      queryBuilder.andWhere('transaction.date BETWEEN :startDate AND :endDate', {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });
    } else if (startDate) {
      queryBuilder.andWhere('transaction.date >= :startDate', { startDate: new Date(startDate) });
    }

    if (type) {
      queryBuilder.andWhere('transaction.type = :type', { type });
    }

    if (minAmount !== undefined) {
      queryBuilder.andWhere('transaction.amount >= :minAmount', { minAmount });
    }

    // Pagination
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [transactions, total] = await queryBuilder.getManyAndCount();

    return {
      transactions,
      total,
      page,
      limit,
      hasNextPage: offset + limit < total,
      hasPreviousPage: page > 1,
    };
  }

  private mockNotificationService(transaction: Transaction): void {
    // Mock SMS/Email notification - placeholder for future implementation
    this.logger.log(`[MOCK] Sending notification for transaction ${transaction.id}`);
    this.logger.log(`[MOCK] SMS: Transaction of ${transaction.amount} ${transaction.currency} processed`);
    this.logger.log(`[MOCK] Email: Transaction details sent to user`);
  }
} 
