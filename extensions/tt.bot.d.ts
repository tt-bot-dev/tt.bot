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
        MemberOptions,
        Collection,
        Emoji,
        EmojiOptions,
        RoleOptions,
        GuildOptions,
        Webhook,
        CreateInviteOptions,

    } from "eris";

    type UserResolvable = User | Member | Message | string;
    type RoleResolvable = Role | string;
    type MessageResolvable = Message | string;
    type GuildChannel = TextChannel | VoiceChannel | CategoryChannel;

    type OverwriteResolvable = UserResolvable | RoleResolvable;

    interface GuildBan {
        reason?: string;
        user: User;
    }

    export interface Constants {
        ChannelTypes: {
            text: 0,
            dm: 1,
            voice: 2,
            category: 4
        }
        AuditLogActions: {}
    }

    interface Invitable {
        createInvite(options: CreateInviteOptions, reason?: string): Promise<Invite | boolean>;
    }

    interface Textable {
        createMessage(content: MessageContent, file: MessageFile): Promise<Message | boolean>;
    }

    interface Mentionable {
        mention: string;
        toString(): string;
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
        getReaction(reaction: string, limit?: number, before?: string, after?: string): Promise<User[] | boolean>;
        addReaction(reaction: string): Promise<boolean>;
        removeReaction(reaction: string, user?: UserResolvable): Promise<boolean>;
        removeReactions(): Promise<boolean>;
        edit(content: MessageContent): Promise<Message | boolean>;
        reply(content: MessageContent, file?: MessageFile): Promise<Message | boolean>;
    }

    interface UserData implements Textable, Mentionable {
        avatar: string;
        avatarURL: string;
        bot: boolean;
        createdAt: number;
        defaultAvatar: string;
        defaultAvatarURL: string;
        discriminator: string
        id: string;
        staticAvatarURL: string;
        username: string;
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
        addRole(role: RoleResolvable, reason?: string): Promise<boolean>;
        ban(deleteMessageDays: number, reason?: string): Promise<boolean>;
        edit(options: MemberOptions, reason?: string): Promise<boolean>;
        kick(reason?: string): Promise<boolean>;
        removeRole(role: RoleResolvable, reason?: string): Promise<boolean>;
        unban(reason?: string): Promise<boolean>
    }

    class Guild {
        afkChannelID: string;
        afkTimeout: number;
        createdAt: number;
        get channels(): Collection<Channel>;
        defaultNotifications: number;
        emoji: Emoji[];
        explicitContentFilter: string;
        features: string[];
        icon: string;
        iconURL: string;
        id: string;
        joinedAt: number;
        large: boolean;
        memberCount: number;
        get members(): Collection<Member>;
        get me(): Member;
        mfaLevel: number;
        name: number;
        ownerID: string;
        get owner(): Member;
        get roles(): Collection<Role>;
        splash: string;
        systemChannelID: string;
        joinMessageChannelID: string;
        unavailable: boolean;
        verificationLevel: number;
        addMemberRole(member: UserResolvable, role: RoleResolvable, reason?: string): Promise<boolean>;
        banMember(user: UserResolvable, deleteMessageDays: number, reason?: string): Promise<boolean>;
        createChannel(name: string, type: number, reason?: string, parent: CategoryChannel): Promise<GuildChannel>;
        createEmoji(options: EmojiOptions, reason?: string): Promise<Emoji | boolean>;
        createRole(options: RoleOptions, reason?: string): Promise<Role | boolean>;
        deleteEmoji(emojiID: string, reason?: string): Promise<boolean>;
        deleteRole(role: RoleResolvable, reason?: string): Promise<boolean>;
        delete(): Promise<boolean>
        dynamicIconURL(format: string, size: number): string;
        edit(options: GuildOptions, reason?: string): Promise<Guild | boolean>;
        editEmoji(emojiID: string, options: EmojiOptions, reason?: string): Promise<Emoji | boolean>;
        editMember(member: UserResolvable, options: MemberOptions, reason?: string): Promise<boolean>;
        editNickname(nickname: string): Promise<boolean>;
        editRole(role: RoleResolvable, options: string, reason?: string): Promise<Role | boolean>;
        getAuditLogs(limit?: number, before?: string, actionType?: number): Promise<{
            users: User[];
            entries: GuildAuditLogEntry[];
        } | boolean>;
        getBan(user: UserResolvable): Promise<GuildBan | boolean>;
        getBans(): Promise<GuildBan[] | boolean>
        getInvites(): Promise<Invite[] | boolean>;
        getWebhooks(): Promise<Webhook[] | boolean>;
        kickMember(user: UserResolvable, reason?: string): Promise<boolean>;
        pruneMembers(days: number, reason?: string): Promise<number | boolean>;
        removeMemberRole(member: UserResolvable, role: RoleResolvable, reason?: string): Promise<boolean>;
        unbanMember(user: UserResolvable, reason?: string): Promise<boolean>;
    }

    class GuildAuditLogEntry {
        id: string;
        guild: Guild;
        actionType: number;
        reason?: string;
        user: User;
        before?: any;
        after?: any;
        targetID: string;
        count?: number;
        channel?: GuildChannel;
        deleteMemberDays?: number;
        member?: Member;
        role?: Role;
        // null for webhooks
        get target(): Guild | GuildChannel | Member | Role | Invite | Emoji | User | null;
    }

    class User implements UserData {
        dynamicAvatarURL(format: string, size: number): string;
    }

    class Channel implements Mentionable {
        createdAt: number;
        get guild(): Guild
        id: string;
        mention: string;
        name: string;
        nsfw: boolean;
        get parent(): CategoryChannel;
        permissionOverwrites: PermissionOverwrite[];
        position: number;
        type: number;
        delete(): Promise<boolean>;
        deletePermission(overwrite: OverwriteResolvable, reason?: string): Promise<boolean>;
        edit(options: {
            name?: string,
            topic?: string,
            bitrate?: number,
            userLimit?: number,
            nsfw?: boolean,
        }, reason?: string): Promise<GuildChannel | boolean>;
        editPermission(overwrite: OverwriteResolvable, allow: number, deny: number, type: number, reason?: string): Promise<PermissionOverwrite | boolean>;
        editPosition(position: number): Promise<boolean>;
        permissionsOf(member: UserResolvable): Promise<Permission>;
        toString(): string;
    }


    class TextChannel extends Channel implements Invitable, Textable, Mentionable {
        get lastMessage(): Message;
        lastPinTimestamp: number;
        get messages(): Collection<Message>;
        topic: string;
        addMessageReaction(message: MessageResolvable, reason?: string): Promise<boolean>;
        createWebhook(options: { name: string, avatar: string }, reason?: string): Promise<Webhook | boolean>;
        deleteMessage(message: MessageResolvable, reason?: string): Promise<boolean>;
        deleteMessages(messages: MessageResolvable[]): Promise<boolean>;
        editMessage(message: MessageResolvable, content: MessageContent): Promise<Message | boolean>;
        getInvites(): Promise<Invite[] | boolean>;
        getMessage(id): Message;
        getMessageReaction(id: MessageResolvable, reaction: string, limit?: number, before?: string, after?: string): Promise<User[] | boolean>;
        getMessages(limit?: number, before?: string, after?: string, around?: number): Promise<Message[] | boolean>;
        getPins(): Promise<Message[] | boolean>;
        getWebhooks(): Promise<Webhook[] | boolean>;
        purge(limit, filter?: (message: Message) => boolean, before?: string, after?: string): Promise<number | boolean>;
        pinMessage(message: MessageResolvable): Promise<boolean>;
        removeMessageReaction(message: MessageResolvable, reaction: string, user?: UserResolvable): Promise<boolean>;
        removeMessageReactions(message: MessageResolvable): Promise<boolean>;
        sendTyping(): Promise<boolean>;
        unpinMessage(message: MessageResolvable): Promise<boolean>;

    }

    class Role implements Mentionable {
        color: number;
        createdAt: number;
        get guild(): Guild;
        hoist: boolean;
        id: string;
        managed: boolean;
        mentionable: boolean;
        name: string;
        permissions: Permission
        position: number;
        delete(): Promise<boolean>;
        edit(options: RoleOptions, reason: string): Promise<Role | boolean>;
        editPosition(position: number): Promise<boolean>;
    }

    class CategoryChannel extends Channel {
        get channels(): Collection<Channel>;
    }

    class VoiceChannel extends Channel {
        bitrate: number;
        userLimit: number;
        get voiceMembers(): Collection<Member>;
        createInvite(options: CreateInviteOptions, reason: string): Promise<Invite | boolean>;
        getInvites(): Promise<Invite[] | boolean>;
    }

    class Invite {
        code: string;

        channel: { id: string, name: string };
        guild: {
            id: string,
            name: string,
            splash?: string,
            icon?: string,
            textChannelCount?: number,
            voiceChannelCount?: number,
        }?;
        user: User;
        uses: number;
        maxUses: number;
        maxAge: number;
        temporary: number;
        revoked: boolean;
        presenceCount: number?;
        memberCount: number?;
        delete(): Promise<boolean>;
        get createdAt(): number;
    }
}