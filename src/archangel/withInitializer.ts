import {
    Message,
    ChatInputCommandInteraction,
    Snowflake,
    MessagePayload,
    MessageReplyOptions,
    InteractionReplyOptions,
    MessageEditOptions,
    InteractionEditReplyOptions,
} from 'discord.js';
import { Checkers } from '../helpers/checkers.js';
import { Options, FetchOptions } from '../types/global.js';

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

    get author() {
        if (this.isMessageContext(this.context))
            return this.context.author;
        
        return this.context.user;
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
   
    public edit(options: string | MessagePayload | MessageEditOptions | InteractionEditReplyOptions) {
        if (this.isInteractionContext(this.context)) 
            this.context.editReply(options);
        else {
            if (!this.context.editable)
                throw new Error('Could not edit the message: it is not editable');
            
            this.context.edit(options);
        }
    }

    public delete(message?: Message | Snowflake) {
        if (this.isInteractionContext(this.context))
            this.context.deleteReply(message);
        else {
            if (!this.context.deletable)
                throw new Error('Could not delete the message: it is not deletable');
            
            this.context.delete();
        }
    }

    public fetchReply(options?: FetchOptions) {
        if (this.isInteractionContext(this.context))
            return this.context.fetchReply(options?.messageId);
        else
            return this.context.fetch(options?.force ?? false);
    }
}