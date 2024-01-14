const formatUserResult = (user) => {
    return {
        id: user._id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
};

export default { formatUserResult };
