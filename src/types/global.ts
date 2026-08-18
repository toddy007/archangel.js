import { ChatInputCommandInteraction, Message, Snowflake, MessagePayload, ContextMenuCommandInteraction } from 'discord.js';

export type Context = Message | ChatInputCommandInteraction | ContextMenuCommandInteraction;

export interface Options {
    index?: number;
    name?: string;
    required?: boolean;
}

export interface FetchOptions {
    messageId?: Snowflake;
    force?: boolean;
}

export type DefaultReplyTypes = string | MessagePayload;
