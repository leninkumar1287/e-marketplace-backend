exports.validateObjectId = (objectId) => {
    try {
        const objectIdRegex = /^[0-9a-fA-F]{24}$/;
        const isValid =  objectIdRegex.test(objectId);
        if (isValid) {
            return { error : false, message : `${objectId} is a valid MongoDB ObjectId`}
        } else {
            return { error : true, message : `${objectId} is not a valid MongoDB ObjectId`}
        }
    } catch (error) {
        return { error : true, message : error.message}
    }
}