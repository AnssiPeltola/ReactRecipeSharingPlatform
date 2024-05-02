import { Request, Response } from 'express';
import { TestService } from '../services/TestService';

// Your Controller is now responsible for handling the route and interacting with the service layer.
export class TestController {
    private testService = new TestService();

    public getTestMessage = async (req: Request, res: Response) => {
        try {
            const message = await this.testService.getTestMessage();
            res.json(message);
        } catch (err) {
            console.error((err as Error).message);
            res.status(500).send('Server error');
        }
    };
}
