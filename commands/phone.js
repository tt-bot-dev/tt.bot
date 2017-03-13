module.exports = {
    exec: function (msg, args,user) {
      if(speakerPhoneBinds.binds[msg.channel.id]) {
          speakerPhoneBinds.binds[msg.channel.id].emit("EndSpeakerphone", msg.channel);
let channelOSide = speakerPhoneBinds.binds[msg.channel.id]._chan1 == msg.channel ? speakerPhoneBinds.binds[msg.channel.id]._chan2 : speakerPhoneBinds.binds[msg.channel.id]._chan1
          delete speakerPhoneBinds.binds[channelOSide.id]
          delete speakerPhoneBinds.binds[msg.channel.id]
      }
      else {
          speakerPhoneBinds.queuer.add(msg.channel)
      }
    },
    name: "phone",
    isCmd: true,
    category: 1,
    display: true,
    description: "Talk with people across Discord.",
}