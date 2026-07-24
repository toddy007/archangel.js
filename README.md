## [↗️] Important Links
[Repository](https://github.com/toddy007/archangel.js)<br>
[Issues](https://github.com/toddy007/archangel.js/issues)<br>
[NPMJS](https://www.npmjs.com/package/archangel.js)
# archangel.js

A framework for [discord.js](https://discord.js.org/) that lets you build **hybrid commands**: prefix commands (`Message`) and slash commands (`ChatInputCommandInteraction`) using the **same file and the same logic**.

---

# [📦] How to Use
**Installing**:
```bash
npm install archangel.js discord.js
```

The framework exports 4 main members: `NoInitializer`, `WithInitializer`, `CommandContext`, and `createCommandContext`, plus the types under `types/global`.

### ESM / TypeScript

```ts
import {
    NoInitializer,
    WithInitializer,
    CommandContext,
    createCommandContext,
} from 'archangel.js';

import type { Context, Options, FetchOptions } from 'archangel.js'; // typescript only
```

### CommonJS

```js
const {
    NoInitializer,
    WithInitializer,
    CommandContext,
    createCommandContext,
} = require('archangel.js');
```

In both cases, `Context` is the type representing a command's "context" — i.e. `Message | ChatInputCommandInteraction` from **discord.js**. You receive these values in `messageCreate` and `interactionCreate` events.

---

# [🧰] NoInitializer

`NoInitializer` is the "stateless" base class: no `context` is stored inside the instance. You pass the `context` (the `Message` or `ChatInputCommandInteraction`) manually on **every** method call.

It's useful when you want a single shared instance (e.g. a singleton/helper) that handles many different commands/contexts throughout the bot's lifetime.

```ts
const handler = new NoInitializer();

handler.reply(message, 'Hello!');
handler.reply(interaction, 'Hello!');
```
or
```ts
class HelloCommand extends NoInitializer {
    run(context) {
        this.reply(context, 'Hello!');
    }
}
```

Every method below takes `context` as its first parameter and throws an error (`invalidContextError`) if `context` isn't a `Message` or a `ChatInputCommandInteraction`, unless noted otherwise.

### 👤 `getAuthor(context)`

Returns the author of the context. Returns `context.author` for a message, or `context.user` for an interaction.

- **Returns:** `User`

### 🗣️ `reply(context, options, followUpIfReplied?)`

Replies to the context. Accepts `string`, `MessagePayload`, `MessageReplyOptions`, or `InteractionReplyOptions` as `options`.

If the context is an interaction that has already been replied to or deferred (`replied`/`deferred`) and `followUpIfReplied` is `true`, it uses `followUp` instead of `reply`.

- **Returns:** the return value of `context.reply(...)` or `context.followUp(...)` (a `Promise`).

### 📝 `edit(context, options)`

Edits the context's reply. Accepts `string`, `MessagePayload`, `MessageEditOptions`, or `InteractionEditReplyOptions`.

- **Returns:** the return value of `editReply`/`edit` (a `Promise`).

### 🗑️ `delete(context, message?)`

Deletes the context's reply.

- **Returns:** the return value of `deleteReply`/`delete` (a `Promise`).

### 🔍 `fetchMessage(context, options?)`

Fetches the context's reply message. `options.messageId` is only used for interactions; `options.force` only for messages.

For an interaction, calls `context.fetchReply(options.messageId)`. For a message, calls `context.fetch(options.force ?? false)`.

- **Returns:** the fetched `Message` (a `Promise`).

### ✋ `deferReply(context, options?, ignoreErrorIfMessage?)`

Defers the reply (`deferReply`). Only applies to interactions — messages can't be "deferred".

If the context is a message and `ignoreErrorIfMessage` is `true` (default), the function simply returns without doing anything. If `ignoreErrorIfMessage` is `false`, it throws. For an interaction, calls `context.deferReply(options)`.

- **Returns:** the return value of `context.deferReply(...)`, or `undefined` if ignored.

### 🗂️ `getCommandInfo(context, returnNullIfError?)`

Returns slash command information: `commandName`, `commandId`, `commandGuildId`, `commandType`, `options`, and `context`. Only works with interactions.

If the context isn't an interaction: returns `null` (default) or throws, depending on `returnNullIfError`.

- **Returns:** an object with the command info, or `null`.

### 📁 `getOption(context, options?, returnNullIfError?)`

Returns a generic command option by name (`options.name`), using `context.options.get(...)`. Only works with interactions.

- **Returns:** the found option, or `null`/throws if invalid.

### 🔔 `getMentionable(context, options?, returnNullIfError?)`

Returns a mention (user, member, or role) from the context.

For a message, uses `options.index` (default `0`) to pick the mention by position from `context.mentions`, returning an object `{ member, role, user }`. For an interaction, uses `options.name` with `context.options.getMentionable(...)`.

- **Returns:** an object `{ member, role, user }` (message) or the value of `getMentionable` (interaction), possibly `null`.

### 👥 `getUser(context, options?, returnNullIfError?)`

Returns a mentioned user. Same pattern as `getMentionable`: by index for messages, by name for interactions.

- **Returns:** `User | null`.

### 🧑‍💼 `getMember(context, options?, returnNullIfError?)`

Returns a mentioned guild member. Same index (message) / name (interaction) pattern.

- **Returns:** the found member, or `null`.

### 🔨 `getRole(context, options?, returnNullIfError?)`

Returns a mentioned role. Same index (message) / name (interaction) pattern.

- **Returns:** the found role, or `null`.

### #️⃣ `getChannel(context, options?, returnNullIfError?)`

Returns a mentioned channel. Same index (message) / name (interaction) pattern.

- **Returns:** the found channel, or `null`.

### 🖼️ `getAttachment(context, options?, returnNullIfError?)`

Returns an attachment. For a message, uses `options.index` over `context.attachments`. For an interaction, uses `options.name` with `context.options.getAttachment(...)`.

- **Returns:** the found attachment, or `null`.

### 🔘 `getBoolean(context, options?, returnNullIfError?)`

Returns the boolean value of an option by name. **Only works with interactions** (there's no prefix-command equivalent).

- **Returns:** `boolean | null`.

### 1️⃣ `getInteger(context, options?, returnNullIfError?)`

Returns the integer value of an option by name. Only works with interactions.

- **Returns:** `number | null`.

### 🔢 `getNumber(context, options?, returnNullIfError?)`

Returns the numeric (float) value of an option by name. Only works with interactions.

- **Returns:** `number | null`.

### 🔠 `getString(context, options?, returnNullIfError?)`

Returns the string value of an option by name. Only works with interactions.

- **Returns:** `string | null`.

### 🔗 `getSubcommand(context, required?, returnNullIfError?)`

Returns the name of the subcommand used. Only works with interactions.

- **Returns:** `string | null`.

### ⛓️ `getSubcommandGroup(context, required?, returnNullIfError?)`

Returns the name of the subcommand group used. Only works with interactions.

- **Returns:** `string | null`.

---

# [💻] WithInitializer

`WithInitializer` does the same thing as `NoInitializer`, but stores the `context` internally: it's passed once in the **constructor** and saved to the public `context` property. Because of this, every method below no longer takes a `context` parameter — they use `this.context` internally instead.

```ts
const cmd = new WithInitializer(context); // message or interaction

cmd.reply('Hello!');
cmd.getUser({ name: 'username' });
```
or
```ts
class HelloCommand extends WithInitializer {
    constructor(context) {
        super(context);
    }
    run() {
        this.reply('Hello!');
    }
}
```

If no `context` is passed to the constructor, or if it isn't a `Message`/`ChatInputCommandInteraction`, the constructor throws an error.

### 🛠️ - Properties

#### 🔧 `context`

The context (`Message` or `ChatInputCommandInteraction`) passed to the constructor.

- **Type:** `T extends Context` (generic, defaults to `Context`)

#### 👤 `author`

Returns the author of the context: `context.author` for a message, or `context.user` for an interaction.

- **Returns:** `User`

### 🪛 - Methods

These work exactly like their `NoInitializer` equivalents, but without the `context` parameter (they use `this.context`):

- 🗣️ **`reply(options, followUpIfReplied?)`** — replies to the context.
- 📝 **`edit(options)`** — edits the reply.
- 🗑️ **`delete(message?)`** — deletes the reply.
- 🔍 **`fetchReply(options?)`** — fetches the reply message (equivalent to `NoInitializer`'s `fetchMessage`).
- ✋ **`deferReply(options?, ignoreErrorIfMessage?)`** — defers the reply (interactions only).
- 🗂️ **`getCommandInfo(returnNullIfError?)`** — returns command info (interactions only).
- 📁 **`getOption(options?, returnNullIfError?)`** — returns a generic option by name (interactions only).
- 🔔 **`getMentionable(options?, returnNullIfError?)`** — returns a mention (index for messages, name for interactions).
- 👥 **`getUser(options?, returnNullIfError?)`** — returns a mentioned user.
- 🧑‍💼 **`getMember(options?, returnNullIfError?)`** — returns a mentioned member.
- 🔨 **`getRole(options?, returnNullIfError?)`** — returns a mentioned role.
- #️⃣ **`getChannel(options?, returnNullIfError?)`** — returns a mentioned channel.
- 🖼️ **`getAttachment(options?, returnNullIfError?)`** — returns an attachment.
- 🔘 **`getBoolean(options?, returnNullIfError?)`** — returns a boolean (interactions only).
- 1️⃣ **`getInteger(options?, returnNullIfError?)`** — returns an integer (interactions only).
- 🔢 **`getNumber(options?, returnNullIfError?)`** — returns a number (interactions only).
- 🔠 **`getString(options?, returnNullIfError?)`** — returns a string (interactions only).
- 🔗 **`getSubcommand(required?, returnNullIfError?)`** — returns the subcommand used (interactions only).
- ⛓️ **`getSubcommandGroup(required?, returnNullIfError?)`** — returns the subcommand group used (interactions only).

The return types and behavior (index vs. name, throw vs. `null`) are identical to those described in the `NoInitializer` section — the only difference is that the `context` is already embedded in the instance.

---

# [🖋️] CommandContext

`CommandContext` **extends `WithInitializer`**. That means it inherits every method described in section 3 (`reply`, `edit`, `delete`, `getUser`, `getString`, etc.) — for documentation on those methods, see the [`WithInitializer`](#withinitializer) section above.

What `CommandContext` adds are **properties (getters)** that expose data from the underlying context (`Message` or `ChatInputCommandInteraction`) in a unified way. When a property only exists on one of the two context types, it returns `null` (or `false`, for booleans) on the other.

| Property | Description |
|---|---|
| `id` | ID of the context (message or interaction). |
| `guild` | The `Guild` the context came from. |
| `guildId` | ID of the guild. |
| `channel` | The channel the context came from. |
| `channelId` | ID of the channel. |
| `member` | The guild member associated with the context. |
| `memberPermissions` | The member's permissions. Uses `context.memberPermissions` for interactions, `member?.permissions` for messages. |
| `deletable` | Whether the context can be deleted. Only true for messages (`context.deletable`); always `false` for interactions. |
| `applicationId` | The application (bot) ID. |
| `attachments` | The message's attachments. Messages only; `null` for interactions. |
| `content` | The message's raw text content. Messages only; `null` for interactions. |
| `cleanContent` | The message's "clean" content (mentions resolved). Messages only; `null` for interactions. |
| `client` | The discord.js `Client` instance. |
| `components` | The message's components (buttons, selects, etc.). Messages only; `null` for interactions. |
| `createdAt` | Creation date of the context. |
| `createdTimestamp` | Creation timestamp of the context. |
| `editedAt` | Date of the last edit. Messages only; `null` for interactions. |
| `editedTimestamp` | Timestamp of the last edit. Messages only; `null` for interactions. |
| `embeds` | The message's embeds. Messages only; `null` for interactions. |
| `mentions` | The message's mentions object. Messages only; `null` for interactions. |
| `reference` | Message reference (reply). Messages only; `null` for interactions. |
| `url` | The message's URL. Messages only; `null` for interactions. |
| `deferred` | Whether the interaction was deferred (`deferReply`). Only read for interactions (`context.deferred`); always `false` for messages. |
| `replied` | Whether the interaction has already been replied to. Only read for interactions (`context.replied`); always `false` for messages. |
| `type` | The context's type (`context.type`, from discord.js). |

---

# [⚙️] createCommandContext

A utility function that creates and returns a `CommandContext` instance from a `context` (`Message` or `ChatInputCommandInteraction`). It's simply a shortcut for `new CommandContext(context)`.

```ts
import { createCommandContext } from 'archangel.js';

client.on('messageCreate', (message) => {
    const ctx = createCommandContext(message);
    ctx.reply('Hello via prefix!');
});

client.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const ctx = createCommandContext(interaction);
    ctx.reply('Hello via slash!');
});
```

Since the same `ctx` (`CommandContext`) works for both event types, this is the recommended pattern for writing a command's logic **once** and reusing it for both the prefix and slash flows.

- **Parameter:** `context` — `Message | ChatInputCommandInteraction`.
- **Returns:** `CommandContext<T>` — the already-initialized instance, ready to use.
