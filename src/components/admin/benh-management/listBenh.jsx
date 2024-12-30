import { adminContext } from '@/context/adminContext'
import { globalContext, notifyType } from '@/context/globalContext'
import { TypeHTTP, api } from '@/utils/api'
import { convertISODateToString } from '@/utils/others'
import { ports } from '@/utils/routes'
import React, { useContext } from 'react'

const ListBenh = ({ dsBenh }) => {

    const { globalHandler } = useContext(globalContext)
    const { adminHandler } = useContext(adminContext)

    const handleDeleteBenh = (id) => {
        globalHandler.notify(notifyType.LOADING, "Đang Xóa Bệnh")
        api({ type: TypeHTTP.DELETE, sendToken: true, path: `/sicks/deleteOne/${id}` })
            .then(res => {
                globalHandler.notify(notifyType.SUCCESS, "Xóa Bệnh Thành Công")
                globalHandler.reload()
            })
    }

    return (
        <div className='w-full h-[90%] overflow-auto mt-2'>
            <table className="text-sm w-[100%] text-[15px] text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="sticky top-0 left-0 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Ảnh
                        </th>
                        <th scope="col" className="px-6 py-3 w-[15%]">
                            Tên Bệnh
                        </th>
                        <th scope="col" className="px-6 py-3 w-[70%]">
                            Mô tả
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Các Thao Tác
                        </th>
                    </tr>
                </thead>
                <tbody className=' bg-black'>
                    {dsBenh.map((benh, index) => (
                        <tr key={index} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                            <td className="px-6 py-4 "><img src={benh.image} className='rounded-full w-[40px] aspect-square' /></td>
                            <td className="px-6 py-4 ">{benh.title}</td>
                            <td className="px-6 py-4">{benh.description}</td>
                            <td className="px-6 py-4 flex items-center gap-1">
                                <button onClick={() => adminHandler.showUpdateBenhForm(benh)} className='px-4 py-1 rounded-md text-[14px] bg-[blue] text-white'>Sửa</button>
                                <button onClick={() => handleDeleteBenh(benh._id)} className='px-4 py-1 rounded-md text-[14px] bg-[red] text-white'>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ListBenh