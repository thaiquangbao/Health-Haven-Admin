"use client";
import ListKhach from "@/components/admin/khach-management/listKhach";
import Header from "@/components/header";
import Navbar from "@/components/menu/navbar";
import { adminContext } from "@/context/adminContext";
import { globalContext } from "@/context/globalContext";
import { TypeHTTP, api } from "@/utils/api";
import { ports } from "@/utils/routes";
import React, { useContext, useEffect, useState } from "react";

const BacSiManagement = () => {
  const [dsBenhNhan, setDsBenhNhan] = useState([]);
  const { adminData, adminHandler } = useContext(adminContext);
  const { globalHandler } = useContext(globalContext);

  useEffect(() => {
    api({
      path: "/customers/get-all",
      sendToken: false,
      type: TypeHTTP.GET,
    }).then((res) => {
      // console.log(res);

      setDsBenhNhan(res);
    });
  }, []);

  return (
    <section className="h-screen w-full flex z-0">
      <Navbar />
      <div className="w-full h-screen relative pl-[20px] pr-[250px] pb-[10px] flex flex-col gap-3">
        <Header image={"/calendar.png"} text={"Quản Lý Khách Vãn Lai"} />
        <ListKhach dsBenhNhan={dsBenhNhan} />
        {/* <button onClick={() => adminHandler.showCreateBacSiForm()} className='fixed px-4 py-1 rounded-md top-4 right-3 text-[14px] bg-[green] text-[white]'>+ Thêm Bác Sĩ</button> */}
      </div>
    </section>
  );
};

export default BacSiManagement;
