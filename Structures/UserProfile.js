module.exports = class UserProfile {
    constructor(data) {
        this.id = data.id;
        this.color = decryptData(data.color);
        this.profileFields = (data.profileFields && data.profileFields.length > 0) ? data.profileFields.map(profileField => {
            return {
                inline: true,
                name: decryptData(profileField.name),
                value: decryptData(profileField.value)
            };
        }) : [];
        this.timezone = data.timezone ? decryptData(data.timezone) : null;
        this.locale = data.locale ? decryptData(data.locale) : null;
    }
    toEncryptedObject() {
        return UserProfile.create(this);
    }
    static create(data) {
        return {
            id: data.id, 
            color: encryptData(data.color),
            profileFields: data.profileFields.map(profileField => {
                return {
                    inline: true,
                    name: encryptData(profileField.name),
                    value: encryptData(profileField.value)
                };
            }) || [],
            timezone: encryptData(data.timezone),
            locale: encryptData(data.locale)
        };
    }
};