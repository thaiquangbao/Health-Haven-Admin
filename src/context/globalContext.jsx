'use client'
const { createContext } = require("react");
import Notification from '@/components/notification';
import { TypeHTTP, api } from '@/utils/api';
import { ports } from '@/utils/routes';
import { usePathname, useRouter } from 'next/navigation';

import React, { useEffect, useState } from 'react'
export const globalContext = createContext();

export const notifyType = {
    SUCCESS: 'success',
    FAIL: 'fail',
    WARNING: 'warning',
    LOADING: 'loading',
    NONE: 'none'
}

const GlobalProvider = ({ children }) => {
    const [user, setUser] = useState()
    const [info, setInfo] = useState({ status: notifyType.NONE, message: '' })
    const pathname = usePathname()
    const router = useRouter()

    useEffect(() => {
        if (info.status !== notifyType.NONE) {
            if (info.status !== notifyType.LOADING) {
                setTimeout(() => {
                    setInfo({ status: notifyType.NONE, message: '' })
                }, 3000);
            }
        }
    }, [info.status])

    const notify = (status, message) => setInfo({ status, message })

    useEffect(() => {
        api({ type: TypeHTTP.GET, sendToken: true, path: '/auth/userByToken' })
            .then(user => {
                setUser(user)
                if (pathname === '/') {
                    router.push('/quan-ly-bac-si')
                }
            })
            .catch((error) => {
                globalThis.localStorage.removeItem('accessToken')
                globalThis.localStorage.removeItem('refreshToken')
                router.push('/')
            })
    }, [pathname])

    const reload = () => {
        setTimeout(() => {
            globalThis.window.location.reload()
        }, 1000);
    }

    const data = {
        user, info
    }

    const handler = {
        setUser,
        notify,
        reload
    }

    return (
        <globalContext.Provider value={{ globalData: data, globalHandler: handler }}>
            <div className='z-40'>
                {children}
            </div>
            <Notification status={info.status} message={info.message} setInfomation={setInfo} />
        </globalContext.Provider>
    )
}

export default GlobalProvider