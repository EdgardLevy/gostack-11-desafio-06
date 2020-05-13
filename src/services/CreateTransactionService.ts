import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);

    if (type === 'outcome') {
      const { total } = await transactionRepository.getBalance();
      if (total < value)
        throw new AppError(
          'The transaction amount is greater than the balance',
        );
    }

    const categoryRepository = getRepository(Category);

    let category_id = '';

    const categoryExists = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!categoryExists) {
      const newCategory = categoryRepository.create({ title: category });

      await categoryRepository.save(newCategory);

      category_id = newCategory.id;
    } else {
      category_id = categoryExists.id;
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
