import { InputType, Field, Float, ArgsType, ObjectType, Int } from '@nestjs/graphql';
import { IsEnum, IsNumber, IsString, IsOptional, IsUUID, Min, Max } from 'class-validator';
import { TransactionType, Currency } from '../entities/transaction.entity';

@InputType()
export class CreateTransactionInput {
  @Field(() => TransactionType)
  @IsEnum(TransactionType)
  type: TransactionType;

  @Field(() => Float)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(999999999.99)
  amount: number;

  @Field(() => Currency)
  @IsEnum(Currency)
  currency: Currency;

  @Field(() => String)
  @IsString()
  description: string;

  @Field(() => String)
  date: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUUID()
  idempotencyKey?: string;
}

@ArgsType()
export class TransactionFiltersArgs {
  @Field(() => String, { nullable: true })
  @IsOptional()
  startDate?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  endDate?: string;

  @Field(() => TransactionType, { nullable: true })
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minAmount?: number;

  @Field(() => Int, { defaultValue: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page: number = 1;

  @Field(() => Int, { defaultValue: 20 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit: number = 20;
}

@ObjectType()
export class TransactionConnection {
  @Field(() => [Transaction])
  transactions: Transaction[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Boolean)
  hasNextPage: boolean;

  @Field(() => Boolean)
  hasPreviousPage: boolean;
}

// Import Transaction for the connection type
import { Transaction } from '../entities/transaction.entity'; 
