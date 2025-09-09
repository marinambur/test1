import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { TransactionService } from '../transaction/transaction.service';
import { TransactionType, Currency } from '../transaction/entities/transaction.entity';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const transactionService = app.get(TransactionService);

  console.log('🌱 Starting database seeding...');

  const transactionTypes = Object.values(TransactionType);
  const currencies = Object.values(Currency);
  
  const descriptions = [
    'Coffee shop purchase',
    'Salary payment',
    'Grocery shopping',
    'Online subscription',
    'Gas station',
    'Restaurant dinner',
    'Bank transfer',
    'Freelance income',
    'Utility bill',
    'Car maintenance',
    'Book purchase',
    'Investment return',
    'Medical expenses',
    'Travel booking',
    'Gift purchase',
  ];

  // Generate 10,000 transactions for testing performance
  const batchSize = 1000;
  const totalTransactions = 10000;
  
  for (let batch = 0; batch < totalTransactions / batchSize; batch++) {
    const transactions = [];
    
    for (let i = 0; i < batchSize; i++) {
      const randomDate = new Date();
      randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 365));
      
      transactions.push({
        type: transactionTypes[Math.floor(Math.random() * transactionTypes.length)],
        amount: Math.round((Math.random() * 5000 + 1) * 100) / 100,
        currency: currencies[Math.floor(Math.random() * currencies.length)],
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        date: randomDate,
      });
    }

    // Process batch
    for (const transaction of transactions) {
      try {
        await transactionService.createTransaction(transaction);
      } catch (error) {
        console.error(`Error creating transaction:`, error.message);
      }
    }

    console.log(`✅ Processed batch ${batch + 1}/${totalTransactions / batchSize}`);
  }

  console.log(`🎉 Seeding completed! Created ${totalTransactions} transactions.`);
  await app.close();
}

seed().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
}); 
