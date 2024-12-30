import { adminContext } from '@/context/adminContext'
import { globalContext, notifyType } from '@/context/globalContext'
import { TypeHTTP, api } from '@/utils/api'
import { dsKhoa } from '@/utils/chuyenKhoa'
import { ports } from '@/utils/routes'
import React, { useContext, useEffect, useState } from 'react'

const CreateBacSiForm = ({ visible }) => {
    const { adminHandler } = useContext(adminContext)
    const { globalHandler } = useContext(globalContext)
    const [bacSi, setBacSi] = useState(
        {
            hoTen: '',
            ngaySinh: null,
            soDienThoai: '',
            gioiTinh: null,
            diaChi: '',
            khoa: ''
        }
    )

    const handleCreateBacSi = () => {

        if (!/^[A-ZÀ-Ỹ][a-zà-ỹ]+(\s[A-ZÀ-Ỹ][a-zà-ỹ]+)+$/.test(bacSi.hoTen)) {
            globalHandler.notify(notifyType.WARNING, "Họ Tên Không Hợp Lệ")
            return
        }
        if (!bacSi.ngaySinh || new Date().getFullYear() - new Date(bacSi.ngaySinh).getFullYear() - (new Date().getMonth() < new Date(bacSi.ngaySinh).getMonth() || (new Date().getMonth() === new Date(bacSi.ngaySinh).getMonth() && new Date().getDate() < new Date(bacSi.ngaySinh).getDate())) < 22) {
            globalHandler.notify(notifyType.WARNING, 'Năm Sinh Phải Trên 22 Tuổi');
            return;
        }

        if (!/^\d{10}$/.test(bacSi.soDienThoai)) {
            globalHandler.notify(notifyType.WARNING, 'Số Điện Thoại Không Hợp Lệ')
            return
        }
        if (bacSi.gioiTinh === null) {
            globalHandler.notify(notifyType.WARNING, 'Giới Tính Không Hợp Lệ')
            return
        }
        if (bacSi.diaChi === '') {
            globalHandler.notify(notifyType.WARNING, 'Địa Chỉ Không Hợp Lệ')
            return
        }
        if (!bacSi.khoa || bacSi.khoa.maKhoa === '') {
            globalHandler.notify(notifyType.WARNING, 'Chuyên Khoa Không Hợp Lệ')
            return
        }
        const body = {
            fullName: bacSi.hoTen,
            address: bacSi.diaChi,
            passWord: '123456',
            email: null,
            sex: bacSi.gioiTinh,
            phone: bacSi.soDienThoai,
            dateOfBirth: bacSi.ngaySinh,
            specialize: bacSi.khoa
        }
        globalHandler.notify(notifyType.LOADING, 'Đang Thêm Bác Sĩ Vào Hệ Thống')
        api({ body: body, path: '/auth/create-doctor', sendToken: true, type: TypeHTTP.POST })
            .then(res => {
                adminHandler.hiddenWrapper()
                globalHandler.notify(notifyType.SUCCESS, 'Đã Thêm Bác Sĩ Vào Hệ Thống')
                globalHandler.reload()

            })
            .catch(error => {
                globalHandler.notify(notifyType.FAIL, error.message)
            })
    }

    return (
        <div style={visible ? { width: '800px', height: 'auto', padding: '20px' } : { width: 0, height: 0, padding: 0 }} className='bg-[white] flex flex-col gap-2 z-50 fixed top-[50%] left-[50%] translate-x-[-50%] transition-all translate-y-[-50%] rounded-lg overflow-hidden'>
            <div className='flex gap-2 items-center w-full mb-2'>
                {/* <img src={image} width={'35px'} /> */}
                <span className='text-[19px] font-medium'>Thêm Bác Sĩ</span>
            </div>
            <div className='flex justify-evenly mb-1'>
                <input value={bacSi.hoTen} onChange={e => setBacSi({ ...bacSi, hoTen: e.target.value })} placeholder='Họ tên' className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
                <input value={bacSi.soDienThoai} onChange={e => setBacSi({ ...bacSi, soDienThoai: e.target.value })} placeholder='Số điện thoại' className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
            </div>
            <div className='flex justify-evenly mb-1'>
                <select onChange={e => setBacSi({ ...bacSi, gioiTinh: e.target.value === 'Nam' ? true : false })} className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                    <option value=''>Giới tính</option>
                    <option value='Nam'>Nam</option>
                    <option value='Nữ'>Nữ</option>
                </select>
                <input value={bacSi.diaChi} onChange={e => setBacSi({ ...bacSi, diaChi: e.target.value })} placeholder='Địa chỉ' className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
            </div>
            <div className='flex justify-evenly mb-1'>
                <input value={bacSi.ngaySinh} onChange={e => setBacSi({ ...bacSi, ngaySinh: e.target.value })} placeholder='Ngày sinh' type="date" className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
                <select onChange={e => setBacSi({ ...bacSi, khoa: e.target.value })} className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                    <option value=''>Chuyên Khoa</option>
                    {dsKhoa.map((khoa, index) => (
                        <option value={khoa} key={index}>{khoa}</option>
                    ))}
                </select>
            </div>
            <div className='flex justify-end gap-2 mb-1'>
                <button onClick={() => adminHandler.hiddenWrapper()} className='px-4 py-1 rounded-md text-[14px] bg-red-500 text-white'>Thoát </button>
                <button onClick={() => handleCreateBacSi()} className='px-4 py-1 rounded-md text-[14px] bg-green-500 text-white'>Thêm </button>
            </div>
        </div>
    )
}

export default CreateBacSiForm