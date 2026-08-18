export const invalidContextError = new Error(
    'Context must be a Message, ChatInputCommandInteraction or ContextMenuCommandInteraction',
);
export const invalidNameOptionError = new Error(
    "Invalid option 'name': expected a string",
);
export const contextDontHaveOptions = new Error(
    'The ContextMenu interaction does not have options',
);
