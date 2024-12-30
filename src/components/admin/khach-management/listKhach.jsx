import { adminContext } from "@/context/adminContext";
import { globalContext, notifyType } from "@/context/globalContext";
import { TypeHTTP, api } from "@/utils/api";
import { convertISODateToString } from "@/utils/others";
import { ports } from "@/utils/routes";
import React, { useContext, useEffect, useState } from "react";

const ListKhach = ({ dsBenhNhan }) => {
  const [appointments, setAppointments] = useState([]);
  const [healthLogBooks, setHealthLogBooks] = useState([]);
  const [appointmentHomes, setAppointmentHomes] = useState([]);
  const { globalHandler } = useContext(globalContext);
  const { adminHandler } = useContext(adminContext);
  useEffect(() => {
    api({
      path: "/appointments/getAll",
      sendToken: false,
      type: TypeHTTP.GET,
    }).then((res) => {
      setAppointments(res);
    });
    // api({
    //   path: "/healthLogBooks/get-all",
    //   sendToken: true,
    //   type: TypeHTTP.GET,
    // }).then((res) => {
    //   setHealthLogBooks(res);
    // });
    // api({
    //   path: "/appointmentHomes/getAll",
    //   sendToken: true,
    //   type: TypeHTTP.GET,
    // }).then((res) => {
    //   setAppointmentHomes(res);
    // });
  }, []);
  const handleDeleteBenhNhan = (id) => {
    globalHandler.notify(notifyType.LOADING, "Đang Xóa Khách Vãn Lai");
    api({
      type: TypeHTTP.DELETE,
      sendToken: true,
      path: `/customers/delete-one/${id}`,
    })
      .then((res) => {
        globalHandler.notify(
          notifyType.SUCCESS,
          "Xóa Khách Vãn Lai Thành Công"
        );
        globalHandler.reload();
      })
      .catch((err) => {
        globalHandler.notify(notifyType.ERROR, err.message);
      });
  };

  return (
    <div className="w-full h-[90%] overflow-auto mt-2">
      <table className="text-sm w-[100%] text-[15px] text-left rtl:text-right text-gray-500 dark:text-gray-400">
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
              Căn cước công dân
            </th>
            <th scope="col" className="px-6 py-3">
              Hẹn khám online
            </th>
            <th scope="col" className="px-6 py-3">
              Các Thao Tác
            </th>
          </tr>
        </thead>
        <tbody className=" bg-black">
          {dsBenhNhan.map((benhnhan, index) => (
            <tr
              key={index}
              className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                {benhnhan.fullName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {convertISODateToString(benhnhan.dateOfBirth)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{benhnhan.phone}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {benhnhan.sex === true ? "Nam" : "Nữ"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{benhnhan.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {benhnhan.address}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{benhnhan.cccd}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {
                  appointments.filter(
                    (item) => benhnhan._id === item?.patient?._id
                  ).length
                }
              </td>

              <td className="px-6 py-4 flex items-center gap-1">
                {/* <button
                  onClick={() => adminHandler.showUpdateBenhNhanForm(benhnhan)}
                  className="px-4 py-1 rounded-md text-[14px] bg-[blue] text-white"
                >
                  Sửa
                </button> */}
                <button
                  onClick={() => handleDeleteBenhNhan(benhnhan._id)}
                  className="px-4 py-1 rounded-md text-[14px] bg-[red] text-white"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListKhach;
