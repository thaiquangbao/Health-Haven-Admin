import { adminContext } from '@/context/adminContext'
import { globalContext, notifyType } from '@/context/globalContext'
import { TypeHTTP, api } from '@/utils/api'
import { chuyen_doi_tien_VND, convertISODateToString } from '@/utils/others'
import { ports } from '@/utils/routes'
import React, { useContext } from 'react'

const ListThietLap = ({ dsThietLap }) => {

    const { globalHandler } = useContext(globalContext)
    const { adminHandler } = useContext(adminContext)

    const handleDeleteThietLap = (id) => {
        globalHandler.notify(notifyType.LOADING, "Đang Xóa Thiết Lập")
        api({ type: TypeHTTP.DELETE, sendToken: true, path: `/price-lists/delete/${id}` })
            .then(res => {
                globalHandler.notify(notifyType.SUCCESS, "Xóa Thiết Lập Thành Công")
                globalHandler.reload()
            })
    }

    return (
        <div className='w-full h-[90%] overflow-auto mt-2'>
            <table className="text-sm w-[100%] text-[15px] text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="sticky top-0 left-0 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        {/* <th scope="col" className="px-6 py-3">
                            Loại Khám
                        </th> */}
                        <th scope="col" className="px-6 py-3">
                            Phương Thức Khám
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Giá Tiền
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Các Thao Tác
                        </th>
                    </tr>
                </thead>
                <tbody className='bg-black'>
                    {dsThietLap.map((thietLap, index) => (
                        <tr key={index} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                            {/* <td className="px-6 py-4 ">{`${thietLap?.from}:00 -> ${thietLap?.to}:00`}</td> */}
                            {/* <td className="px-6 py-4 ">{thietLap?.pathological.title}</td> */}
                            <td className="px-6 py-4">{thietLap?.type}</td>
                            <td className="px-6 py-4">{chuyen_doi_tien_VND(thietLap?.price)}</td>
                            <td className="px-6 py-4 flex items-center gap-1">
                                <button onClick={() => adminHandler.showUpdateThietLapForm(thietLap)} className='px-4 py-1 rounded-md text-[14px] bg-[blue] text-white'>Sửa</button>
                                <button onClick={() => handleDeleteThietLap(thietLap?._id)} className='px-4 py-1 rounded-md text-[14px] bg-[red] text-white'>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ListThietLap