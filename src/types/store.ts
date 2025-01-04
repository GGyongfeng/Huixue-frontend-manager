// 用户详细信息接口
export interface UserDetailInfo {
    id: number | null
    username: string
    password: string
    role: string
    created_at: string
    resignation_time: string | null
    city: string
    is_deleted: boolean | null
    avatar_url: string | null
    realname: string | null
    nick_name: string | null
    email: string | null
    mobile: string | null
    address: string | null
    gender: string | null
    description: string | null
    education: string | null
    tags: string | null
}

// 用户信息接口
export interface UserInfo {
    id?: number
    name?: string
    username?: string
    avatar?: string
    role?: string
    city?: string
    token?: string
    userInfo?: UserDetailInfo
} 