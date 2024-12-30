'use client'
import CreateBacSiForm from '@/components/admin/bac-si-management/createBacSiFrom'
import UpdateBacSiForm from '@/components/admin/bac-si-management/updateBacSiForm'
import CreateBenhForm from '@/components/admin/benh-management/createBenhFrom'
import UpdateBenhForm from '@/components/admin/benh-management/updateBenhFrom'
import UpdateBenhNhanForm from '@/components/admin/benh-nhan-management/updateBenhNhanForm'
import CreateThietLapForm from '@/components/admin/thiet-lap-management/createThietLapFrom'
import UpdateThietLapForm from '@/components/admin/thiet-lap-management/updateThietLapFrom'
import Wrapper from '@/components/wrapper'
import React, { createContext, useRef, useState } from 'react'
export const adminContext = createContext()

const AdminProvider = ({ children }) => {
    const [visibleCreateBacSiForm, setVisibleCreateBacSiForm] = useState(false)
    const [visibleCreateBenhForm, setVisibleCreateBenhForm] = useState(false)
    const [visibleCreateThietLapForm, setVisibleCreateThietLapForm] = useState(false)
    const [visibleWrapper, setVisibleWrapper] = useState(false)

    // update
    const [dataUpdateBacSi, setDataUpdateBacSi] = useState(undefined)
    const [dataUpdateBenh, setDataUpdateBenh] = useState(undefined)
    const [dataUpdateThietLap, setDataUpdateThietLap] = useState(undefined)
    const [dataUpdateBenhNhan, setDataUpdateBenhNhan] = useState(undefined)
    const showWrapper = () => {
        setVisibleWrapper(true)
    }

    const hiddenWrapper = () => {
        setVisibleWrapper(false)
        setVisibleCreateBacSiForm(false)
        setVisibleCreateBenhForm(false)
        setVisibleCreateThietLapForm(false)
        //update
        setDataUpdateBacSi(undefined)
        setDataUpdateBenh(undefined)
        setDataUpdateThietLap(undefined)
        setDataUpdateBenhNhan(undefined)
    }

    const showCreateThietlapForm = () => {
        showWrapper();
        setVisibleCreateThietLapForm(true)
    }

    const showUpdateThietLapForm = (data) => {
        showWrapper();
        setDataUpdateThietLap(data)
    }

    const showCreateBenhForm = () => {
        showWrapper();
        setVisibleCreateBenhForm(true)
    }
    const showUpdateBenhForm = (data) => {
        showWrapper();
        setDataUpdateBenh(data)
    }

    const showCreateBacSiForm = () => {
        showWrapper();
        setVisibleCreateBacSiForm(true)
    }
    const showUpdateBacSiForm = (data) => {
        showWrapper();
        setDataUpdateBacSi(data)
    }
    const showUpdateBenhNhanForm = (data) => {
        showWrapper();
        setDataUpdateBenhNhan(data)
    }
    const adminData = {
        visibleCreateBacSiForm,
        //update
        dataUpdateBacSi,
        dataUpdateBenhNhan,
    }

    const adminHandler = {
        showCreateBacSiForm,
        showCreateBenhForm,
        showCreateThietlapForm,
        //update
        showUpdateBacSiForm,
        showUpdateBenhForm,
        showUpdateThietLapForm,
        showUpdateBenhNhanForm,
        hiddenWrapper,
        

    }

    return (
        <adminContext.Provider value={{ adminData, adminHandler }}>
            {children}
            <Wrapper onClick={() => hiddenWrapper()} visible={visibleWrapper} />
            <CreateBacSiForm visible={visibleCreateBacSiForm} />
            <UpdateBacSiForm data={dataUpdateBacSi} />
            <CreateBenhForm visible={visibleCreateBenhForm} />
            <UpdateBenhForm data={dataUpdateBenh} />
            <CreateThietLapForm visible={visibleCreateThietLapForm} />
            <UpdateThietLapForm data={dataUpdateThietLap} />
            <UpdateBenhNhanForm data={dataUpdateBenhNhan} />
        </adminContext.Provider>
    )
}

export default AdminProvider