'use client'
import ListBacSi from '@/components/admin/bac-si-management/listBacSi'
import Header from '@/components/header'
import Navbar from '@/components/menu/navbar'
import { adminContext } from '@/context/adminContext'
import { globalContext } from '@/context/globalContext'
import { TypeHTTP, api } from '@/utils/api'
import { ports } from '@/utils/routes'
import React, { useContext, useEffect, useState } from 'react'

const BacSiManagement = () => {
    const [dsBacSi, setDsBacSi] = useState([])
    const { adminData, adminHandler } = useContext(adminContext)
    const { globalHandler } = useContext(globalContext)

    useEffect(() => {
        api({ path: '/auth/all/doctor', sendToken: true, type: TypeHTTP.GET })
            .then(res => {
                setDsBacSi(res)
            })
    }, [])

    return (
        <section className='h-screen w-full flex z-0'>
            <Navbar />
            <div className='w-full h-screen relative pl-[20px] pr-[250px] pb-[10px] flex flex-col gap-3'>
                <Header image={'/calendar.png'} text={'Quản Lý Bác Sĩ'} />
                <ListBacSi dsBacSi={dsBacSi} />
                <button onClick={() => adminHandler.showCreateBacSiForm()} className='fixed px-4 py-1 rounded-md top-4 right-3 text-[14px] bg-[green] text-[white]'>+ Thêm Bác Sĩ</button>
            </div>
        </section>
    )
}

export default BacSiManagement