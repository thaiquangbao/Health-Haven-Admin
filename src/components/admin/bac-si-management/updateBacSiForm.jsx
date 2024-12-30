import { adminContext } from '@/context/adminContext'
import { globalContext, notifyType } from '@/context/globalContext'
import { TypeHTTP, api } from '@/utils/api'
import { dsKhoa } from '@/utils/chuyenKhoa'
import { ports } from '@/utils/routes'
import React, { useContext, useEffect, useState } from 'react'

const UpdateBacSiForm = ({ data }) => {
    const { adminHandler } = useContext(adminContext)
    const { globalHandler } = useContext(globalContext)
    const [bacSi, setBacSi] = useState()

    useEffect(() => {
        setBacSi(data)
    }, [data])

    const handleUpdateBacSi = () => {

        if (!/^[A-ZÀ-Ỹ][a-zà-ỹ]+(\s[A-ZÀ-Ỹ][a-zà-ỹ]+)+$/.test(bacSi?.fullName)) {
            globalHandler.notify(notifyType.WARNING, "Họ Tên Không Hợp Lệ")
            return
        }
        if (!bacSi?.dateOfBirth || new Date().getFullYear() - new Date(bacSi?.dateOfBirth).getFullYear() - (new Date().getMonth() < new Date(bacSi?.dateOfBirth).getMonth() || (new Date().getMonth() === new Date(bacSi?.dateOfBirth).getMonth() && new Date().getDate() < new Date(bacSi?.dateOfBirth).getDate())) < 22) {
            globalHandler.notify(notifyType.WARNING, 'Năm Sinh Phải Trên 22 Tuổi');
            return;
        }

        if (!/^\d{10}$/.test(bacSi?.phone)) {
            globalHandler.notify(notifyType.WARNING, 'Số Điện Thoại Không Hợp Lệ')
            return
        }
        if (bacSi?.sex === null) {
            globalHandler.notify(notifyType.WARNING, 'Giới Tính Không Hợp Lệ')
            return
        }
        if (bacSi?.address === '') {
            globalHandler.notify(notifyType.WARNING, 'Địa Chỉ Không Hợp Lệ')
            return
        }
        if (!bacSi?.specialize) {
            globalHandler.notify(notifyType.WARNING, 'Chuyên Khoa Không Hợp Lệ')
            return
        }
        globalHandler.notify(notifyType.LOADING, 'Đang Cập Nhật Bác Sĩ Vào Hệ Thống')
        api({ body: { ...bacSi }, path: '/auth/update/doctor', sendToken: true, type: TypeHTTP.POST })
            .then(res => {
                adminHandler.hiddenWrapper()
                globalHandler.notify(notifyType.SUCCESS, 'Đã Cập Nhật Bác Sĩ Vào Hệ Thống')
                globalHandler.reload()

            })
            .catch(error => {
                globalHandler.notify(notifyType.FAIL, error.message)
            })
    }

    return (
        <div style={data ? { width: '800px', height: 'auto', padding: '20px' } : { width: 0, height: 0, padding: 0 }} className='bg-[white] flex flex-col gap-2 z-50 fixed top-[50%] left-[50%] translate-x-[-50%] transition-all translate-y-[-50%] rounded-lg overflow-hidden'>
            <div className='flex gap-2 items-center w-full mb-2'>
                <span className='text-[19px] font-medium'>Cập Nhật Thông Tin Bác Sĩ</span>
            </div>
            <div className='flex justify-evenly mb-1'>
                <input value={bacSi?.fullName} onChange={e => setBacSi({ ...bacSi, fullName: e.target.value })} placeholder='Họ tên' className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
                <input value={bacSi?.phone} onChange={e => setBacSi({ ...bacSi, phone: e.target.value })} placeholder='Số điện thoại' className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
            </div>
            <div className='flex justify-evenly mb-1'>
                <select value={bacSi?.sex === true ? 'Nam' : 'Nữ'} onChange={e => setBacSi({ ...bacSi, sex: e.target.value === 'Nam' ? true : false })} className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                    <option value=''>Giới tính</option>
                    <option value='Nam'>Nam</option>
                    <option value='Nữ'>Nữ</option>
                </select>
                <input value={bacSi?.address} onChange={e => setBacSi({ ...bacSi, address: e.target.value })} placeholder='Địa chỉ' className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
            </div>
            <div className='flex justify-evenly mb-1'>
                <input value={bacSi?.dateOfBirth} onChange={e => setBacSi({ ...bacSi, dateOfBirth: e.target.value })} placeholder='Ngày sinh' type="date" className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
                <select value={bacSi?.specialize} onChange={e => setBacSi({ ...bacSi, specialize: e.target.value })} className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                    <option value=''>Chuyên Khoa</option>
                    {dsKhoa.map((khoa, index) => (
                        <option value={khoa} key={index}>{khoa}</option>
                    ))}
                </select>
            </div>
            <div className='flex justify-end gap-2 mb-1'>
                <button onClick={() => adminHandler.hiddenWrapper()} className='px-4 py-1 rounded-md text-[14px] bg-red-500 text-white'>Thoát </button>
                <button onClick={() => handleUpdateBacSi()} className='px-4 py-1 rounded-md text-[14px] bg-blue-500 text-white'>Cập Nhật</button>
            </div>
        </div>
    )
}

export default UpdateBacSiForm