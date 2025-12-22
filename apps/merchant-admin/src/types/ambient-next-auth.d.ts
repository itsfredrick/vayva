declare module 'next-auth';
declare module 'next-auth/jwt';
declare module '@vayva/schemas' {
    export type LoginRequest = any;
    export type SignupRequest = any;
    export type ForgotPasswordRequest = any;
    export type ResetPasswordRequest = any;
}
