import type { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

type Schemas = {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
};

/**
 * Validates and coerces request parts against Zod schemas.
 * Parsed values replace the originals so downstream handlers get typed data.
 */
export function validate(schemas: Schemas) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body);
      if (schemas.query) Object.assign(req.query, schemas.query.parse(req.query));
      if (schemas.params) Object.assign(req.params, schemas.params.parse(req.params));
      next();
    } catch (err) {
      next(err);
    }
  };
}
