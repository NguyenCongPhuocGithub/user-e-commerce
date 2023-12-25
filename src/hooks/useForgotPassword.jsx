import { create } from 'zustand';

const useForgotPassword = create((set) => ({
    forgotPassword: {
        flag: true,
        email: ""
    },
    setForgotPassword: (newForgotPassword) => set((prevState) => ({forgotPassword: { ...prevState.forgotPassword, ...newForgotPassword } })),
}));


export default useForgotPassword;