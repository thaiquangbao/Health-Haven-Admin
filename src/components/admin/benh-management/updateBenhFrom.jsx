import { adminContext } from '@/context/adminContext'
import { globalContext, notifyType } from '@/context/globalContext'
import { TypeHTTP, api } from '@/utils/api'
import { dsKhoa } from '@/utils/chuyenKhoa'
import { ports } from '@/utils/routes'
import React, { useContext, useEffect, useRef, useState } from 'react'

const UpdateBenhForm = ({ data }) => {
    const { adminHandler } = useContext(adminContext)
    const { globalHandler } = useContext(globalContext)
    const [benh, setBenh] = useState(
        {
            title: '',
            description: ''
        }
    )

    useEffect(() => {
        setBenh(data)
    }, [data])
    const imgRef = useRef()

    const handleCreateBenh = () => {

        if (benh?.title === '') {
            globalHandler.notify(notifyType.WARNING, "Tên Bệnh Không Hợp Lệ")
            return
        }
        const body = {
            ...benh
        }
        globalHandler.notify(notifyType.LOADING, 'Đang Cập Nhật Bệnh Vào Hệ Thống')
        api({ body: body, path: '/sicks/update', sendToken: true, type: TypeHTTP.POST })
            .then(res => {
                const selectedFile = imgRef.current.files[0];
                if (selectedFile) {
                    const formData = new FormData()
                    formData.append('_id', res._id)
                    formData.append('image', selectedFile)
                    api({ sendToken: true, body: formData, type: TypeHTTP.POST, path: '/sicks/update-image' })
                        .then(res1 => {
                            adminHandler.hiddenWrapper()
                            globalHandler.notify(notifyType.SUCCESS, 'Đã Cập Nhật Bệnh Vào Hệ Thống')
                            globalHandler.reload()
                        })
                } else {
                    adminHandler.hiddenWrapper()
                    globalHandler.notify(notifyType.SUCCESS, 'Đã Cập Nhật Bệnh Vào Hệ Thống')
                    globalHandler.reload()
                }
            })
            .catch(error => {
                globalHandler.notify(notifyType.FAIL, error.message)
            })
    }

    return (
        <div style={data ? { width: '800px', height: 'auto', padding: '20px' } : { width: 0, height: 0, padding: 0 }} className='bg-[white] flex flex-col gap-2 z-50 fixed top-[50%] left-[50%] translate-x-[-50%] transition-all translate-y-[-50%] rounded-lg overflow-hidden'>
            <div className='flex gap-2 items-center w-full mb-2'>
                {/* <img src={image} width={'35px'} /> */}
                <span className='text-[19px] font-medium'>Thêm Bệnh</span>
            </div>
            <div className='flex justify-evenly mb-1'>
                <input value={benh?.title} onChange={e => setBenh({ ...benh, title: e.target.value })} placeholder='Tên Bệnh' className='w-[90%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
            </div>
            <div className='flex justify-evenly mb-1'>
                <textarea value={benh?.description} onChange={e => setBenh({ ...benh, description: e.target.value })} placeholder='Mô tả' className='w-[90%] text-[14px] focus:outline-0 px-[10px] border-[#c1c1c1] border-[1px] rounded-md h-[100px]' />
            </div>
            <div className='flex justify-evenly mb-1'>
                <input accept='.png, .jpg, .jpeg' className='w-[90%] text-[14px] focus:outline-0 px-[10px] rounded-md' ref={imgRef} type='file' />
            </div>
            <div className='flex justify-end gap-2 mb-1'>
                <button onClick={() => adminHandler.hiddenWrapper()} className='px-4 py-1 rounded-md text-[14px] bg-red-500 text-white'>Thoát </button>
                <button onClick={() => handleCreateBenh()} className='px-4 py-1 rounded-md text-[14px] bg-blue-500 text-white'>Cập Nhật</button>
            </div>
        </div>
    )
}

export default UpdateBenhForm