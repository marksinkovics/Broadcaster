const formatUserResult = (user) => {
    return {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
};

export default { formatUserResult };
