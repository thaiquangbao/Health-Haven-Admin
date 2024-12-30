"use client"

import { TypeHTTP, api } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { globalContext, notifyType } from "../context/globalContext";
import { ports } from "@/utils/routes";

export default function Home() {

  const [passWord, setPassword] = useState('')
  const [userName, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const { globalHandler, globalData } = useContext(globalContext)
  const router = useRouter()

  const handleSignIn = () => {
    if (!/^0[0-9]{9}$/.test(userName)) {
      globalHandler.notify(notifyType.WARNING, "Số điện thoại không hợp lệ")
      return
    }
    if (passWord.length < 6) {
      globalHandler.notify(notifyType.WARNING, "Mật khẩu phải lớn hơn 6 ký tự")
      return
    }
    globalHandler.notify(notifyType.LOADING, "Đang Xác Thực Thông Tin")
    api({ sendToken: false, type: TypeHTTP.POST, path: '/auth/login/admin', body: { userName: userName, passWord: passWord } })
      .then(res => {
        if (res.data.processSignup === 3) {
          if (res.data.role === 'ADMIN') {
            globalHandler.setUser(res.data)
            globalHandler.notify(notifyType.SUCCESS, "Đăng nhập thành công")
            globalThis.localStorage.setItem('accessToken', res.token.accessToken)
            globalThis.localStorage.setItem('refreshToken', res.token.refreshToken)
            router.push('/quan-ly-bac-si')
          } else {
            globalHandler.notify(notifyType.FAIL, 'Vui Lòng Đăng Nhập Bằng Tài Khoản Admin')
          }
        } else {
          globalHandler.notify(notifyType.FAIL, 'Vui Lòng Đăng Nhập Bằng Tài Khoản Admin')
        }
      })
      .catch(error => {
        globalHandler.notify(notifyType.FAIL, error.message)
      })
  }

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="flex rounded-lg overflow-hidden gap-3 border-[#e1e1e1] border-[1px]">
        <img src="/logo.png" width={'300px'} />
        <div className="flex flex-col w-[350px] justify-center items-center gap-3 px-[30px]">
          <h1 className="text-[22px]">Đăng Nhập</h1>
          <span className="text-center text-[13px]">Chào mừng trở lại với HealthHaven Admin</span>
          <div className="flex flex-col gap-2">
            <input value={userName} onChange={(e) => setUsername(e.target.value)} placeholder="Số Điện Thoại" className="focus:outline-0 h-[35px] w-[300px] border-[1px] rounded-md px-[10px] text-[13px] border-[#ddd]" />
            <input value={passWord} onChange={e => setPassword(e.target.value)} type="password" placeholder="Mật khẩu" className="focus:outline-0 h-[35px] w-[300px] border-[1px] rounded-md px-[10px] text-[13px] border-[#ddd]" />
            <button onClick={() => handleSignIn()} className="h-[35px] w-[300px] text-[white] bg-[#30b0f0] mt-[5px] border-[1px] rounded-md px-[10px] text-[11px] border-[#999]">
              {loading ?
                <svg aria-hidden="true" className="inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-[black]" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
                :
                <span className="text-[14px]">Đăng Nhập</span>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
