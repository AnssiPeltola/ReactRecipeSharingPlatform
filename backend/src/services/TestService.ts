import { TestRepository } from '../repositories/TestRepository';

// The Service contains the business logic and interacts with the repository layer.
export class TestService {
    private testRepository = new TestRepository();

    async getTestMessage() {
        return this.testRepository.getTestMessage();
    }
}
