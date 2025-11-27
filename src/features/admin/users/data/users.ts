import { faker } from '@faker-js/faker'

// Set a fixed seed for consistent data generation
faker.seed(67890)

export const users = Array.from({ length: 500 }, () => {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  return {
    id: faker.string.uuid(),
    firstName,
    lastName,
    email: faker.internet.email({ firstName }).toLocaleLowerCase(),
    role: faker.helpers.arrayElement(['admin', 'editor', 'viewer']),
    lastLogin: faker.date.past(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }
})
