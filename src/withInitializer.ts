import {
    Message,
    ChatInputCommandInteraction,
    Snowflake,
    MessagePayload,
    MessageReplyOptions,
    InteractionReplyOptions,
} from 'discord.js';

export class WithInitializer<T extends Message | ChatInputCommandInteraction> {
    public context: T;

    public constructor(paramContext: T) {
        if (!paramContext)
            throw new Error('You must provide a context to initialize WithInitializer');
        if (!(paramContext instanceof Message) && !(paramContext instanceof ChatInputCommandInteraction))
            throw new Error('Context must be an instance of Message or ChatInputCommandInteraction');
       
        this.context = paramContext;
    }
}