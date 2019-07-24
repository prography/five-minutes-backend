import { EntityRepository } from 'typeorm';
import { Honor } from '../models/Honor';
import { BaseRepository } from './base/BaseRepository';

@EntityRepository(Honor)
export class HonorRepository extends BaseRepository<Honor> {}
