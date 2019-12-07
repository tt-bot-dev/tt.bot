"use strict";
const {SimpleArgumentParser} = require("sosamba");
const Command = require("../lib/commandTypes/ModCommand");
const { version: sosambaVersion } = require("sosamba/package.json");

class HackbanCommand extends Command {
    constructor(sosamba, ...args) {
        super(sosamba, ...args, {
            name: "hackban",
            args: "<users:String...>",
            argParser: new SimpleArgumentParser(sosamba, {
                separator: " ",
                filterEmptyArguments: true
            }),
            description: "Bans an user by ID."
        });
    }

    async permissionCheck(ctx) {
        return ctx.member.permission.has("banMembers") || await super.permissionCheck(ctx);
    }

    async run(ctx, users) {
        if (users.length === 0) {
            await ctx.send({
                embed: {
                    title: ":x: Argument required",
                    description: "The argument `users` is required.",
                    color: 0xFF0000,
                    footer: {
                        text: `Sosamba v${sosambaVersion}`
                    }
                }
            });
        } else {
            const send = users.length === 1;
            if (send) {
                await this.doBan(ctx, users[0], true, false);
            } else {
                const bans = await Promise.all(users.map(
                    u => this.doBan(ctx, u, false, true)
                ));
                await ctx.send(await ctx.t("HACKBANNED_USERS", bans.filter(b => b).length));
            }
        }
    }

    async doBan(ctx, id, send, mass) {
        let userToBan = bot.users.get(id);
        if (!userToBan) try {
            userToBan = await bot.getUserWithoutRESTMode(id);
        } catch {
            if (send) await ctx.send({
                embed: {
                    color: 0xFFFF00,
                    title: await ctx.t("USER_NOT_FOUND"),
                    description: await ctx.t("USER_NOT_FOUND_DESCRIPTION")
                }
            });
            return false;
        }
        const member = ctx.guild.members.get(userToBan.id);
        try {
            if (member && !ctx.sosamba.passesRoleHierarchy(ctx.member, member)) {
                await ctx.send(await ctx.t("ROLE_HIERARCHY_ERROR"));
                return false;
            }
            await ctx.guild.banMember(userToBan.id, 0, 
                `${mass === false ? "Hackbanned" : "Masshackbanned"} by ${ctx.sosamba.getTag(ctx.author)}`);
            if (send) await ctx.send(await ctx.t("BAN_DONE", userToBan));
            return true;   
        } catch (e) {
            console.error(e);
            if (send) await ctx.send(await ctx.t("MISSING_PERMISSIONS"));
            return false;
        }
    }
}

module.exports = HackbanCommand;