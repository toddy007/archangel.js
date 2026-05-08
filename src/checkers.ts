import { ChatInputCommandInteraction, Message } from 'discord.js';
import { Context } from './global';

export abstract class Checkers {
    public checkContext(context: Context): context is Context {
        if (!(this.isMessageContext(context) || this.isInteractionContext(context)))
            return false;

        return true;
    }

    public isMessageContext(context: Context): context is Message {
        return context instanceof Message;
    }

    public isInteractionContext(context: Context): context is ChatInputCommandInteraction {
        return context instanceof ChatInputCommandInteraction;
    }
}