import { Router } from "express";
import { TodoController } from "./todos/controller";
import { TodoRoutes } from "./todos/routes";

export class AppRoutes {

    static get routes(): Router {

        const router = Router();
        //const todoController = new TodoController();

        router.use('/api/todos', TodoRoutes.routes);

        return router;

    }
}