class Cache {
    constructor(ttl = 60000) {
        this.ttl = ttl; // Default time-to-live for cache entries
        this.cache = {}; // Internal cache object
    }

    async cacheFunction(cb, args) {
        const jsonArgs = JSON.stringify(args);
        const key = cb.name + jsonArgs;

        // Check cache
        if (this.cache[key] !== undefined) {
            const timeLapse = Date.now() - this.cache[key].date;
            if (timeLapse < this.ttl) {
                console.log('cache hit');
                return this.cache[key].data; // Return cached data
            } else {
                console.log('cache expired');
            }
        }

        // Call the callback and store the result in cache
        try {
            const data = await cb(args); // Await async callback
            this.cache[key] = { date: Date.now(), data }; // Update cache
            return data;
        } catch (err) {
            console.error('Error in callback:', err);
            throw err; // Re-throw error if callback fails
        }
    }
}

export default Cache;
