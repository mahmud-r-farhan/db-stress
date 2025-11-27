import { faker } from "@faker-js/faker";

export function generateDummy() {
  return {
    username: faker.internet.userName(),
    name: faker.person.fullName(),
    address: faker.location.streetAddress(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    createdAt: new Date().toISOString()
  };
}

export function generateBatch(size) {
  return Array.from({ length: size }, generateDummy);
}