import { Sample } from '../models/Sample';
import { BaseRepository } from './base/BaseRepository';

export class SampleRepository extends BaseRepository<Sample> {
  constructor() {
    super(Sample);
  }
}
