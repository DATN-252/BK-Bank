

export interface ForgotPasswordType {
    phone: string;
    citizenId: string;
    dateExp: string;
};

export interface ResetPasswordType {
    password: string;
    confirmPassword: string;
};