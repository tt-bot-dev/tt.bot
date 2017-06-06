class asyncStuff {
    constructor() {
    }
    /**setTimeout but async */
    timeout(msec) {
        setTimeout(Promise.resolve, msec);
    }
    /**Same like asyncio.sleep in python */
    async timeoutPythonLike(sec) {
        return await timeout(sec * 1000)
    }
    async sleep(sec) { this.timeoutPythonLike(sec) }
    
}