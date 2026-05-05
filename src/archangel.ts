import { Snowflake, Message, ChatInputCommandInteraction, MessageReplyOptions, InteractionReplyOptions, User, MessageEditOptions, InteractionEditReplyOptions, MessagePayload} from 'discord.js';

export class Archangel {
    private checkContext(context: Context): boolean {
        if (!(context instanceof Message || context instanceof ChatInputCommandInteraction))
            return false;

        return true;
    }
    
    public reply(context: Context, options: string | MessageReplyOptions | MessagePayload | InteractionReplyOptions, followUpIfReplied: boolean = false) {
        if (context instanceof ChatInputCommandInteraction) {
            if ((context.replied || context.deferred) && followUpIfReplied)
                // @ts-ignore
                return context.followUp(options);
        }

        // @ts-ignore
        return context.reply(options);
    }

    public edit(context: Context, options: string | MessageEditOptions | MessagePayload | InteractionEditReplyOptions) {
        if (context instanceof ChatInputCommandInteraction)
            return context.editReply(options);

        return context.edit(options);
    }

    public delete(context: Context, message?: Message | Snowflake) {
        if (context instanceof ChatInputCommandInteraction)
            return context.deleteReply(message);

        if (!context.deletable)
            throw new Error();

        return context.delete();
    }

    public getUser(context: Context, option: number | string = 0, required: boolean = false): User | null {
        if (context instanceof Message) {
            if (typeof option === 'string')
                option = 0;

            const user = context.mentions.users.at(option);
            return user ?? null;
        }

        if (!(context instanceof ChatInputCommandInteraction))
            throw new Error()

        if (typeof option !== 'string')
            throw new Error()

        const user = context.options.getUser(option, required);
        return user;
    }

    public getChannel(context: Context, option: number | string = 0, required: boolean = false) {
        if (context instanceof Message) {
            if (typeof option === 'string')
                option = 0;

            const channel = context.mentions.channels.at(option);
            return channel ?? null;
        }

        if (!(context instanceof ChatInputCommandInteraction))
            throw new Error()

        if (typeof option !== 'string')
            throw new Error()

        const channel = context.options.getChannel(option, required);
        return channel;
    }
}

type Context = Message | ChatInputCommandInteraction;
