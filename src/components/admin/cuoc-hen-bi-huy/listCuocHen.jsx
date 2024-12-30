import { adminContext } from "@/context/adminContext";
import { globalContext, notifyType } from "@/context/globalContext";
import { TypeHTTP, api } from "@/utils/api";
import { chuyen_doi_tien_VND, convertISODateToString } from "@/utils/others";
import { ports } from "@/utils/routes";
import React, { useContext } from "react";

const ListCuocHen = ({ dsCuocHen, payments }) => {
  const { globalHandler } = useContext(globalContext);
  const { adminHandler } = useContext(adminContext);

  const handleRefund = (dataUpdate) => {
    globalHandler.notify(notifyType.LOADING, "Đang Hoàn Tiền");
    const currentDate = new Date();
    const vietnamTimeOffset = 7 * 60; // GMT+7 in minutes
    const localTimeOffset = currentDate.getTimezoneOffset(); // Local timezone offset in minutes
    const vietnamTime = new Date(
      currentDate.getTime() + (vietnamTimeOffset + localTimeOffset) * 60000
    );
    const time = {
      day: vietnamTime.getDate(),
      month: vietnamTime.getMonth() + 1,
      year: vietnamTime.getFullYear(),
      time: `${vietnamTime.getHours()}:${vietnamTime.getMinutes()}`,
    };
    const body = {
      _id: dataUpdate._id,
      status_payment: {
        type: "RESOLVED",
        messages: "Đã hoàn tiền",
      },
      date: time,
      beneficiaryAccount: {
        accountNumber: dataUpdate.patient.bank?.accountNumber,
        bankName: dataUpdate.patient.bank?.bankName,
        accountName: dataUpdate.patient.bank?.accountName,
      },
      description: `Hoàn tiền dịch vụ ${
        dataUpdate.category === "APPOINTMENT"
          ? "khám trực tuyến"
          : "theo dõi sức khỏe"
      } -MaKH${dataUpdate.patient._id}.Lịch hẹn lúc (${dataUpdate.date.time})-${
        dataUpdate.date.day
      }/${dataUpdate.date.month}/${dataUpdate.date.year}`,
    };
    api({
      type: TypeHTTP.POST,
      sendToken: true,
      path: `/payments/pay-for-patient`,
      body: body,
    }).then((res) => {
      globalHandler.notify(notifyType.SUCCESS, "Hoàn tiền thành công");
      globalHandler.reload();
    });
  };

  return (
    <div className="w-full h-[90%] overflow-auto mt-2">
      <table className="text-sm w-[100%] text-[15px] text-left rtl:text-right text-gray-500 dark:text-gray-400 mt-2">
        <thead className="sticky top-0 left-0 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3 w-[12%]">
              Bệnh Nhân
            </th>
            <th scope="col" className="px-6 py-3 w-[12%]">
              Bác sĩ
            </th>

            <th scope="col" className="px-6 py-3 w-[10%]">
              Số tiền
            </th>
            <th scope="col" className="px-6 py-3 w-[10%]">
              Thời Gian
            </th>
            <th scope="col" className="px-6 py-3 w-[15%]">
              Mô tả
            </th>
            <th scope="col" className="px-6 py-3 w-[15%]">
              Ngân hàng
            </th>
            <th scope="col" className="px-6 py-3 w-[15%]">
              Trạng Thái
            </th>
            <th scope="col" className="px-6 py-3">
              Các Thao Tác
            </th>
          </tr>
        </thead>
        <tbody className=" bg-black">
          {payments
            .filter(
              (item) =>
                item.status_payment?.type === "PENDING" ||
                item.status_payment?.type === "RESOLVED"
            )
            .map((appointment, index) => (
              <tr
                key={index}
                className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
              >
                <td className="px-6 py-4 ">{appointment.patient?.fullName}</td>
                <td className="px-6 py-4 ">
                  BS. {appointment.doctor?.fullName}
                </td>
                <td className="px-6 py-4">
                  {chuyen_doi_tien_VND(appointment.price)}
                </td>
                <td className="px-6 py-4">
                  {appointment.date?.time}-{appointment.date?.day}/
                  {appointment.date?.month}/{appointment.date?.year}
                </td>

                <td className="px-6 py-4">{appointment.description}</td>
                <td className="px-6 py-4">
                  {appointment.patient.bank?.bankName}
                  {appointment.patient.bank?.accountNumber}-
                  {appointment.patient.bank?.accountName}
                </td>
                <td
                  className="px-6 py-4"
                  style={{
                    color:
                      appointment.status_payment?.type === "RESOLVED"
                        ? "green"
                        : "blue",
                  }}
                >
                  {appointment.status_payment?.messages}
                </td>
                <td className="px-6 py-4 flex items-center gap-1">
                  {appointment.status_payment?.type === "PENDING" && (
                    <button
                      onClick={() => handleRefund(appointment)}
                      className="px-4 py-1 rounded-md text-[14px] bg-[blue] text-white"
                    >
                      Hoàn tiền
                    </button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListCuocHen;
