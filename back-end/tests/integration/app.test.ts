import supertest from "supertest";
import app from "../../src/app.js";
import { prisma } from "../../src/database";
import { createManyRecommendationsFactory, persistedRecommendation, recommendationFactory } from "../factories/recommendedFactory.js";

describe('Route POST /recommendations tests', () => {
  beforeEach(truncateUsers)
  afterAll(disconnect)

  it('Should return 201 and create a recommendation given valid body', async () => {
    const recommendation = recommendationFactory()

    const response = await supertest(app).post('/recommendations').send(recommendation)

    const persisted = await prisma.recommendation.findUnique({
      where: {
        name: recommendation.name
      }
    })

    expect(response.statusCode).toBe(201)
    expect(persisted.name).toEqual(recommendation.name)
  })
})

describe('Route POST /recommendations/:id/upvote', () => {
  beforeEach(truncateUsers)
  afterAll(disconnect)

  it('should return 200 and increase score by 1', async () => {
    const recommendation = await persistedRecommendation()

    const response = await supertest(app).post(`/recommendations/${recommendation.id}/upvote`).send();

    const finalReccomendation = await prisma.recommendation.findUnique({
      where: {
        id: recommendation.id
      }
    })

    expect(response.status).toBe(200);
    expect(finalReccomendation.score).toBe(1)
  })
})

describe('Route POST /recommendations/:id/downvote', () => {
  beforeEach(truncateUsers)
  afterAll(disconnect)

  it('should return 200 and decrease score by 1', async () => {
    const recommendation = await persistedRecommendation()

    const response = await supertest(app).post(`/recommendations/${recommendation.id}/downvote`).send();

    const finalReccomendation = await prisma.recommendation.findUnique({
      where: {
        id: recommendation.id
      }
    })

    expect(response.status).toBe(200);
    expect(finalReccomendation.score).toBe(-1)
  })
})

describe('Route GET /recommendations', () => {
  beforeEach(truncateUsers)
  afterAll(disconnect)

  it('should return 200 and a list of reccomendations', async () => {
    await createManyRecommendationsFactory(10)
    const response = await supertest(app).get('/recommendations');

    expect(response.status).toBe(200);
    expect(response.body.length).toBeLessThanOrEqual(10);
  })
})

describe('Route GET /recommendations/:id', () => {
  beforeEach(truncateUsers)
  afterAll(disconnect)

  it('should return 200 and the recommendation of given id', async () => {
    const recommendation = await persistedRecommendation()

    const response = await supertest(app).get(`/recommendations/${recommendation.id}`)

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(recommendation.id);
  })
})

describe('Route GET /recommendations/random', () => {
  beforeEach(truncateUsers)
  afterAll(disconnect)

  it('should return 200 and a random recommendation', async () => {
    await createManyRecommendationsFactory(10)

    const response = await supertest(app).get('/recommendations/random')

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('id');
  })
})

describe('Route GET /recommendations/top/:amount', () => {
  beforeEach(truncateUsers)
  afterAll(disconnect)

  it('should return 200 and the amount of recommendations asked', async () => {
    await createManyRecommendationsFactory(20)

    const response = await supertest(app).get(`/recommendations/top/${10}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.length).toEqual(10)
  })
})

async function disconnect() {
  await prisma.$disconnect();
}

async function truncateUsers() {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
}