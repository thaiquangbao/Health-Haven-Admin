'use client'
import ListBacSi from '@/components/admin/bac-si-management/listBacSi'
import ListBenh from '@/components/admin/benh-management/listBenh'
import Header from '@/components/header'
import Navbar from '@/components/menu/navbar'
import { adminContext } from '@/context/adminContext'
import { globalContext } from '@/context/globalContext'
import { TypeHTTP, api } from '@/utils/api'
import { ports } from '@/utils/routes'
import React, { useContext, useEffect, useState } from 'react'

const CuocHenManagement = () => {
    const { adminData, adminHandler } = useContext(adminContext)
    const { globalHandler } = useContext(globalContext)
    const [dsBenh, setDsBenh] = useState([])

    useEffect(() => {
        api({ path: '/sicks/get-all', sendToken: false, type: TypeHTTP.GET })
            .then(res => {
                setDsBenh(res)
            })
    }, [])

    return (
        <section className='h-screen w-full flex z-0'>
            <Navbar />
            <div className='w-full h-screen relative pl-[20px] pb-[10px] flex flex-col gap-3'>
                <Header image={'/calendar.png'} text={'Quản Lý Bệnh'} />
                {/* <ListBacSi dsBacSi={dsBacSi} /> */}
                <ListBenh dsBenh={dsBenh} />
                <button onClick={() => adminHandler.showCreateBenhForm()} className='fixed px-4 py-1 rounded-md top-4 right-3 text-[14px] bg-[green] text-[white]'>+ Thêm Bệnh</button>
            </div>
        </section>
    )
}

export default CuocHenManagement