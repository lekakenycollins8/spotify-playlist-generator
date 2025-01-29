const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const retryOperation = async (operation, retries = 3, delay = 1000) => {
    let lastError;
    
    for (let i = 0; i < retries; i++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;
            
            if (i < retries - 1) {
                await wait(delay * Math.pow(2, i)); // Exponential backoff
            }
        }
    }
    
    throw lastError;
};

module.exports = retryOperation;