import { generateDummy, generateBatch } from "../src/utils/dataGenerator.js";

describe("Data Generator", () => {
    test("generateDummy returns correct schema", () => {
        const data = generateDummy();
        expect(data).toHaveProperty("username");
        expect(data).toHaveProperty("name");
        expect(data).toHaveProperty("address");
        expect(data).toHaveProperty("email");
        expect(data).toHaveProperty("phone");
        expect(data).toHaveProperty("createdAt");
    });

    test("generateBatch returns correct size", () => {
        const batch = generateBatch(10);
        expect(batch).toHaveLength(10);
        expect(batch[0]).toHaveProperty("username");
    });
});
