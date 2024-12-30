'use client'
import ListForum from '@/components/admin/forum-management/listForum'
import Header from '@/components/header'
import Navbar from '@/components/menu/navbar'
import { adminContext } from '@/context/adminContext'
import { globalContext } from '@/context/globalContext'
import { TypeHTTP, api } from '@/utils/api'
import { ports } from '@/utils/routes'
import React, { useContext, useEffect, useState } from 'react'

const ForumManagement = () => {
    const [dsForum, setDsForum] = useState([])
    const { adminData, adminHandler } = useContext(adminContext)
    const { globalHandler } = useContext(globalContext)

    useEffect(() => {
        api({ path: '/forums/get-all', sendToken: false, type: TypeHTTP.GET })
            .then(res => {
                setDsForum(res)
            })
    }, [])

    return (
        <section className='h-screen w-full flex z-0'>
            <Navbar />
            <div className='w-full h-screen relative pl-[20px] pr-[250px] pb-[10px] flex flex-col gap-3'>
                <Header image={'/calendar.png'} text={'Quản Lý Cẩm Nang'} />
                <ListForum dsForum={dsForum} />
                {/* <button onClick={() => adminHandler.showCreateBacSiForm()} className='fixed px-4 py-1 rounded-md top-4 right-3 text-[14px] bg-[green] text-[white]'>+ Thêm Bác Sĩ</button> */}
            </div>
        </section>
    )
}

export default ForumManagement