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
    User,
} from 'discord.js';
import { Checkers } from '../helpers/checkers.js';
import { Options, FetchOptions, DefaultReplyTypes } from '../types/global.js';
import { invalidNameOptionError } from '../helpers/errors.js';

export class WithInitializer<
    T extends Message | ChatInputCommandInteraction,
> extends Checkers {
    public context: T;

    public constructor(paramContext: T) {
        super();

        if (!paramContext)
            throw new Error(
                'You must provide a context to initialize WithInitializer',
            );
        if (!this.checkContext(paramContext))
            throw new Error(
                'Context must be an instance of Message or ChatInputCommandInteraction',
            );

        this.context = paramContext;
    }

    get author() {
        if (this.isMessageContext(this.context)) return this.context.author;

        return this.context.user;
    }

    public reply(
        options:
            | string
            | MessagePayload
            | MessageReplyOptions
            | InteractionReplyOptions,
        followUpIfReplied: boolean = false,
    ) {
        if (this.isInteractionContext(this.context)) {
            if (
                (this.context.replied || this.context.deferred) &&
                followUpIfReplied
            )
                return this.context.followUp(options as DefaultReplyTypes | InteractionReplyOptions);

            return this.context.reply(options as DefaultReplyTypes | InteractionReplyOptions);
        }

        return this.context.reply(options as DefaultReplyTypes | MessageReplyOptions);
    }

    public edit(
        options:
            | string
            | MessagePayload
            | MessageEditOptions
            | InteractionEditReplyOptions,
    ) {
        if (this.isInteractionContext(this.context))
            this.context.editReply(options);
        else {
            if (!this.context.editable)
                throw new Error(
                    'Could not edit the message: it is not editable',
                );

            this.context.edit(options);
        }
    }

    public delete(message?: Message | Snowflake) {
        if (this.isInteractionContext(this.context))
            this.context.deleteReply(message);
        else {
            if (!this.context.deletable)
                throw new Error(
                    'Could not delete the message: it is not deletable',
                );

            this.context.delete();
        }
    }

    public fetchReply(options: FetchOptions = {}) {
        if (this.isInteractionContext(this.context))
            return this.context.fetchReply(options.messageId);
        else return this.context.fetch(options.force || false);
    }

    public deferReply(
        options?: InteractionDeferReplyOptions,
        ignoreErrorIfMessage: boolean = true,
    ) {
        const notInteraction = !this.isInteractionContext(this.context);

        if (notInteraction && ignoreErrorIfMessage) return;
        if (notInteraction)
            throw new Error(
                'Cannot defer reply: context is not an interaction',
            );

        if (this.isInteractionContext(this.context))
            return this.context.deferReply(options);
    }

    public getCommandInfo(returnNullIfError: boolean = true) {
        if (!this.isInteractionContext(this.context)) {
            if (returnNullIfError) return null;

            throw new Error(
                'Cannot get command info: context is not an interaction',
            );
        }

        const {
            commandName,
            commandId,
            commandGuildId,
            commandType,
            options,
            context: commandContext,
        } = this.context;

        return {
            commandName,
            commandId,
            commandGuildId,
            commandType,
            options,
            context: commandContext,
        };
    }

    public getOption(
        options: Omit<Options, 'index'> = {},
        returnNullIfError: boolean = true,
    ) {
        if (!this.isInteractionContext(this.context)) {
            if (returnNullIfError) return null;

            throw new Error('Cannot get option: context is not an interaction');
        }

        if (typeof options.name !== 'string') {
            if (returnNullIfError) return null;

            throw invalidNameOptionError;
        }

        return this.context.options.get(
            options.name,
            options.required ?? false,
        );
    }

    public getMentionable(options: Options = {}, returnNullIfError: boolean = true) {
        if (this.isMessageContext(this.context)) {
            if (typeof options.index !== 'number') options.index = 0;

            const mentionables = {
                member: this.context.mentions.members?.at(options.index),
                role: this.context.mentions.roles.at(options.index),
                user: this.context.mentions.users.at(options.index),
            };

            return mentionables ?? null;
        }

        if (typeof options.name !== 'string') {
            if (returnNullIfError) return null;

            throw invalidNameOptionError;
        }

        const mentionable = this.context.options.getMentionable(
            options.name,
            options.required ?? false,
        );
        return mentionable;
    }

    public getUser(
        options: Options = {},
        returnNullIfError: boolean = true,
    ): User | null {
        if (this.isMessageContext(this.context)) {
            if (typeof options.index !== 'number') options.index = 0;

            const user = this.context.mentions.users.at(options.index);
            return user ?? null;
        }

        if (typeof options.name !== 'string') {
            if (returnNullIfError) return null;

            throw invalidNameOptionError;
        }

        const user = this.context.options.getUser(
            options.name,
            options.required ?? false,
        );
        return user;
    }

    public getMember(
        options: Omit<Options, 'required'> = {},
        returnNullIfError: boolean = true,
    ) {
        if (this.isMessageContext(this.context)) {
            if (typeof options.index !== 'number') options.index = 0;

            const member = this.context.mentions.members?.at(options.index);
            return member ?? null;
        }

        if (typeof options.name !== 'string') {
            if (returnNullIfError) return null;

            throw invalidNameOptionError;
        }

        const member = this.context.options.getMember(options.name);
        return member;
    }

    public getRole(options: Options = {}, returnNullIfError: boolean = true) {
        if (this.isMessageContext(this.context)) {
            if (typeof options.index !== 'number') options.index = 0;

            const role = this.context.mentions.roles.at(options.index);
            return role ?? null;
        }

        if (typeof options.name !== 'string') {
            if (returnNullIfError) return null;

            throw invalidNameOptionError;
        }

        const role = this.context.options.getRole(
            options.name,
            options.required ?? false,
        );
        return role;
    }

    public getChannel(options: Options = {}, returnNullIfError: boolean = true) {
        if (this.isMessageContext(this.context)) {
            if (typeof options.index !== 'number') options.index = 0;

            const channel = this.context.mentions.channels.at(options.index);
            return channel ?? null;
        }

        if (typeof options.name !== 'string') {
            if (returnNullIfError) return null;

            throw invalidNameOptionError;
        }

        const channel = this.context.options.getChannel(
            options.name,
            options.required ?? false,
        );
        return channel;
    }

    public getAttachment(options: Options = {}, returnNullIfError: boolean = true) {
        if (this.isMessageContext(this.context)) {
            if (typeof options.index !== 'number') options.index = 0;

            const attachment = this.context.attachments.at(options.index);
            return attachment ?? null;
        }

        if (typeof options.name !== 'string') {
            if (returnNullIfError) return null;

            throw invalidNameOptionError;
        }

        const attachment = this.context.options.getAttachment(
            options.name,
            options.required ?? false,
        );
        return attachment;
    }

    public getBoolean(
        options: Omit<Options, 'index'> = {},
        returnNullIfError: boolean = true,
    ) {
        if (!this.isInteractionContext(this.context)) {
            if (returnNullIfError) return null;

            throw new Error(
                'Cannot get boolean: context is not an interaction',
            );
        }

        if (typeof options.name !== 'string') throw invalidNameOptionError;

        return this.context.options.getBoolean(
            options.name,
            options.required ?? false,
        );
    }

    public getInteger(
        context: ChatInputCommandInteraction,
        options: Omit<Options, 'index'>,
        returnNullIfError: boolean = true,
    ) {
        if (!this.isInteractionContext(context)) {
            if (returnNullIfError) return null;

            throw new Error(
                'Cannot get integer: context is not an interaction',
            );
        }

        if (typeof options.name !== 'string') throw invalidNameOptionError;

        return context.options.getInteger(
            options.name,
            options.required ?? false,
        );
    }

    public getNumber(
        options: Omit<Options, 'index'> = {},
        returnNullIfError: boolean = true,
    ) {
        if (!this.isInteractionContext(this.context)) {
            if (returnNullIfError) return null;

            throw new Error('Cannot get number: context is not an interaction');
        }

        if (typeof options.name !== 'string') throw invalidNameOptionError;

        return this.context.options.getNumber(
            options.name,
            options.required ?? false,
        );
    }

    public getString(
        options: Omit<Options, 'index'> = {},
        returnNullIfError: boolean = true,
    ) {
        if (!this.isInteractionContext(this.context)) {
            if (returnNullIfError) return null;

            throw new Error('Cannot get string: context is not an interaction');
        }

        if (typeof options.name !== 'string') throw invalidNameOptionError;

        return this.context.options.getString(
            options.name,
            options.required ?? false,
        );
    }

    public getSubcommand(
        required: boolean = false,
        returnNullIfError: boolean = true,
    ) {
        if (!this.isInteractionContext(this.context)) {
            if (returnNullIfError) return null;

            throw new Error(
                'Cannot get subcommand: context is not an interaction',
            );
        }

        return this.context.options.getSubcommand(required ?? false);
    }

    public getSubcommandGroup(
        required: boolean = false,
        returnNullIfError: boolean = true,
    ) {
        if (!this.isInteractionContext(this.context)) {
            if (returnNullIfError) return null;

            throw new Error(
                'Cannot get subcommand group: context is not an interaction',
            );
        }

        return this.context.options.getSubcommandGroup(required ?? false);
    }
}
