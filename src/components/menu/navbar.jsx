"use client";
import { globalContext, notifyType } from "@/context/globalContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import Logo from "../logo";

const Navbar = () => {
  const { globalHandler, globalData } = useContext(globalContext);
  const router = useRouter();
  const [displayAnalysis, setDisplayAnalysis] = useState(false);

  const handleSignOut = () => {
    globalHandler.notify(notifyType.LOADING, "Go Out");
    globalThis.localStorage.removeItem("accessToken");
    setTimeout(() => {
      globalHandler.notify(notifyType.NONE, "");
      router.push("/");
    }, 1000);
  };

  return (
    <div className="w-[250px] z-10 bg-[white] border-r-[1px] h-full border-[#e0e0e0] pt-[10px] flex flex-col px-[15px] shadow-xl">
      <div className="flex w-full items-center justify-center gap-4 mb-[15px] mt-2">
        <Logo />
      </div>
      <Link href={"/quan-ly-bac-si"}>
        <div className="flex w-full items-center justify-start gap-2 cursor-pointer mb-3" >
          <img src="/hocphan.png" width={"28px"} />
          <span className="hover:underline text-[13px] font-medium w-[200px] translate-y-[5px]">
            Quản Lý Bác Sĩ
          </span>
        </div>
      </Link>
      <Link href={"/quan-ly-benh-nhan"}>
        <div className="flex w-full items-center justify-start gap-2 cursor-pointer mb-3" >
          <img src="/benhnhan-manager.png" width={"28px"} />
          <span className="hover:underline text-[13px] font-medium w-[200px] translate-y-[5px]">
            Quản Lý Bệnh Nhân
          </span>
        </div>
      </Link>
      <Link href={"/quan-ly-khach"}>
        <div className="flex w-full items-center justify-start gap-2 cursor-pointer mb-3" >
          <img src="/cus.png" width={"28px"} />
          <span className="hover:underline text-[13px] font-medium w-[200px] translate-y-[5px]">
            Quản Lý Khách Vãng Lai
          </span>
        </div>
      </Link>
      <Link href={"/quan-ly-benh"}>
        <div className="flex w-full items-center justify-start gap-2 cursor-pointer mb-3" >
          <img src="/loaibenh-manage.png" width={"35px"} />
          <span className="hover:underline text-[13px] font-medium w-[200px] translate-y-[5px]">
            Quản Lý Loại Khám
          </span>
        </div>
      </Link>
      <Link href={"/thiet-lap-cuoc-hen"}>
        <div className="flex w-full items-center justify-start gap-2 cursor-pointer mb-3" >
          <img src="/gia-manager.png" width={"28px"} />
          <span className="hover:underline text-[13px] font-medium w-[200px] translate-y-[5px]">
            Quán Lý Giá Dịch Vụ
          </span>
        </div>
      </Link>
      <Link href={"/quan-ly-forum"}>
        <div className="flex w-full items-center justify-start gap-2 cursor-pointer mb-3" >
          <img src="/cam-nang-manager.png" width={"28px"} />
          <span className="hover:underline text-[13px] font-medium w-[200px] translate-y-[5px]">
            Quản Lý Cẩm Nang
          </span>
        </div>
      </Link>
      <Link href={"/quan-ly-qa"}>
        <div className="flex w-full items-center justify-start gap-2 cursor-pointer mb-3" >
          <img src="/qa-manager.jpg" width={"28px"} className="rounded-full" />
          <span className="hover:underline text-[13px] font-medium w-[200px] translate-y-[5px]">
            Quản Lý Hỏi Đáp
          </span>
        </div>
      </Link>
      <Link href={"/tra-luong"}>
        <div className="flex w-full items-center justify-start gap-2 cursor-pointer mb-3" >
          <img src="/tinhluong.png" width={"28px"} className="rounded-full" />
          <span className="hover:underline text-[13px] font-medium w-[200px] translate-y-[5px]">
            Trả lương cho bác sĩ
          </span>
        </div>
      </Link>
      <Link href={"/lich-hen-bi-huy"}>
        <div className="flex w-full items-center justify-start gap-2 cursor-pointer mb-3" >
          <img src="/lichhuy.png" width={"28px"} className="rounded-full" />
          <span className="hover:underline text-[13px] font-medium w-[200px] translate-y-[5px]">
            Lịch hẹn bị hủy
          </span>
        </div>
      </Link>
      <div
        onClick={() => setDisplayAnalysis(!displayAnalysis)}
        className="flex w-full items-center justify-start gap-2 cursor-pointer mb-3"
      >
        <img src="/thongke.png" width={"28px"} />
        <span className="hover:underline text-[13px] font-medium w-[200px] translate-y-[5px]">
          Thống Kê
        </span>
        <i className="bx bx-chevron-down text-[20px] translate-y-[5px]"></i>
      </div>
      <div
        style={{
          height: displayAnalysis === true ? "80px" : "0px",
          transition: "0.5s",
          marginBottom: displayAnalysis === true ? "12px" : "0px",
        }}
        className="w-[100%] flex flex-col px-4 gap-2 overflow-hidden"
      >
        <Link href={"/thong-ke-bac-si"}>
          <div
            onClick={() => setDisplayAnalysis(!displayAnalysis)}
            className="flex w-full items-center justify-start gap-2 cursor-pointer"
          >
            <img src="/thong-ke-bs.png" width={"28px"} />
            <span className="hover:underline text-[13px] font-medium w-[200px] translate-y-[5px]">
              Thống Kê Bác Sĩ
            </span>
          </div>
        </Link>
        <Link href={"/thong-ke-doanh-thu-nen-tang"}>
          <div
            onClick={() => setDisplayAnalysis(!displayAnalysis)}
            className="flex w-full items-center justify-start gap-2 cursor-pointer"
          >
            <img src="/thong-ke-doanh-thu-ht.png" width={"28px"} />
            <span className="hover:underline text-[13px] font-medium w-[200px] translate-y-[5px]">
              Doanh Thu Nền Tảng
            </span>
          </div>
        </Link>
      </div>
      <div
        onClick={() => handleSignOut()}
        className="flex w-full items-center justify-start gap-2 cursor-pointer"
      >
        <img src="/signout.png" width={"28px"} />
        <span className="hover:underline text-[13px] font-medium w-[200px] translate-y-[5px]">
          Đăng Xuất
        </span>
      </div>
    </div>
  );
};

export default Navbar;
