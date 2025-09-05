import { User, Session } from "next-auth"

export interface ExtendedUser extends User {
    id: string
    tier?: string
}

export interface ExtendedSession extends Session {
    user: ExtendedUser
}

export interface AuthProvider {
    id: string
    name: string
    type: string
    signinUrl: string
    callbackUrl: string
}
