import { HttpNotFoundError } from "@server/infra/errors";
import { todoRepository } from "@server/repository/todo";
import { NextApiRequest, NextApiResponse } from "next";
import { z as schema } from "zod";

async function get(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query;
  const page = Number(query.page);
  const limit = Number(query.limit);

  if (query.page && isNaN(page)) {
    res.status(400).json({
      error: {
        message: "`page` must be a number",
      },
    });
    return;
  }
  if (query.limit && isNaN(limit)) {
    res.status(400).json({
      error: {
        message: "`limit` must be a number",
      },
    });
    return;
  }

  const output = await todoRepository.get({
    page,
    limit,
  });

  res.status(200).json({
    total: output.total,
    pages: output.pages,
    todos: output.todos,
  });
}

const TodoCreateBodySchema = schema.object({
  // Fluent Validations
  content: schema.string(),
});
export async function create(req: NextApiRequest, res: NextApiResponse) {
  // Fail fast validations
  const body = TodoCreateBodySchema.safeParse(req.body);
  // Type Narrowing
  if (!body.success) {
    res.status(400).json({
      error: {
        message: "You need to provide a content to create a TODO",
        description: body.error.issues,
      },
    });
    return;
  }

  try {
    const createdTodo = await todoRepository.createByContent(body.data.content);
    res.status(201).json({
      todo: createdTodo,
    });
  } catch {
    res.status(400).json({
      error: {
        message: "Failed to create TODO",
      },
    });
  }
}

async function toggleDone(req: NextApiRequest, res: NextApiResponse) {
  const todoId = req.query.id;
  if (!todoId || typeof todoId !== "string") {
    res.status(400).json({
      error: {
        message: "You need to provide a string id to toggle the done status",
      },
    });
    return;
  }

  try {
    const updatedTodo = await todoRepository.toggleDone(todoId);
    res.status(200).json({
      todo: updatedTodo,
    });
  } catch (err) {
    if (err instanceof Error) {
      res.status(404).json({
        error: {
          message: "Todo not found",
        },
      });
    }
  }
}

async function deleteById(req: NextApiRequest, res: NextApiResponse) {
  const QuerySchema = schema.object({
    id: schema.string().uuid().min(1),
  });
  const parsedQuery = QuerySchema.safeParse(req.query);
  if (!parsedQuery.success) {
    res.status(400).json({
      error: {
        message: "Please provide a valid id",
      },
    });
    return;
  }
  try {
    const todoId = parsedQuery.data.id;
    await todoRepository.deleteById(todoId);
    res.status(204).end();
  } catch (err) {
    if (err instanceof HttpNotFoundError) {
      return res.status(err.status).json({
        error: {
          message: err.message,
        },
      });
    }
    res.status(500).json({
      error: {
        message: "Internal Server error",
      },
    });
  }
}

export const todoController = {
  get,
  create,
  toggleDone,
  deleteById,
};
