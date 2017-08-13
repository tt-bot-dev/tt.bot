module.exports = {
    exec: async function (msg, args) {
        if (!args) return msg.channel.createMessage("I can't send any feedback without your input.");
        else {
            if (args.length > 1000 && !args.startsWith("respond ")) return msg.channel.createMessage("This command is actually limited to 1000 characters in the input. If you want to submit a longer report, join our support server in the info command.");
            if (isO(msg) && args.startsWith("respond ")) {
                let newArgs = args.slice("respond ".length);
                let caseID = newArgs.split(" ")[0];
                let respondString = newArgs.split(" ").slice(1).join(" ");
                if (respondString.length > 1000) return msg.channel.createMessage("This command is actually limited to 1000 characters in the input.");
                let obj = await db.table("feedback").get(caseID).run();
                if (obj) {
                    bot.deleteMessage("295832390151045130", obj.respMsg.id);
                    bot.createMessage("295832390151045130", {
                        embed: {
                            author: {
                                name: `Response for case ID ${caseID}`
                            },
                            description: respondString,
                            footer: {
                                text: `Response from ${msg.author.username}#${msg.author.discriminator}`
                            },
                            color: 0x008800
                        }
                    });
                    let g = bot.guilds.get(obj.guild.id);
                    if (g) {
                        if (!g.channels.get(obj.channel.id)) {
                            obj.channel.id = g.defaultChannel.id || "310075730950356992";
                        }

                        if (!g.members.get(obj.submitter.id)) {
                            obj.channel = (await bot.getDMChannel(obj.guild.ownerID));
                            obj.channel.createMessage(`Somebody with username ${obj.submitter.username}#${obj.submitter.discriminator} has submitted feedback (ID ${caseID}), but I can't get them at your server.\nPlease, forward the message to them (from ${msg.author.username}#${msg.author.discriminator}): ${respondString}\nIf you need more information, join our support server(info command)`);
                        } else {
                            bot.createMessage(obj.channel.id, `<@!${obj.submitter.id}>, here's response to your feedback (ID ${caseID}) from ${msg.author.username}#${msg.author.discriminator}\n${respondString}`);
                        }
                    } else {
                        msg.channel.createMessage("Seems like people at the guild removed me from there. Deleted the DB item.");
                    }
                    await db.table("feedback").get(caseID).delete().run();
                }
            } else {
                let insertObject = await db.table("feedback").insert({
                    feedbackString: args,
                    submitter: {
                        username: msg.author.username,
                        discriminator: msg.author.discriminator,
                        id: msg.author.id
                    },
                    guild: {
                        id: msg.guild.id,
                        ownerID: msg.guild.ownerID,
                    },
                    channel: {
                        id: msg.channel.id
                    }
                }).run();
                let sentMessage = await bot.createMessage("295832390151045130", {
                    embed: {
                        author: {
                            name: `Feedback from ${msg.author.username}#${msg.author.discriminator} (${msg.author.id}) | Case ${insertObject.generated_keys[0]}`,
                            icon_url: msg.author.avatarURL
                        },
                        description: args,
                        footer: {
                            text: `From ${msg.guild.name} (${msg.guild.id}) (Owner ID ${msg.guild.ownerID})`
                        },
                        color: 0x008800
                    }
                });
                let obj = await db.table("feedback").get(insertObject.generated_keys[0]).run();
                obj.respMsg = {
                    id: sentMessage.id
                };
                await db.table("feedback").get(insertObject.generated_keys[0]).update(obj).run();
                msg.channel.createMessage(`${msg.author.mention}, Sent your feedback into our support server.\nYour case ID is ${insertObject.generated_keys[0]}. Please note that and wait for the response.`);
            }

        }
    },
    isCmd: true,
    display: true,
    category: 1,
    description: "You wanna send any feedback? Use this command. You can as always come to our support server(in info command) and tell it there.\nBy using this command, you allow us to send the feedback to our support server, with these data:\nServer name, server ID, server owner ID, author(your) username, discriminator(That 4-digit number after your username) (These will be PMed to the server owner if I can't get you), ID, channel ID(to actually respond).\nThese data will be deleted right after the response.",
};