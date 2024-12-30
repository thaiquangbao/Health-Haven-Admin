import React from 'react'

const Header = ({ image, text }) => {
    return (
        <div className='flex gap-2 items-center w-full py-[10px]'>
            <img src={image} width={'35px'} />
            <span className='text-[18px] font-medium'>{text}</span>
        </div>
    )
}

export default Header