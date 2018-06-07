const sampleLoginState = {
   name: '',
   isGuest: false,
   isAdmin: false
};

export const login = (username, isGuest, isAdmin) => ({
   type: 'LOGIN',
   loginState: {username, isGuest, isAdmin}
});

export const logout = () => ({
   type: 'LOGOUT'
})

