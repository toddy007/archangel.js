import { ChatInputCommandInteraction, Message, Snowflake } from 'discord.js';

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