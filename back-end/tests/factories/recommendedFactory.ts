import { prisma } from "../../src/database.js";
import { faker } from '@faker-js/faker';


export function recommendationFactory()  {
  return {
    name: "Metal Gear Rising: Revengeance - The Only Thing I Know For Real (Samuel Boss Battle) Extended",
    youtubeLink: "https://www.youtube.com/watch?v=FhHeGZoWl0g"
  }
}

export async function persistedRecommendation() {
  const recommendation = recommendationFactory()

  const persistedRecommendation = await prisma.recommendation.create({
    data: recommendation,
  });

  return persistedRecommendation;
}

export async function createManyRecommendationsFactory(number : number) {
  const data = [];
  for (let i = 0; i < number; i++) {
    data.push({
      name: faker.name.findName(),
      youtubeLink: faker.internet.url()
    });
  }

  await prisma.recommendation.createMany({
    data,
    skipDuplicates: true
  }
  );
}

export function recommendationMockedFactory() {
  return {
    id: 1,
    name: faker.name.findName(),
    youtubeLink: faker.internet.url(),
    score: -5
  }
}