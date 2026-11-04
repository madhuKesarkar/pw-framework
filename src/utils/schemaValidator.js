const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true });
function validateSchema(schema, data) {
  const validate = ajv.compile(schema);
  return { valid: validate(data), errors: ajv.errorsText(validate.errors) };
}
module.exports = { validateSchema };