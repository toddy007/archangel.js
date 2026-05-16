import {
    Snowflake,
    Message,
    MessageReplyOptions,
    InteractionReplyOptions,
    User,
    MessageEditOptions,
    InteractionEditReplyOptions,
    MessagePayload,
    InteractionDeferReplyOptions,
} from 'discord.js';
import { Context, Options, FetchOptions } from '../types/global.js';
import { Checkers } from '../helpers/checkers.js';
import {
    invalidContextError,
    invalidNameOptionError,
} from '../helpers/errors.js';

export abstract class NoInitializer extends Checkers {
    public getAuthor(context: Context): User {
        if (!this.checkContext(context)) throw invalidContextError;

        if (this.isMessageContext(context)) return context.author;

        return context.user;
    }

    public reply(
        context: Context,
        options:
            | string
            | MessageReplyOptions
            | MessagePayload
            | InteractionReplyOptions,
        followUpIfReplied: boolean = false,
    ) {
        if (!this.checkContext(context)) throw invalidContextError;

        if (this.isInteractionContext(context)) {
            if ((context.replied || context.deferred) && followUpIfReplied)
                // @ts-ignore
                return context.followUp(options);
        }

        // @ts-ignore
        return context.reply(options);
    }

    public edit(
        context: Context,
        options:
            | string
            | MessageEditOptions
            | MessagePayload
            | InteractionEditReplyOptions,
    ) {
        if (!this.checkContext(context)) throw invalidContextError;

        if (this.isInteractionContext(context))
            return context.editReply(options);

        if (!context.editable)
            throw new Error(
                'Could not edit the message: context is not editable',
            );

        return context.edit(options);
    }

    public delete(context: Context, message?: Message | Snowflake) {
        if (!this.checkContext(context)) throw invalidContextError;

        if (this.isInteractionContext(context))
            return context.deleteReply(message);

        if (!context.deletable)
            throw new Error(
                'Could not delete the message: context is not deletable',
            );

        return context.delete();
    }

    public fetchMessage(context: Context, options: FetchOptions = {}) {
        if (!this.checkContext(context)) throw invalidContextError;

        if (this.isInteractionContext(context))
            return context.fetchReply(options.messageId);

        return context.fetch(options.force ?? false);
    }

    public deferReply(
        context: Context,
        options?: InteractionDeferReplyOptions,
        ignoreErrorIfMessage: boolean = true,
    ) {
        if (!this.checkContext(context)) throw invalidContextError;

        const notInteraction = this.isMessageContext(context);

        if (notInteraction && ignoreErrorIfMessage) return;

        if (notInteraction)
            throw new Error(
                'Cannot defer reply: context is not an interaction',
            );

        return context.deferReply(options);
    }

    public getCommandInfo(context: Context, returnNullIfError: boolean = true) {
        if (!this.isInteractionContext(context)) {
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
        } = context;

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
        context: Context,
        options: Omit<Options, 'index'> = {},
        returnNullIfError: boolean = true,
    ) {
        if (!this.isInteractionContext(context)) {
            if (returnNullIfError) return null;

            throw new Error('Cannot get option: context is not an interaction');
        }

        if (typeof options.name !== 'string') {
            if (returnNullIfError) return null;

            throw invalidNameOptionError;
        }

        return context.options.get(options.name, options.required ?? false);
    }

    public getMentionable(
        context: Context,
        options: Options = {},
        returnNullIfError: boolean = true,
    ) {
        if (!this.checkContext(context)) throw invalidContextError;

        if (this.isMessageContext(context)) {
            if (typeof options.index !== 'number') options.index = 0;

            const mentionables = {
                member: context.mentions.members?.at(options.index),
                role: context.mentions.roles.at(options.index),
                user: context.mentions.users.at(options.index),
            };

            return mentionables ?? null;
        }

        if (typeof options.name !== 'string') {
            if (returnNullIfError) return null;

            throw invalidNameOptionError;
        }

        const mentionable = context.options.getMentionable(
            options.name,
            options.required ?? false,
        );
        return mentionable;
    }

    public getUser(
        context: Context,
        options: Options = {},
        returnNullIfError: boolean = true,
    ): User | null {
        if (!this.checkContext(context)) throw invalidContextError;

        if (this.isMessageContext(context)) {
            if (typeof options.index !== 'number') options.index = 0;

            const user = context.mentions.users.at(options.index);
            return user ?? null;
        }

        if (typeof options.name !== 'string') {
            if (returnNullIfError) return null;

            throw invalidNameOptionError;
        }

        const user = context.options.getUser(
            options.name,
            options.required ?? false,
        );
        return user;
    }

    public getMember(
        context: Context,
        options: Omit<Options, 'required'> = {},
        returnNullIfError: boolean = true,
    ) {
        if (!this.checkContext(context)) throw invalidContextError;

        if (this.isMessageContext(context)) {
            if (typeof options.index !== 'number') options.index = 0;

            const member = context.mentions.members?.at(options.index);
            return member ?? null;
        }

        if (typeof options.name !== 'string') {
            if (returnNullIfError) return null;

            throw invalidNameOptionError;
        }

        const member = context.options.getMember(options.name);
        return member;
    }

    public getRole(
        context: Context,
        options: Options = {},
        returnNullIfError: boolean = true,
    ) {
        if (!this.checkContext(context)) throw invalidContextError;

        if (this.isMessageContext(context)) {
            if (typeof options.index !== 'number') options.index = 0;

            const role = context.mentions.roles.at(options.index);
            return role ?? null;
        }

        if (typeof options.name !== 'string') {
            if (returnNullIfError) return null;

            throw invalidNameOptionError;
        }

        const role = context.options.getRole(
            options.name,
            options.required ?? false,
        );
        return role;
    }

    public getChannel(
        context: Context,
        options: Options = {},
        returnNullIfError: boolean = true,
    ) {
        if (!this.checkContext(context)) throw invalidContextError;

        if (this.isMessageContext(context)) {
            if (typeof options.index !== 'number') options.index = 0;

            const channel = context.mentions.channels.at(options.index);
            return channel ?? null;
        }

        if (typeof options.name !== 'string') {
            if (returnNullIfError) return null;

            throw invalidNameOptionError;
        }

        const channel = context.options.getChannel(
            options.name,
            options.required ?? false,
        );
        return channel;
    }

    public getAttachment(
        context: Context,
        options: Options = {},
        returnNullIfError: boolean = true,
    ) {
        if (!this.checkContext(context)) throw invalidContextError;

        if (this.isMessageContext(context)) {
            if (typeof options.index !== 'number') options.index = 0;

            const attachment = context.attachments.at(options.index);
            return attachment ?? null;
        }

        if (typeof options.name !== 'string') {
            if (returnNullIfError) return null;

            throw invalidNameOptionError;
        }

        const attachment = context.options.getAttachment(
            options.name,
            options.required ?? false,
        );
        return attachment;
    }

    public getBoolean(
        context: Context,
        options: Omit<Options, 'index'> = {},
        returnNullIfError: boolean = true,
    ) {
        if (!this.isInteractionContext(context)) {
            if (returnNullIfError) return null;

            throw new Error(
                'Cannot get boolean: context is not an interaction',
            );
        }

        if (typeof options.name !== 'string') throw invalidNameOptionError;

        return context.options.getBoolean(
            options.name,
            options.required ?? false,
        );
    }

    public getInteger(
        context: Context,
        options: Omit<Options, 'index'> = {},
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
        context: Context,
        options: Omit<Options, 'index'> = {},
        returnNullIfError: boolean = true,
    ) {
        if (!this.isInteractionContext(context)) {
            if (returnNullIfError) return null;

            throw new Error('Cannot get number: context is not an interaction');
        }

        if (typeof options.name !== 'string') throw invalidNameOptionError;

        return context.options.getNumber(
            options.name,
            options.required ?? false,
        );
    }

    public getString(
        context: Context,
        options: Omit<Options, 'index'> = {},
        returnNullIfError: boolean = true,
    ) {
        if (!this.isInteractionContext(context)) {
            if (returnNullIfError) return null;

            throw new Error('Cannot get string: context is not an interaction');
        }

        if (typeof options.name !== 'string') throw invalidNameOptionError;

        return context.options.getString(
            options.name,
            options.required ?? false,
        );
    }

    public getSubcommand(
        context: Context,
        required: boolean = false,
        returnNullIfError: boolean = true,
    ) {
        if (!this.isInteractionContext(context)) {
            if (returnNullIfError) return null;

            throw new Error(
                'Cannot get subcommand: context is not an interaction',
            );
        }

        return context.options.getSubcommand(required ?? false);
    }

    public getSubcommandGroup(
        context: Context,
        required: boolean = false,
        returnNullIfError: boolean = true,
    ) {
        if (!this.isInteractionContext(context)) {
            if (returnNullIfError) return null;

            throw new Error(
                'Cannot get subcommand group: context is not an interaction',
            );
        }

        return context.options.getSubcommandGroup(required ?? false);
    }
}
