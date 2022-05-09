import { recommendationService } from '../../src/services/recommendationsService.js';
import { recommendationRepository } from '../../src/repositories/recommendationRepository.js';
import { jest } from '@jest/globals';
import { recommendationMockedFactory } from '../factories/recommendedFactory.js';


const notFoundError = {
  message: '',
  type: 'not_found'
};

const conflictError = {
  message: 'Recommendations names must be unique',
  type: 'conflict'
};

describe('unit - test /RecommendationService/Insert', () => {
  beforeEach(resetTests);
  it('should throw error if duplicate recommendation is found', async () => {
    const recommendation = recommendationMockedFactory();

    jest.spyOn(recommendationRepository, 'findByName').mockResolvedValue({ ...recommendation });
    jest.spyOn(recommendationRepository, 'create').mockResolvedValue();

    expect(async () => {
      await recommendationService.insert(recommendation);
    }).rejects.toEqual(conflictError); ;
  });
});

describe('unit - test /RecommendationService/upvote', () => {
  beforeEach(resetTests);
  it('should throw error if no recommendation is found', async () => {
    jest.spyOn(recommendationRepository, 'find').mockReturnValue(null);

    expect(async () => {
      await recommendationService.upvote(1);
    }).rejects.toEqual(notFoundError); ;
  });
});

describe('unit - test /RecommendationService/downvote', () => {
  beforeEach(resetTests);
  it('should delete recommendation if a downvote bring to lower then -5', async () => {
    const recommendation = recommendationMockedFactory();

    jest.spyOn(recommendationRepository, 'find').mockResolvedValue(recommendation);
    jest.spyOn(recommendationRepository, 'updateScore').mockResolvedValue({ ...recommendation, score: -6 });

    const remove = jest
      .spyOn(recommendationRepository, 'remove')
      .mockResolvedValue(null);

    await recommendationService.downvote(1);

    expect(remove).toHaveBeenCalledTimes(1);
  });

  it('should throw error if no recommendation is found', async () => {
    jest.spyOn(recommendationRepository, 'find').mockReturnValue(null);

    expect(async () => {
      await recommendationService.downvote(1);
    }).rejects.toEqual(notFoundError); ;
  });
});

describe('unit - test /RecommendationService/getByScore', () => {
  beforeEach(resetTests);
  it('should return recommendations', async () => {
    const recommendation = recommendationMockedFactory();
    jest.spyOn(recommendationRepository, 'findAll').mockResolvedValue([recommendation]);

    const result = await recommendationService.getByScore('gt');

    expect(result).toEqual([recommendation]);
  });

  it('should throw error if no recommendation is found', async () => {
    jest.spyOn(recommendationRepository, 'findAll').mockResolvedValue([]);

    expect(async () => {
      await recommendationService.getRandom();
    }).rejects.toEqual(notFoundError);
  });
});

describe('unit - test /RecommendationService/getScoreFilter', () => {
  beforeEach(resetTests);
  it('should return lte if value is higher than 0.7', async () => {
    const result = recommendationService.getScoreFilter(0.71);

    expect(result).toBe('lte');
  });

  it('should return gt if value is lower than 0.7', async () => {
    const result = recommendationService.getScoreFilter(0.69);

    expect(result).toBe('gt');
  });
});

describe('unit - test /RecommendationService/Random', () => {
  beforeEach(resetTests);
  it('should throw error if no recommendation is found', async () => {
    jest.spyOn(recommendationService, 'getScoreFilter').mockReturnValue('gt');
    jest.spyOn(recommendationService, 'getByScore').mockResolvedValue([]);
    jest.spyOn(recommendationRepository, 'findAll').mockResolvedValue([]);

    expect(async () => {
      await recommendationService.getRandom();
    }).rejects.toEqual(notFoundError);
  });
});

function resetTests() {
  jest.clearAllMocks();
  jest.resetAllMocks();
}