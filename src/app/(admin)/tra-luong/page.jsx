"use client";
import ListTraLuong from "@/components/admin/tra-luong/listTraLuong";
import Header from "@/components/header";
import Navbar from "@/components/menu/navbar";
import { adminContext } from "@/context/adminContext";
import { globalContext } from "@/context/globalContext";
import { TypeHTTP, api } from "@/utils/api";
import { ports } from "@/utils/routes";
import React, { useContext, useEffect, useState } from "react";

const TraLuongManagement = () => {
  const [dsPayment, setDsPayment] = useState([]);
  const { adminData, adminHandler } = useContext(adminContext);
  const { globalHandler } = useContext(globalContext);
  const [ticketType, setTicketType] = useState("1");
  useEffect(() => {
    api({
      path: "/payments/get-all",
      sendToken: true,
      type: TypeHTTP.GET,
    }).then((res) => {
      setDsPayment(res.filter((payment) => payment.namePayment === "PAYBACK"));
    });
  }, []);
  const handleFilter = (e) => {
    setTicketType(e.target.value);
    const value = e.target.value;

    if (value === "1") {
      api({
        path: "/payments/get-all",
        sendToken: true,
        type: TypeHTTP.GET,
      }).then((res) => {
        setDsPayment(
          res.filter((payment) => payment.namePayment === "PAYBACK")
        );
      });
    } else if (value === "2") {
      api({
        path: "/payments/get-all",
        sendToken: true,
        type: TypeHTTP.GET,
      }).then((res) => {
        setDsPayment(
          res.filter(
            (payment) =>
              payment.namePayment === "PAYBACK" &&
              payment.status_take_money?.type === "PENDING"
          )
        );
      });
    } else if (value === "3") {
      api({
        path: "/payments/get-all",
        sendToken: true,
        type: TypeHTTP.GET,
      }).then((res) => {
        setDsPayment(
          res.filter(
            (payment) =>
              payment.namePayment === "PAYBACK" &&
              payment.status_take_money?.type === "ACCEPT"
          )
        );
      });
    } else if (value === "4") {
      api({
        path: "/payments/get-all",
        sendToken: true,
        type: TypeHTTP.GET,
      }).then((res) => {
        setDsPayment(
          res.filter(
            (payment) =>
              payment.namePayment === "PAYBACK" &&
              payment.status_take_money?.type === "REJECTED"
          )
        );
      });
    } else if (value === "5") {
      api({
        path: "/payments/get-all",
        sendToken: true,
        type: TypeHTTP.GET,
      }).then((res) => {
        setDsPayment(
          res.filter(
            (payment) =>
              payment.namePayment === "PAYBACK" &&
              payment.status_take_money?.type === "RESOLVED"
          )
        );
      });
    }
  };
  return (
    <section className="h-screen w-full flex z-0">
      <Navbar />
      <div className="w-full h-screen relative pl-[20px] pb-[10px] flex flex-col gap-3">
        <Header image={"/calendar.png"} text={"Quản Lý Nhận Tiền"} />
        <div className="flex w-[25%]">
          <select
            onChange={(e) => handleFilter(e)}
            className="px-4 py-2 text-[15px] shadow-lg text-start focus:outline-0 rounded-md font-medium bg-gray-100 "
          >
            <option value={1}>Tất cả</option>
            <option value={2}>Đang chờ xử lý</option>
            <option value={3}>Đã xác nhận</option>
            <option value={4}>Đã từ chối</option>
            <option value={5}>Đã gửi lương</option>
          </select>
        </div>

        <ListTraLuong payments={dsPayment} />
        {/* <button onClick={() => adminHandler.showCreateTraLuongForm()} className='fixed px-4 py-1 rounded-md top-4 right-3 text-[14px] bg-[green] text-[white]'>+ Thêm Bác Sĩ</button> */}
      </div>
    </section>
  );
};

export default TraLuongManagement;
