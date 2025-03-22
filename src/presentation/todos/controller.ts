import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";

// const todos = [
//     { id: 1, text: 'Comprar leche', completedAt: new Date() },
//     { id: 2, text: 'Comprar pan', completedAt: null },
//     { id: 3, text: 'Comprar huevos', completedAt: new Date() },
// ];

export class TodoController {

    constructor() {}

    public getTodos = async (req:Request, res:Response) => {
        const todos = await prisma.todo.findMany();
        return res.json(todos);
    }

    public getTodoById = async(req:Request, res:Response) => {

        const id = +req.params.id; // Obtener el ID de los parĂ¡metros de la URL

        if( isNaN(id) ) return res.status(400).json({ message: 'ID must be a number' });

        const todo = await prisma.todo.findFirst({
            where: { id }
        });
        //const todo = todos.find(t => t.id === id);

        (todo) ? res.json(todo) : res.status(404).json({ message: 'Todo not found' });
    }

    public createTodo = async (req:Request, res:Response) => {

        //const { text } = req.body; // Obtener el cuerpo de la solicitud
        //DTO domain/dtos
        const [error, createTodoDto] = CreateTodoDto.create( req.body );
        if ( error ) return res.status(400).json({ message: error });
        //if ( !text ) return res.status(400).json({ message: 'Text is required' });

        // Con prisma
        const todo = await prisma.todo.create({
            data: createTodoDto!
        });

        // const newTodo = todos.push({
        //     id: todos.length + 1,
        //     text,
        //     completedAt: null
        // });

        return res.json( todo );
    }

    public updateTodo = async(req:Request, res:Response) => {

        const id = +req.params.id; // Obtener el ID de los parĂ¡metros de la URL
        //if( isNaN(id) ) return res.status(400).json({ message: 'ID must be a number' });
        const [error, updateTodoDto] = UpdateTodoDto.create({
            ...req.body, id
        });

        if( error ) return res.status(400).json({ error });

        // const todo = todos.find(t => t.id === id);
        const todo = await prisma.todo.findFirst({
            where: { id }
        });
        if( !todo ) return res.status(404).json({ message: 'Todo not found' });

        //const { text, completedAt } = req.body; // Obtener el cuerpo de la solicitud

        // todo.text = text || todo.text; // Actualizar el texto del todo
        // (completedAt) ? todo.completedAt = new Date(completedAt || todo.completedAt ): todo.completedAt = null;
        const updatedTodo = await prisma.todo.update({
            where: { id },
            // data: {
            //     text: text || todo.text,
            //     completedAt: completedAt ? new Date(completedAt) : null
            // }
            data: updateTodoDto!.values
        });

        return res.json(updatedTodo);
    }

    public deleteTodo = async (req:Request, res:Response) => {

        const id = +req.params.id; // Obtener el ID de los parĂ¡metros de la URL
        if( isNaN(id) ) return res.status(400).json({ message: 'ID must be a number' }); // Validar que el ID sea un numero

        //const todo = todos.find(t => t.id === id); // Buscar el todo por ID
        const todo = await prisma.todo.findFirst({
            where: { id }
        });
        if( !todo ) return res.status(404).json({ message: 'Todo not found' }); // Validar que el todo existe

        //todos.splice(todos.indexOf(todo), 1); // Eliminar el todo del array

        const deleted = await prisma.todo.delete({
            where: { id }
        }); // Eliminar el todo de la base de datos

        (deleted) ? res.json(deleted) : res.status(400).json({ message: 'Todo not deleted' }); // Responder con el todo eliminado
    }
}