import React from 'react'

const Wrapper = ({ visible, onClick }) => {
    return (
        <div onClick={onClick} style={visible ? { width: '100%', height: '100%', padding: '10px' } : { width: 0, height: 0, padding: 0 }} className='bg-[#00000036] z-50 fixed top-[50%] left-[50%] translate-x-[-50%] transition-all translate-y-[-50%] overflow-hidden'>

        </div>
    )
}

export default Wrapper