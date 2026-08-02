import createError from 'http-errors';

export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      next(createError(400, error.message));
      return;
    }
    next();
  };
};