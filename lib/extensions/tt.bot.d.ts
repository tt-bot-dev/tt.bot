declare module "tt.bot" {
    export const bot: Bot;
    export const message: Message;
    export const guild: Guild;
    export const channel: TextChannel;
    export const member: Member;
    export const author: User;
    export const extension: Extension;
    export const Constants: Constants;
    export const command: {
        prefix: string;
        trigger: string;
        args: string;
    }

    type UserResolvable = User | Member | Message | string;
    type RoleResolvable = Role | string;
    type MessageResolvable = Message | string;
    type GuildChannel = TextChannel | VoiceChannel | CategoryChannel | Channel;
    type OverwriteResolvable = UserResolvable | RoleResolvable;

    //#region eris
    // ===================== ERIS TYPINGS =====================

    type MessageContent = string | { content?: string, tts?: boolean, disableEveryone?: boolean, embed?: EmbedOptions };
    interface Attachment { url: string; proxy_url: string; size: number; id: string; filename: string; }
    interface EmbedBase {
        title?: string;
        description?: string;
        url?: string;
        timestamp?: string;
        color?: number;
        footer?: { text: string, icon_url?: string, proxy_icon_url?: string };
        image?: { url?: string, proxy_url?: string, height?: number, width?: number };
        thumbnail?: { url?: string, proxy_url?: string, height?: number, width?: number };
        video?: { url: string, height?: number, width?: number };
        provider?: { name: string, url?: string };
        fields?: Array<{ name?: string, value?: string, inline?: boolean }>;
        author?: { name: string, url?: string, icon_url?: string, proxy_icon_url?: string };
    }
    type Embed = {
        type: string,
    } & EmbedBase;
    type EmbedOptions = {
        type: string;
    } & EmbedBase;
    interface MessageFile { file: Buffer | string; name: string; }
    interface EmojiBase {
        name: string;
        icon?: string;
    }
    type EmojiOptions = {
        roles?: string[],
    } & EmojiBase;
    type Emoji = {
        roles: string[],
    } & EmojiBase;
    interface GamePresence {
        name: string;
        type?: 0 | 1 | 2 | 3 | 4;
        url?: string;
        timestamps?: { start: number; end?: number };
        application_id?: string;
        sync_id?: string;
        details?: string;
        state?: string;
        party?: { id?: string };
        assets?: {
            small_text?: string;
            small_image?: string;
            large_text?: string;
            large_image?: string;
            [key: string]: any;
        };
        instance?: boolean;
        flags?: number;
        // the stuff attached to this object apparently varies even more than documented, so...
        [key: string]: any;
    }
    interface Permission {
        public allow: number;
        public deny: number;
        public json: { [s: string]: boolean };
        public has(permission: string): boolean;
    }
    interface PermissionOverwrite extends Permission {
        public id: string;
        public createdAt: number;
        public type: string;
    }
    interface VoiceState {
        public id: string;
        public createdAt: number;
        public sessionID?: string;
        public channelID?: string;
        public mute: boolean;
        public deaf: boolean;
        public suppress: boolean;
        public selfMute: boolean;
        public selfDeaf: boolean;
    }

    interface GuildOptions {
        name?: string;
        region?: string;
        icon?: string;
        verificationLevel?: number;
        defaultNotifications?: number;
        afkChannelID?: string;
        afkTimeout?: number;
        ownerID?: string;
        splash?: string;
    }
    interface MemberOptions { roles?: string[]; nick?: string; mute?: boolean; deaf?: boolean; channelID?: string; }
    interface RoleOptions { name?: string; permissions?: number; color?: number; hoist?: boolean; mentionable?: boolean; }

    interface Webhook {
        name: string;
        channel_id: string;
        token: string;
        avatar?: string;
        guild_id: string;
        id: string;
        user: {
            username: string,
            discriminator: string,
            id: string,
            avatar?: string,
        };
    }
    interface CreateInviteOptions {
        maxAge?: number;
        maxUses?: number;
        temporary?: boolean;
    }
    interface Collection<T extends { id: string | number }> extends Map<string | number, T> {
        public baseObject: new (...args: any[]) => T;
        public limit?: number;
        public constructor(baseObject: new (...args: any[]) => T, limit?: number);
        public add(obj: T, extra?: any, replace?: boolean): T;
        public find(func: (i: T) => boolean): T;
        public random(): T;
        public filter(func: (i: T) => boolean): T[];
        public map<R>(func: (i: T) => R): R[];
        public update(obj: T, extra?: any, replace?: boolean): T;
        public remove(obj: T | { id: string }): T;
    }
    interface Activity {
        application_id?: string;
        assets?: ActivityAssets[];
        created_at: number;
        details?: string;
        id: string;
        name: string;
        state?: string;
        type: 0 | 1 | 2 | 3 | 4;
        url?: string;
    }

    interface ActivityAssets {
        large_image: string;
    }

    type Status = "online" | "idle" | "dnd" | "offline";

    interface ClientStatus {
        web: Status;
        desktop: Status;
        mobile: Status;
    }

    //#endregion eris
    interface GuildBan {
        reason?: string;
        user: User;
    }

    interface Constants {
        ChannelTypes: {
            text: 0,
            dm: 1,
            voice: 2,
            category: 4,
            news: 5,
            news: 6
        };
        AuditLogActions: {
            [key: string]: number;
        };
        ExtensionFlags: {
            SNEKFETCH_ENABLED: 1
        }
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
        passesRoleHierarchy(member1: Member, member2: Member): boolean;
        waitForMessage(channel: GuildChannel, author: UserResolvable, check: (msg: Message) => boolean, timeout: number): Promise<Message | Error | string>
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
        messageReference?: {
            messageID?: string;
            channelID?: string;
            guildID?: string;
        }
        pinned: boolean;
        reactions: {
            [emoji: string]: {
                count: number;
                me: boolean;
            }
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
        activities: Activity[];
        game: GamePresence;
        get guild(): Guild;
        joinedAt: number;
        nick: string;
        permission: Permission;
        roles: Role[];
        staticAvatarURL: string;
        status: Status;
        get user(): User;
        voiceState: VoiceState
        addRole(role: RoleResolvable, reason?: string): Promise<boolean>;
        ban(deleteMessageDays: number, reason?: string): Promise<boolean>;
        edit(options: MemberOptions, reason?: string): Promise<boolean>;
        kick(reason?: string): Promise<boolean>;
        removeRole(role: RoleResolvable, reason?: string): Promise<boolean>;
        strike(reason: string): Promise<boolean>;
        unban(reason?: string): Promise<boolean>;
    }

    class Guild {
        afkChannelID: string;
        afkTimeout: number;
        createdAt: number;
        get channels(): Collection<Channel>;
        defaultNotifications: number;
        description: string;
        emojis: Emoji[];
        explicitContentFilter: string;
        features: string[];
        icon: string;
        iconURL: string;
        id: string;
        joinedAt: number;
        large: boolean;
        maxMembers: number;
        maxPresences: number;
        memberCount: number;
        get members(): Collection<Member>;
        get me(): Member;
        mfaLevel: number;
        name: number;
        ownerID: string;
        get owner(): Member;
        preferredLocale: string;
        premiumSubscriptionCount: number;
        premiumTier: number;
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
        dynamicSplashURL(format: string, size: number): string;
        dynamicBannerURL(format: string, size: number): string;
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
        getPruneCount(days: number): Promise<number | boolean>;
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
        getMessage(id: string): Message;
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
        permissions: Permission;
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

    class Extension {
        readonly id: string;
        readonly name: string;
        readonly flags: number;
        store: object;
        updateData(data: string | object): Promise<object | Error>
        wipeData(): Promise<object | Error>
    }
}