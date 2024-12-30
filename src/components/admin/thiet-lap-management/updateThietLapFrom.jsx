import { adminContext } from '@/context/adminContext'
import { globalContext, notifyType } from '@/context/globalContext'
import { TypeHTTP, api } from '@/utils/api'
import { dsKhoa } from '@/utils/chuyenKhoa'
import { ports } from '@/utils/routes'
import React, { useContext, useEffect, useRef, useState } from 'react'

const UpdateThietLapForm = ({ data }) => {
    const { adminHandler } = useContext(adminContext)
    const { globalHandler } = useContext(globalContext)
    const times = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
    const [thietLap, setThietLap] = useState(
        {
            // from: 0,
            // to: 0,
            // pathological: '',
            type: '',
            price: 0
        }
    )
    const [dsBenh, setDsBenh] = useState([])
    useEffect(() => {
        api({ path: '/sicks/get-all', sendToken: false, type: TypeHTTP.GET })
            .then(res => {
                setDsBenh(res)
            })
    }, [])

    useEffect(() => {
        setThietLap(data)
    }, [data])

    const handleUpdateThietLap = () => {

        // if (benh.title === '') {
        //     globalHandler.notify(notifyType.WARNING, "Tên Bệnh Không Hợp Lệ")
        //     return
        // }
        const body = {
            ...thietLap
        }
        globalHandler.notify(notifyType.LOADING, 'Đang Thiết Lập')
        api({ body: body, path: '/price-lists/update', sendToken: true, type: TypeHTTP.POST })
            .then(res => {
                adminHandler.hiddenWrapper()
                globalHandler.notify(notifyType.SUCCESS, 'Thiết Lập Thành Công')
                globalHandler.reload()
            })
            .catch(error => {
                globalHandler.notify(notifyType.FAIL, error.message)
            })
    }

    return (
        <div style={data ? { width: '800px', height: 'auto', padding: '20px' } : { width: 0, height: 0, padding: 0 }} className='bg-[white] flex flex-col gap-2 z-50 fixed top-[50%] left-[50%] translate-x-[-50%] transition-all translate-y-[-50%] rounded-lg overflow-hidden'>
            <div className='flex gap-2 items-center w-full mb-2'>
                {/* <img src={image} width={'35px'} /> */}
                <span className='text-[19px] font-medium'>Cập Nhật Thiết Lập</span>
            </div>
            {/* <div className='flex justify-evenly mb-1'>
                <select value={thietLap?.from + ''} onChange={e => setThietLap({ ...thietLap, from: Number(e.target.value) })} className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                    <option value=''>Thời Gian Bắt Đầu (H)</option>
                    {times.map((time, index) => (
                        <option value={time} key={index}>{time}</option>
                    ))}
                </select>
                <select value={thietLap?.to + ''} onChange={e => setThietLap({ ...thietLap, to: Number(e.target.value) })} className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                    <option value=''>Thời Gian Kết Thúc (H)</option>
                    {times.map((time, index) => (
                        <option value={time} key={index}>{time}</option>
                    ))}
                </select>
            </div> */}
            {/* <div className='flex justify-evenly mb-1'>
                <select value={thietLap?.pathological._id} onChange={e => setThietLap({ ...thietLap, pathological: e.target.value })} className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                    <option value=''>Chọn Bệnh</option>
                    {dsBenh.map((benh, index) => (
                        <option value={benh._id} key={index}>{benh.title}</option>
                    ))}
                </select>
            </div> */}
            <div className='flex justify-evenly mb-1'>
                <select value={thietLap?.type} onChange={e => setThietLap({ ...thietLap, type: e.target.value })} className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md'>
                    <option value=''>Phương Thức Khám</option>
                    <option value='Online'>Online</option>
                    <option value='Offline'>Offline</option>
                    {/* {dsBenh.map((benh, index) => (
                        <option value={benh._id} key={index}>{benh.title}</option>
                    ))} */}
                </select>
                <input value={thietLap?.price} onChange={e => setThietLap({ ...thietLap, price: e.target.value })} placeholder='Giá Tiền' className='w-[45%] text-[14px] focus:outline-0 px-[10px] h-[35px] border-[#c1c1c1] border-[1px] rounded-md' />
            </div>
            <div className='flex justify-end gap-2 mb-1'>
                <button onClick={() => adminHandler.hiddenWrapper()} className='px-4 py-1 rounded-md text-[14px] bg-red-500 text-white'>Thoát </button>
                <button onClick={() => handleUpdateThietLap()} className='px-4 py-1 rounded-md text-[14px] bg-[blue] text-white'>Cập Nhật</button>
            </div>
        </div>
    )
}

export default UpdateThietLapForm