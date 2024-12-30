import { globalContext } from '@/context/globalContext'
import Link from 'next/link'
import React, { useContext, useEffect, useState } from 'react'
import { api, TypeHTTP } from '@/utils/api'
const Logo = () => {
  const { globalData } = useContext(globalContext)
  const [balance, setBalance] = useState(0)
  const [showFullBalance, setShowFullBalance] = useState(false)
  useEffect(() => {
    api({ type: TypeHTTP.GET, sendToken: true, path: '/admin/get-balance' })
      .then(res => {
        setBalance(res)
      })
      
  }, [])

  const toggleBalanceView = () => {
    setShowFullBalance(!showFullBalance)
  }
  const displayBalance = showFullBalance ? balance : `${balance.toString().slice(0, 6)}...`
  return (
    <div className='flex gap-2 w-full items-center'>
      <img src="/logo.png" width={'50px'} height={'50px'} />
      <div className='flex flex-col gap-2'>
        <span className='text-[15px] font-semibold'>Quản trị viên </span>
        <div className='text-[14px]'>{globalData.user?.fullName}</div>
        <div className='flex flex-row gap-1'> 
          <i className='bx bx-wallet text-[22px]'></i>
          <span className='text-[14px]'>{displayBalance} ETH</span>
          <i className={`bx ${showFullBalance ? 'bx-hide' : 'bx-show'} text-[22px] cursor-pointer`} onClick={toggleBalanceView}></i>
        </div>
      </div>
    </div>
  )
}

export default Logo