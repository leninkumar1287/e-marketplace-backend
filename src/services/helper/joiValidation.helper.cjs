const Joi = require('joi')
Joi.objecId = require('joi-objectId')(Joi)

exports.signup = (req) => {
    let schema = Joi.object({
        userName: Joi.string().alphanum().min(3).max(30).required()
        .messages({
            'string.alphanum': 'Username must only contain alphanumeric characters',
            'string.min': 'Username must be at least {#limit} characters long',
            'string.max': 'Username must be at most {#limit} characters long',
            'any.required': 'Username is required',
          }),
        userEmail: Joi.string().email(({ minDomainSegments: 2, tlds: { allow: ['com', 'io'] } })).lowercase().required()
        .messages({
            'string.email': 'Email must be a valid email address',
            'string.minDomainSegments': 'Email must contain at least two domain segments',
            'string.lowercase': 'Email must be in lowercase',
            'any.required': 'Email is required',
          }),
        password: Joi.string().alphanum().min(8).max(15).required()
        .messages({
            'string.alphanum': 'Password must only contain alphanumeric characters',
            'string.min': 'Password must be at least {#limit} characters long',
            'string.max': 'Password must be at most {#limit} characters long',
            'any.required': 'Password is required',
          }),
        confirmPassword: Joi.any().valid(Joi.ref('password')).required()
        .messages({
            'any.only': 'Passwords do not match',
            'any.required': 'Confirm password is required',
          }),
        contactNumber: Joi.string().pattern(/^[0-9]{10}$/)
        .required()
        .messages({
          'string.pattern.base': 'Contact number must contain exactly 10 digits if only numbers are provided',
        }),

    })
    return schema.validate(req, { abortEarly: false });
}