module.exports = {
    exec: function (msg) {
        const {binds, queuer} = speakerPhoneBinds;
        const bind = binds[msg.channel.id];
        if(bind) {
            bind.emit("EndSpeakerphone", msg.channel);
            let channelOSide = bind._chan1.id == msg.channel.id ? bind._chan2 : bind._chan1;
            delete speakerPhoneBinds.binds[channelOSide.id];
            delete speakerPhoneBinds.binds[msg.channel.id];
        }
        else {
            queuer.add(msg.channel);
        }
    },
    name: "phone",
    isCmd: true,
    category: 1,
    display: true,
    description: "Talk with people across Discord.",
};