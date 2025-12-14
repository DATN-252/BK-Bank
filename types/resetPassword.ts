

export interface ForgotPasswordType {
    phone: string;
    citizenId: string;
    dateExp: Date;
};

export interface ResetPasswordType {
    password: string;
    confirmPassword: string;
};