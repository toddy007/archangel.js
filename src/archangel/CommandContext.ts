import { WithInitializer } from "./withInitializer.js";
import { Context } from '../types/global.js';

export class CommandContext<T extends Context = Context> extends WithInitializer<T> {
    public constructor(paramContext: T) {
        super(paramContext);
    }

    get id() {
        return this.context.id;
    }

    get guild() {
        return this.context.guild;
    }

    get guildId() {
        return this.context.guildId;
    }

    get channel() {
        return this.context.channel;
    }

    get channelId() {
        return this.context.channelId;
    }

    get member() {
        return this.context.member;
    }

    get memberPermissions() {
        return this.isInteractionContext(this.context) ? this.context.memberPermissions : this.member?.permissions;
    }

    get deletable() {
        return this.isMessageContext(this.context) ? this.context.deletable : null;
    }

    get applicationId() {
        return this.context.applicationId;
    }

    get attachments() {
        return this.isMessageContext(this.context) ? this.context.attachments : null;
    }

    get content() {
        return this.isMessageContext(this.context) ? this.context.content : null;
    }

    get cleanContent() {
        return this.isMessageContext(this.context) ? this.context.cleanContent : null;
    }

    get client() {
        return this.context.client;
    }

    get components() {
        return this.isMessageContext(this.context) ? this.context.components : null;
    }

    get createdAt() {
        return this.context.createdAt;
    }

    get createdTimestamp() {
        return this.context.createdTimestamp;
    }
    
    get editedAt() {
        return this.isMessageContext(this.context) ? this.context.editedAt : null;
    }

    get editedTimestamp() {
        return this.isMessageContext(this.context) ? this.context.editedTimestamp : null;
    }

    get embeds() {
        return this.isMessageContext(this.context) ? this.context.embeds : null;
    }

    get mentions() {
        return this.isMessageContext(this.context) ? this.context.mentions : null;
    }

    get reference() {
        return this.isMessageContext(this.context) ? this.context.reference : null;
    }

    get url() {
        return this.isMessageContext(this.context) ? this.context.url : null;
    }

    get deferred() {
        return this.isInteractionContext(this.context) ? this.context.deferred : null;
    }

    get replied() {
        return this.isInteractionContext(this.context) ? this.context.replied : null;
    }

    get type() {
        return this.context.type;
    }
}