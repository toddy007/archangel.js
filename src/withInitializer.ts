import {
    Message,
    ChatInputCommandInteraction,
    Snowflake,
    MessagePayload,
    MessageReplyOptions,
    InteractionReplyOptions,
} from 'discord.js';
import { Checkers } from './checkers';

export class WithInitializer<T extends Message | ChatInputCommandInteraction> extends Checkers {
    public context: T;

    public constructor(paramContext: T) {
        super();

        if (!paramContext)
            throw new Error('You must provide a context to initialize WithInitializer');
        if (!this.checkContext(paramContext))
            throw new Error('Context must be an instance of Message or ChatInputCommandInteraction');
       
        this.context = paramContext;
    }

    public reply(options: string | MessagePayload | MessageReplyOptions | InteractionReplyOptions, followUpIfReplied: boolean = false) {
        if (this.isInteractionContext(this.context)) {
            if ((this.context.replied || this.context.deferred) && followUpIfReplied)
                // @ts-ignore
                this.context.followUp(options);
        }
        
        // @ts-ignore
        this.context.reply(options);
    }
   
}