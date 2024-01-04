import express from "express";
import logger from "src/Shared/Infrastructure/logger";

export function paginationValidatorMiddleware( req: express.Request,
    res: express.Response,
    next: express.NextFunction) {
    {
      logger.info(req.query);

      if (!req.query || Object.keys(req.query).length === 0) {
        // If req.query is undefined or null, set default values for 'page' and 'perPage'.
        req.query = { page: '1', perPage: '50' };
      }
      next(); // Proceed to the next middleware.
    };
}