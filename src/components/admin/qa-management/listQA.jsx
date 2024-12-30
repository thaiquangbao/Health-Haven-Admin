import { adminContext } from '@/context/adminContext'
import { globalContext, notifyType } from '@/context/globalContext'
import { TypeHTTP, api } from '@/utils/api'
import { convertISODateToString } from '@/utils/others'
import { ports } from '@/utils/routes'
import { useRouter } from "next/navigation"
import React, { useContext } from 'react'
const ListQA = ({ dsQA }) => {

    const { globalHandler } = useContext(globalContext)
    const { adminHandler } = useContext(adminContext)
    const router = useRouter()
    const handleDeleteQA = (id) => {
        globalHandler.notify(notifyType.LOADING, "Đang Xóa QA")
        api({ type: TypeHTTP.DELETE, sendToken: true, path: `/qas/delete-one/${id}` })
            .then(res => {
                globalHandler.notify(notifyType.SUCCESS, "Xóa QA Thành Công")
                globalHandler.reload()
            })
    }

    return (
        <div className='w-full h-[90%] overflow-auto mt-2'>
            <table className="text-sm text-[15px] text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="sticky top-0 left-0 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Tác giả
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Tiêu đề
                        </th>
                        <th scope="col" className="px-6 py-3 ">
                            Nội dung câu hỏi
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Loại bệnh
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Lượt xem
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Lượt thích
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Lượt bình luận
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Thời gian
                        </th>
                        <th scope="col" className="px-8 py-3">
                            Các Thao Tác
                        </th>
                    </tr>
                </thead>
                <tbody className=' bg-black'>
                    {dsQA.map((qa, index) => (
                        <tr key={index} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap">{qa?.patient?.fullName}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{qa.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap ">{qa.content}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{qa.category}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{qa.views}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{qa.like?.length}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{qa.comment}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{qa.date?.day}-{qa.date?.month}-{qa.date?.year}</td>
                            <td className="px-8 py-4 flex items-center gap-1">
                                <button onClick={() => router.push(`https://health-care-fe-two.vercel.app/chi-tiet-cau-hoi/${qa._id}`)} className='px-4 py-1 rounded-md text-[14px] bg-[blue] text-white w-[100px]'>Chi tiết</button>
                                <button onClick={() => handleDeleteQA(qa._id)} className='px-4 py-1 rounded-md text-[14px] bg-[red] text-white'>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ListQA