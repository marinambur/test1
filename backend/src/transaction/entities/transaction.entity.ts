import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';
import { ObjectType, Field, ID, Float, registerEnumType } from '@nestjs/graphql';

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  TRANSFER = 'TRANSFER',
}

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  RUB = 'RUB',
}

registerEnumType(TransactionType, {
  name: 'TransactionType',
  description: 'The supported transaction types',
});

registerEnumType(Currency, {
  name: 'Currency',
  description: 'The supported currencies',
});

@ObjectType()
@Entity('transactions')
@Index(['date', 'type'])
@Index(['amount'])
@Index(['createdAt'])
export class Transaction {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => TransactionType)
  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @Field(() => Float)
  @Column('decimal', { precision: 12, scale: 2 })
  amount: number;

  @Field(() => Currency)
  @Column({
    type: 'enum',
    enum: Currency,
    default: Currency.USD,
  })
  currency: Currency;

  @Field(() => String)
  @Column('text')
  description: string;

  @Field(() => String)
  @Column('timestamp')
  date: Date;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String, { nullable: true })
  @Column('uuid', { nullable: true })
  idempotencyKey?: string;
} 
