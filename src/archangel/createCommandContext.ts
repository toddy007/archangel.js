import { Context } from '../types/global.js';
import { CommandContext } from './CommandContext.js'

export function createCommandContext<T extends Context = Context>(context: T): CommandContext<T> {
    return new CommandContext<T>(context);
}