import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  id: string;
}
class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    // melhor forma
    // transactionRepository.delete(id);
    const transaction = await transactionRepository.findOne(id);
    if (!transaction) {
      throw new AppError('Transaction does not exists');
    }
    transactionRepository.delete(id);
  }
}

export default DeleteTransactionService;
