import { faker } from '@faker-js/faker'

// Set a fixed seed for consistent data generation
faker.seed(12345)

export const tasks = Array.from({ length: 100 }, () => {
  const statuses = [
    'todo',
    'in progress',
    'done',
    'canceled',
    'backlog',
  ] as const
  const priorities = ['low', 'medium', 'high'] as const

  return {
    id: `TASK-${faker.number.int({ min: 1000, max: 9999 })}`,
    title: faker.lorem.sentence({ min: 5, max: 15 }),
    description: faker.lorem.paragraph({ min: 1, max: 3 }),
    status: faker.helpers.arrayElement(statuses),
    priority: faker.helpers.arrayElement(priorities),
    assignTo: faker.person.fullName(),
    createdAt: faker.date.past(),
  }
})
