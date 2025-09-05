import { User } from "next-auth"

export interface ExtendedUser extends User {
    id: string
    tier?: string
}

export interface ExtendedSession {
    user: ExtendedUser
}

export interface AuthProvider {
    id: string
    name: string
    type: string
    signinUrl: string
    callbackUrl: string
}
