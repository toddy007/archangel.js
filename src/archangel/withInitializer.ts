import {
    Message,
    ChatInputCommandInteraction,
    Snowflake,
    MessagePayload,
    MessageReplyOptions,
    InteractionReplyOptions,
    MessageEditOptions,
    InteractionEditReplyOptions,
    InteractionDeferReplyOptions,
} from 'discord.js';
import { Checkers } from '../helpers/checkers.js';
import { Options, FetchOptions } from '../types/global.js';
import { invalidContextError, invalidNameOptionError } from '../helpers/errors.js';

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

    public deferReply(options?: InteractionDeferReplyOptions, ignoreErrorIfMessage: boolean = true) {
        const notInteraction = !this.isInteractionContext(this.context);

        if (notInteraction && ignoreErrorIfMessage)
            return;
        if (notInteraction)
            throw new Error('Cannot defer reply: context is not an interaction');
        
        if (this.isInteractionContext(this.context))
            return this.context.deferReply(options);
    }

    public getCommandInfo(returnNullIfError: boolean = false) {
        if (!this.isInteractionContext(this.context)) {
            if (returnNullIfError)
                return null;
            
            throw new Error('Cannot get command info: context is not an interaction');
        }

        const { commandName, commandId, commandGuildId, commandType, options, context: commandContext } = this.context;

        return {
            commandName,
            commandId,
            commandGuildId,
            commandType,
            options,
            context: commandContext,
        }
    }

    public getOption(options: Omit<Options, 'index'>, returnNullIfError: boolean = false) {
        if (!this.isInteractionContext(this.context)) {
            if (returnNullIfError)
                return null;
    
            throw new Error("Cannot get option: context is not an interaction");
        }
    
        if (typeof options.name !== 'string') {
            if (returnNullIfError)
                return null;
    
            throw invalidNameOptionError;
        }
    
        return this.context.options.get(options.name, options.required ?? false);
    }
}