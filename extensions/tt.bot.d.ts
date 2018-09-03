declare module "tt.bot" {
    import { 
        Attachment, 
        Embed, 
        MessageContent, 
        MessageFile, 
        GamePresence,
        Permission,
        PermissionOverwrite,
        VoiceState,
        MemberOptions
    } from "eris";

    type UserResolvable = User|Member|Message|string;
    type RoleResolvable = Role|string;

    export interface Constants {
        ChannelTypes: {
            text: 0,
            dm: 1,
            voice: 2,
            category: 4
        }
        AuditLogActions: {}
    }

    class Bot {
        user: User;
        get guilds(): number;
        get users(): number;
    }

    class Message {
        attachments: Attachment[];
        author: User;
        get channel(): TextChannel;
        channelMentions: Channel[];
        cleanContent: string;
        content: string;
        editedTimestamp: number;
        embeds: Embed[];
        guild: Guild;
        id: string;
        member: Member;
        mentionEveryone: boolean;
        mentions: User[];
        mentionsMembers: Member[];
        pinned: boolean;
        reactions: {
            count: number;
            me: boolean;
        }
        roleMentions: Role[];
        timestamp: number;
        tts: boolean;
        type: number;

        delete(): Promise<boolean>;
        pin(): Promise<boolean>;
        unpin(): Promise<boolean>;
        getReaction(reaction: string, limit: number, before: string, after:string): Promise<User[] | boolean>;
        addReaction(reaction: string): Promise<boolean>;
        removeReaction(reaction: string, user: UserResolvable): Promise<boolean>;
        removeReactions(): Promise<boolean>;
        edit(content: MessageContent): Promise<Message|boolean>;
        reply(content: MessageContent, file: MessageFile): Promise<Message|boolean>;
    }

    interface UserData {
        avatar: string;
        avatarURL:string;
        bot: boolean;
        createdAt: number;
        defaultAvatar: string;
        defaultAvatarURL: string;
        discriminator: string
        id: string;
        mention: string;
        staticAvatarURL: string;
        username: string;
        toString(): string;
        createMessage(content: MessageContent, file: MessageFile): Promise<Message|boolean>;
    }

    class Member implements UserData {
        game: GamePresence;
        get guild(): Guild;
        joinedAt: number;
        nick: string;
        permission: Permission;
        roles: Role[];
        staticAvatarURL: string;
        status: string;
        get user(): User;
        voiceState: VoiceState
        addRole(role: RoleResolvable, reason: string): Promise<boolean>;
        ban(deleteMessageDays: number, reason: string): Promise<boolean>;
        edit(options: MemberOptions, reason: string): Promise<boolean>;
        kick(reason: string): Promise<boolean>;
    }

    class Guild {

    }

    class User implements UserData {
        dynamicAvatarURL(format: string, size: number): string;
    }

    class Channel { }

    class TextChannel {

    }

    class Role {

    }
}