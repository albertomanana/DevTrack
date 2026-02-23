export function getApiErrorMessage(error, fallback = 'Unexpected error') {
    const responseData = error?.response?.data
    if (!responseData) {
        return error?.message || fallback
    }

    if (responseData.validationErrors && typeof responseData.validationErrors === 'object') {
        const messages = Object.values(responseData.validationErrors).filter(Boolean)
        if (messages.length > 0) {
            return messages.join(' | ')
        }
    }

    return responseData.message || fallback
}
