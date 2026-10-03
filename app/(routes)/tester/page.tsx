"use client";
import React, { useState } from 'react';
const Switcher1 = () => {
    const [isChecked, setIsChecked] = useState(false);
    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };
    return (<>
      <label className='flex cursor-pointer select-none items-center'>
        <div className='relative'>
          <input type='checkbox' checked={isChecked} onChange={handleCheckboxChange} className='sr-only'/>
          <div className={`block h-8 w-14 rounded-full transition-colors ${isChecked ? 'bg-blue-500' : 'bg-[#E5E7EB]'}`}></div>
          <div className={`dot absolute top-1 h-6 w-6 rounded-full bg-white transition-transform ${isChecked ? 'translate-x-6 left-1' : 'left-1'}`}></div>
        </div>
      </label>
    </>);
};
export default Switcher1;
