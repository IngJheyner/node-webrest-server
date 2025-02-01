import { Request, Response } from "express";

const todos = [
    { id: 1, text: 'Comprar leche', completedAt: new Date() },
    { id: 2, text: 'Comprar pan', completedAt: null },
    { id: 3, text: 'Comprar huevos', completedAt: new Date() },
];

export class TodoController {

    constructor() {}

    public getTodos = (req:Request, res:Response) => {
        return res.json(todos);
    }

    public getTodoById = (req:Request, res:Response) => {

        const id = +req.params.id; // Obtener el ID de los parĂ¡metros de la URL

        if( isNaN(id) ) return res.status(400).json({ message: 'ID must be a number' });

        const todo = todos.find(t => t.id === id);

        (todo) ? res.json(todo) : res.status(404).json({ message: 'Todo not found' });
    }

    public createTodo = (req:Request, res:Response) => {

        const { text } = req.body; // Obtener el cuerpo de la solicitud

        if ( !text ) return res.status(400).json({ message: 'Text is required' });

        const newTodo = todos.push({
            id: todos.length + 1,
            text,
            completedAt: null
        });

        return res.json( newTodo );
    }

    public updateTodo = (req:Request, res:Response) => {

        const id = +req.params.id; // Obtener el ID de los parĂ¡metros de la URL
        if( isNaN(id) ) return res.status(400).json({ message: 'ID must be a number' });

        const todo = todos.find(t => t.id === id);
        if( !todo ) return res.status(404).json({ message: 'Todo not found' });

        const { text, completedAt } = req.body; // Obtener el cuerpo de la solicitud

        todo.text = text || todo.text; // Actualizar el texto del todo
        (completedAt) ? todo.completedAt = new Date(completedAt || todo.completedAt ): todo.completedAt = null;

        return res.json(todo);
    }

    public deleteTodo = (req:Request, res:Response) => {

        const id = +req.params.id; // Obtener el ID de los parĂ¡metros de la URL
        if( isNaN(id) ) return res.status(400).json({ message: 'ID must be a number' }); // Validar que el ID sea un numero

        const todo = todos.find(t => t.id === id); // Buscar el todo por ID
        if( !todo ) return res.status(404).json({ message: 'Todo not found' }); // Validar que el todo exista

        todos.splice(todos.indexOf(todo), 1); // Eliminar el todo del array
        return res.json(todo); // Retornar el todo eliminado
    }
}