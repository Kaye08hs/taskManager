const HttpError = require('./HttpError')

function validateRequest (req_body, required_fields = []) {
    if(!req_body){
        throw new HttpError('Request payload required', 400)
    }

    const missing_fields = required_fields.filter(field => !req_body[field])

    if(missing_fields.length > 0) {
        throw new HttpError(
            `Required field/s missing : ${missing_fields.join(', ')}`,
            400
        )
    }
}

module.exports = validateRequest;