import { Message, ChatInputCommandInteraction } from 'discord.js';

export class Archangel {
    public contextType: ContextType;

    public setContextType(context: Message | ChatInputCommandInteraction) {
        if (context instanceof Message) {
            this.contextType = ContextType.Message;
            return true;
        }

        if (context instanceof ChatInputCommandInteraction) {
            this.contextType = ContextType.ChatInputCommandInteraction;
            return true;
        }

        throw new Error('The context param is not a Message or ChatInputCommandInteraction');
    }
}

enum ContextType {
    Message,
    ChatInputCommandInteraction,
}