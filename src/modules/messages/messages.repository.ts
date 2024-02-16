import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesRepository {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
  ) {}
  public async create(message: Partial<Message>): Promise<Message> {
    return this.messagesRepository.create(message);
  }

  public async findAll(): Promise<Message[]> {
    return this.messagesRepository.find();
  }

  public async findOne(id: string): Promise<Message> {
    return this.messagesRepository.findOne({ where: { id } });
  }

  public async find(options?: FindManyOptions<Message>) {
    return this.messagesRepository.find(options);
  }

  public async findAndCount(data: unknown) {
    return this.messagesRepository.findAndCount(data);
  }

  public async count() {
    return this.messagesRepository.count();
  }

  public createQueryBuilder(name: string) {
    return this.messagesRepository.createQueryBuilder(name);
  }

  public async update(id: string, message: Message): Promise<Message> {
    const messageToUpdate = await this.messagesRepository.findOne({
      where: { id },
    });
    await this.messagesRepository.update(id, message);
    return messageToUpdate;
  }

  public async save(message: Message): Promise<Message> {
    return await this.messagesRepository.save(message);
  }

  public async remove(id: string): Promise<boolean> {
    const result = await this.messagesRepository.delete({ id });

    return !!result.affected;
  }
}
