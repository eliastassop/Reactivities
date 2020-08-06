// contains the properties of what we receive back from the server
export interface IUser {
    username: string;
    displayName: string;
    //token : string;
    image?: string;
    token: string;
}

export interface IuserFormValues {
    email: string;
    password: string;
    displayName?: string;
    username?: string;
}