"use client";
import ListBacSi from "@/components/admin/bac-si-management/listBacSi";
import ListThietLap from "@/components/admin/thiet-lap-management/listThietLap";
import Header from "@/components/header";
import Navbar from "@/components/menu/navbar";
import { adminContext } from "@/context/adminContext";
import { globalContext } from "@/context/globalContext";
import { TypeHTTP, api } from "@/utils/api";
import { ports } from "@/utils/routes";
import React, { useContext, useEffect, useState } from "react";

const CuocHenManagement = () => {
  const [dsGiaCuocHen, setDsGiaCuocHen] = useState([]);
  const { adminData, adminHandler } = useContext(adminContext);
  const { globalHandler } = useContext(globalContext);

  useEffect(() => {
    api({
      path: "/price-lists/getAll",
      sendToken: false,
      type: TypeHTTP.GET,
    }).then((res) => {
      // console.log(res)
      setDsGiaCuocHen(res);
    });
  }, []);

  return (
    <section className="h-screen w-full flex z-0">
      <Navbar />
      <div className="w-full h-screen relative pl-[20px] pb-[10px] flex flex-col gap-3">
        <Header image={"/calendar.png"} text={"Quản Lý Giá Dịch Vụ"} />
        <ListThietLap dsThietLap={dsGiaCuocHen} />
        <button
          onClick={() => adminHandler.showCreateThietlapForm()}
          className="fixed px-4 py-1 rounded-md top-4 right-3 text-[14px] bg-[green] text-[white]"
        >
          + Thêm Thiết Lập
        </button>
      </div>
    </section>
  );
};

export default CuocHenManagement;
