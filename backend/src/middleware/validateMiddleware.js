const ApiError = require('../utils/ApiError');

const validate = (validatorFn) => {
  return (req, res, next) => {
    const { error } = validatorFn(req.body);
    if (error) {
      return next(new ApiError(400, error));
    }
    next();
  };
};

module.exports = validate;
