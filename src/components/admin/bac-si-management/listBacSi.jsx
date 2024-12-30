import { adminContext } from '@/context/adminContext'
import { globalContext, notifyType } from '@/context/globalContext'
import { TypeHTTP, api } from '@/utils/api'
import { convertISODateToString } from '@/utils/others'
import { ports } from '@/utils/routes'
import React, { useContext } from 'react'

const ListBacSi = ({ dsBacSi }) => {

    const { globalHandler } = useContext(globalContext)
    const { adminHandler } = useContext(adminContext)

    const handleDeleteBacSi = (id) => {
        globalHandler.notify(notifyType.LOADING, "Đang Xóa Bác Sĩ")
        api({ type: TypeHTTP.DELETE, sendToken: true, path: `/auth/delete/one-doctor/${id}` })
            .then(res => {
                globalHandler.notify(notifyType.SUCCESS, "Xóa Bác Sĩ Thành Công")
                globalHandler.reload()
            })
    }

    return (
        <div className='w-full h-[90%] overflow-auto mt-2'>
            <table className="text-sm text-[15px] text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="sticky top-0 left-0 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Họ và tên
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Ngày sinh
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Số Điện Thoại
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Giới tính
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Email
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Địa chỉ
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Khoa
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Các Thao Tác
                        </th>
                    </tr>
                </thead>
                <tbody className=' bg-black'>
                    {dsBacSi.map((bacSi, index) => (
                        <tr key={index} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap">{bacSi.fullName}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{convertISODateToString(bacSi.dateOfBirth)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{bacSi.phone}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{bacSi.sex === true ? "Nam" : "Nữ"}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{bacSi.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{bacSi.address}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{bacSi.specialize}</td>
                            <td className="px-6 py-4 flex items-center gap-1">
                                <button onClick={() => adminHandler.showUpdateBacSiForm(bacSi)} className='px-4 py-1 rounded-md text-[14px] bg-[blue] text-white'>Sửa</button>
                                <button onClick={() => handleDeleteBacSi(bacSi._id)} className='px-4 py-1 rounded-md text-[14px] bg-[red] text-white'>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ListBacSi