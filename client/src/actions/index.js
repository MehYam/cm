const sampleLoginState = {
   name: '',
   isGuest: false,
   isAdmin: false
};

export const login = (name, isGuest, isAdmin) => ({
   type: 'LOGIN',
   loginState: {name, isGuest, isAdmin}
});

export const logout = () => ({
   type: 'LOGOUT'
})

