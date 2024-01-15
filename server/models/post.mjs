
export const PostCreationInputValidationSchema = {
    type: 'object',
    required: ['description'],
    properties: {
        description: {
            type: 'string',
            minLength: 1,
        },
    },
};
