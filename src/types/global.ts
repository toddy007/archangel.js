import { ChatInputCommandInteraction, Message, Snowflake, MessagePayload } from 'discord.js';

export type Context = Message | ChatInputCommandInteraction;

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