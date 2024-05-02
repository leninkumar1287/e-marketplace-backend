const Joi = require('joi')
Joi.objecId = require('joi-objectId')(Joi)

const messages = {
    password: {
        'string.alphanum': 'Password must only contain alphanumeric characters',
        'string.min': 'Password must be at least {#limit} characters long',
        'string.max': 'Password must be at most {#limit} characters long',
        'any.required': 'Password is required',
    },
    oldPassword: {
        'string.alphanum': 'Password must only contain alphanumeric characters',
        'any.required': 'Password is required',
    },
    newPassword: {
        'string.alphanum': 'Password must only contain alphanumeric characters',
        'string.min': 'Password must be at least {#limit} characters long',
        'string.max': 'Password must be at most {#limit} characters long',
        'any.required': 'password is required',
        'string.disallow': 'Confirm password should not be same as old password'
    },
    confirmPassword: {
        'any.only': 'Confirm passwords do not match',
        'any.required': 'Confirm password is required',
    },
    emailId: {
        'string.email': 'Email must be a valid email address',
        'string.minDomainSegments': 'Email must contain at least two domain segments',
        'string.lowercase': 'Email must be in lowercase',
        'any.required': 'Email is required',
    },
    userName: {
        'string.alphanum': 'Username must only contain alphanumeric characters',
        'string.min': 'Username must be at least {#limit} characters long',
        'string.max': 'Username must be at most {#limit} characters long',
        'any.required': 'Username is required',
    },
    contactNumber: {
        'string.pattern.base': 'Contact number must contain exactly 10 digits if only numbers are provided',
    },
    otp: {
        'string.pattern.base': 'OTP number must contain exactly 4 digits, Only numbers will accept',
    }
}

exports.signup = (req) => {
    let schema = Joi.object({
        userName: Joi.string().alphanum().min(3).max(30).required().messages(messages.userName),
        userEmail: Joi.string().email(({ minDomainSegments: 2, tlds: { allow: ['com', 'io'] } })).lowercase().required().messages(messages.emailId),
        password: Joi.string().alphanum().min(8).max(15).required().messages(messages.password),
        confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages(messages.confirmPassword),
        contactNumber: Joi.string().pattern(/^[0-9]{10}$/).required().messages(messages.contactNumber),
        role: Joi.string().required()
    })
    return schema.validate(req, { abortEarly: false });
}


exports.signin = (req) => {
    let schema = Joi.object({
        userEmail: Joi.string().email(({ minDomainSegments: 2, tlds: { allow: ['com', 'io'] } })).lowercase().required().messages(messages.emailId),
        password: Joi.string().alphanum().min(8).max(15).required().messages(messages.password),
    })
    return schema.validate(req, { abortEarly: false });
}

exports.changePassword = (req) => {
    let schema = Joi.object({
        // objectId: Joi.string().required(),
        userEmail: Joi.string().email(({ minDomainSegments: 2, tlds: { allow: ['com', 'io'] } })).lowercase().required().messages(messages.emailId),
        oldPassword: Joi.string().alphanum().required().messages(messages.oldPassword),
        newPassword: Joi.string().alphanum().min(8).max(15).required().disallow(Joi.ref('oldPassword')).messages(messages.newPassword),
        confirmPassword: Joi.any().valid(Joi.ref('newPassword')).required().messages(messages.confirmPassword),
    })
    return schema.validate(req, { abortEarly: false });
}

exports.sendOtp = (req) => {
    let schema = Joi.object({
        userEmail: Joi.string().email(({ minDomainSegments: 2, tlds: { allow: ['com', 'io'] } })).lowercase().required().messages(messages.emailId)
    })
    return schema.validate(req, { abortEarly: false });
}

exports.reSendOtp = (req) => {
    let schema = Joi.object({
        userEmail: Joi.string().email(({ minDomainSegments: 2, tlds: { allow: ['com', 'io'] } })).lowercase().required().messages(messages.emailId)
    })
    return schema.validate(req, { abortEarly: false });
}

exports.resetPassword = (req) => {
    let schema = Joi.object({
        userEmail: Joi.string().email(({ minDomainSegments: 2, tlds: { allow: ['com', 'io'] } })).lowercase().required().messages(messages.emailId),
        newPassword: Joi.string().alphanum().min(8).max(15).required().messages(messages.newPassword),
        confirmPassword: Joi.any().valid(Joi.ref('newPassword')).required().messages(messages.confirmPassword),
        otp: Joi.string().pattern(/^[0-9]{4}$/).required().messages(messages.otp),
    })
    return schema.validate(req, { abortEarly: false });
}

exports.deleteUserProfile = (req) => {
    let schema = Joi.object({
        userEmail: Joi.string().email(({ minDomainSegments: 2, tlds: { allow: ['com', 'io'] } })).lowercase().required().messages(messages.emailId),
        password: Joi.string().alphanum().required().messages(messages.oldPassword),
    })
    return schema.validate(req, { abortEarly: false });
}

exports.updateProfile = (req) => {
    let schema = Joi.object({
        userEmail: Joi.string().email(({ minDomainSegments: 2, tlds: { allow: ['com', 'io'] } })).lowercase().required().messages(messages.emailId),
        password: Joi.string().required(), // Add validation for password
        update: Joi.object({
            userName: Joi.string().alphanum().min(3).max(30).messages(messages.userName),
            contactNumber: Joi.string().pattern(/^[0-9]{10}$/).messages(messages.contactNumber),
            userEmail: Joi.string().email(({ minDomainSegments: 2, tlds: { allow: ['com', 'io'] } })).lowercase().messages(messages.emailId),
        }).required(),
        otp: Joi.string().pattern(/^[0-9]{4}$/).required().messages(messages.otp),
    })

    return schema.validate(req, { abortEarly: false });
}

