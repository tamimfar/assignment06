export interface RegisterInput {
    name:string,
    email:string,
    password:string,
    phone:string,
    role:string,
    status:string,
    authProvider:string,
    emailVerified:boolean

}
export interface LoginInput {
    email:string,
    password:string
}

export interface IGoogleLoginPayload {
     idToken:string;
}