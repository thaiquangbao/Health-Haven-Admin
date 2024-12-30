import { adminContext } from "@/context/adminContext";
import { globalContext, notifyType } from "@/context/globalContext";
import { TypeHTTP, api } from "@/utils/api";
import { chuyen_doi_tien_VND, convertISODateToString } from "@/utils/others";
import { ports } from "@/utils/routes";
import React, { useContext, useState } from "react";

const ListTraLuong = ({ payments, typeTicket }) => {
  const { globalHandler } = useContext(globalContext);
  const { adminHandler } = useContext(adminContext);
  const [reason, setReason] = useState("");
  const [visibleFormReason, setVisibleFormReason] = useState(false);
  const [dataSelected, setDataSelected] = useState();
  const [ticketType, setTicketType] = useState("1");
  const handleAccept = (appointment) => {
    globalHandler.notify(notifyType.LOADING, "Đang xử lý yêu cầu");
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
    api({
      path: "/payments/pay-for-doctor",
      type: TypeHTTP.POST,
      body: {
        _id: appointment._id,
        status_take_money: {
          type: "ACCEPT",
          messages: "Đã chấp nhận yêu cầu",
        },
        dateTake: time,
        descriptionTake: "Chấp nhận yêu cầu nhận tiền của bác sĩ",
      },

      sendToken: true,
    }).then((res) => {
      api({
        path: "/payBacks/accept-status",
        type: TypeHTTP.POST,
        body: {
          doctor_id: appointment.doctor?._id,
          status_type: "REQUEST",
          status: {
            type: "ACCEPT",
            messages: "Đã đồng ý",
          },
        },

        sendToken: true,
      }).then((res2) => {
        globalHandler.notify(
          notifyType.SUCCESS,
          "Đã chấp nhận yêu cầu rút tiền thành công!!!"
        );
        globalHandler.reload();
      });
    });
  };
  const handleComplete = (appointment) => {
    globalHandler.notify(notifyType.LOADING, "Đang xử lý yêu cầu");
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
    api({
      path: "/payments/pay-for-doctor",
      type: TypeHTTP.POST,
      body: {
        _id: appointment._id,
        status_take_money: {
          type: "RESOLVED",
          messages: "Tiền đã được gửi",
        },
        dateTake: time,
        beneficiaryAccount: appointment.doctor?.bank,
        descriptionTake: `MB0834885704 đã gửi lương đến BS${appointment.doctor?._id}. Ngày ${time.day}/${time.month}/${time.year} lúc ${time.time}`,
      },

      sendToken: true,
    }).then((res) => {
      api({
        path: "/payBacks/complete-status",
        type: TypeHTTP.POST,
        body: {
          doctor_id: appointment.doctor?._id,
          status_type: "ACCEPT",
          status: {
            type: "COMPLETE",
            messages: "Đã hoàn thành",
          },
        },

        sendToken: true,
      }).then((res2) => {
        globalHandler.notify(
          notifyType.SUCCESS,
          "Yêu cầu đã được hoàn thành!!!"
        );
        globalHandler.reload();
      });
    });
  };
  const handleRefusePayBack = () => {
    if (reason === "") {
      globalHandler.notify(notifyType.ERROR, "Vui lòng nhập lý do từ chối");
      return;
    }
    globalHandler.notify(notifyType.LOADING, "Đang xử lý yêu cầu");
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
    api({
      path: "/payments/pay-for-doctor",
      type: TypeHTTP.POST,
      body: {
        _id: dataSelected._id,
        status_take_money: {
          type: "REJECTED",
          messages: "Từ chối yêu cầu",
        },
        dateTake: time,
        beneficiaryAccount: dataSelected.doctor?.bank,
        descriptionTake: reason,
      },

      sendToken: true,
    }).then((res) => {
      api({
        path: "/payBacks/refuse-status",
        type: TypeHTTP.POST,
        body: {
          doctor_id: dataSelected.doctor?._id,
          status_type: "REQUEST",
          status: {
            type: "REFUSE",
            messages: "Đã từ chối",
          },
          reason: reason,
        },
        sendToken: true,
      }).then((res2) => {
        setVisibleFormReason(false);
        setReason("");
        globalHandler.notify(notifyType.SUCCESS, "Yêu cầu đã bị từ chối!!!");
        globalHandler.reload();
      });
    });
  };
  const handleRefuse = (appointment) => {
    setVisibleFormReason(true);
    setDataSelected(appointment);
  };

  return (
    <div className="w-full h-[90%] overflow-auto mt-2">
      <div className="flex"></div>
      <table className="text-sm w-[100%] text-[15px] text-left rtl:text-right text-gray-500 dark:text-gray-400 mt-2">
        <thead className="sticky top-0 left-0 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3 w-[15%]">
              Bác sĩ
            </th>

            <th scope="col" className="px-6 py-3 w-[10%]">
              Số tiền
            </th>
            <th scope="col" className="px-6 py-3 w-[15%]">
              Thời Gian
            </th>
            <th scope="col" className="px-6 py-3 w-[15%]">
              Mô tả
            </th>
            <th scope="col" className="px-6 py-3 w-[15%]">
              Ngân hàng
            </th>
            <th scope="col" className="px-6 py-3 w-[16%]">
              Trạng Thái
            </th>
            <th scope="col" className="px-6 py-3 w-[15%]">
              Các Thao Tác
            </th>
          </tr>
        </thead>
        <tbody className=" bg-black">
          {payments.map((appointment, index) => (
            <tr
              key={index}
              className="odd:bg-white text-[13px] odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
            >
              <td className="px-6 py-4 ">BS. {appointment.doctor?.fullName}</td>
              <td className="px-6 py-4">
                {chuyen_doi_tien_VND(appointment.price)}
              </td>
              <td className="px-6 py-4">
                {appointment.dateTake?.time}-{appointment.dateTake?.day}/
                {appointment.dateTake?.month}/{appointment.dateTake?.year}
              </td>

              <td className="px-6 py-4">{appointment.descriptionTake}</td>
              <td className="px-6 py-4">
                {appointment.doctor?.bank?.bankName}
                {appointment.doctor?.bank?.accountNumber}-
                {appointment.doctor?.bank?.accountName}
              </td>
              <td
                className="px-6 py-4"
                style={{
                  color:
                    appointment.status_take_money?.type === "RESOLVED"
                      ? "blue"
                      : appointment.status_take_money?.type === "ACCEPT"
                      ? "green"
                      : appointment.status_take_money?.type === "PENDING"
                      ? "black"
                      : "red",
                }}
              >
                {appointment.status_take_money?.messages}
              </td>
              <td className="px-6 py-4 flex items-center gap-1">
                {appointment.status_take_money?.type === "PENDING" && (
                  <>
                    <button
                      onClick={() => handleAccept(appointment)}
                      className="px-2 py-1 rounded-md text-[12px] bg-[blue] text-white"
                    >
                      Xác nhận
                    </button>
                    <button
                      onClick={() => handleRefuse(appointment)}
                      className="px-2 py-1 rounded-md text-[12px] bg-[#ef2b2b] text-white"
                    >
                      Từ chối
                    </button>
                  </>
                )}
                {appointment.status_take_money?.type === "ACCEPT" && (
                  <>
                    <button
                      onClick={() => handleComplete(appointment)}
                      className="px-2 py-1 rounded-md text-[12px] bg-[blue] text-white"
                    >
                      Hoàn thành
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {visibleFormReason && (
        <div
          style={{
            height: "250px",
            width: "550px",
            transition: "0.3s",
            backgroundImage: "url(/bg.png)",
            backgroundSize: "cover",
            overflow: "hidden",
          }}
          className="z-50 w-[300px] min-h-[100px] bg-[white] rounded-lg fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
        >
          <div
            style={{
              transition: "0.5s",
              // marginLeft: `-${(currentStep - 1) * 100}%`,
            }}
            className="w-[100%] flex"
          >
            <div className="min-w-[100%] flex flex-col gap-4 px-4 pt-9">
              <span className="font-space font-bold text-[20px]">
                Lý do từ chối
              </span>
              <div className="flex flex-row justify-between">
                <span className="font-space text-[14px]">
                  BS.: {dataSelected.doctor?.fullName}
                </span>
                <span className="font-space text-[14px]">
                  Thời gian : {dataSelected.dateTake?.time}-
                  {dataSelected.dateTake?.day}/{dataSelected.dateTake?.month}/
                  {dataSelected.dateTake?.year}
                </span>
              </div>

              <div className="flex items-center justify-evenly">
                <input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Lý do..."
                  className="text-[13px] mt-1 w-[100%] h-[38px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <button
              onClick={() => handleRefusePayBack()}
              style={{
                background: "linear-gradient(to right, #11998e, #38ef7d)",
              }}
              className="text-[white] z-[50] shadow-[#767676] absolute bottom-2 text-[15px] shadow-md rounded-xl px-[200px] py-2 transition-all cursor-pointer font-semibold"
            >
              Xác nhận từ chối
            </button>
          </div>
          <button
            onClick={() => {
              setVisibleFormReason(false), setReason("");
            }}
          >
            <i className="bx bx-x absolute right-2 top-2 text-[30px] text-[#5e5e5e]"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default ListTraLuong;
