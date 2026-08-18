import { ChatInputCommandInteraction, ContextMenuCommandInteraction, Message } from 'discord.js';
import { Context } from '../types/global.js';

export class Checkers {
    public checkContext(context: Context): context is Context {
        return this.isMessageContext(context) || this.isAnyInteractionContext(context);
    }

    public isMessageContext(context: Context): context is Message {
        return context instanceof Message;
    }

    public isInteractionContext(
        context: Context,
    ): context is ChatInputCommandInteraction {
        return context instanceof ChatInputCommandInteraction;
    }

    public isContextMenuContext(context: Context): context is ContextMenuCommandInteraction {
        return context instanceof ContextMenuCommandInteraction;
    }

    public isAnyInteractionContext(context: Context): context is ChatInputCommandInteraction | ContextMenuCommandInteraction {
        return this.isInteractionContext(context) || this.isContextMenuContext(context);
    }
}
