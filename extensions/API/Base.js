class Base {
    /**
     * 
     * @param {Extension} extension The extension data
     * @param {object} data The data
     */
    constructor(extension, data) {
        this.extension = extension;
        // Invites
        if (data) {
            this.id = data.id;
            this.createdAt = data.createdAt;
        }
    }
}