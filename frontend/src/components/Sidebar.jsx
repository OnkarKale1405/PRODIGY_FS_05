import React, { useState, useEffect } from 'react';
import { Link as Lk, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faBell, faUser, faList } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigate = useNavigate();

  const handleClick = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("Access token not found");
    }
    let res = await axios.get(
      "http://localhost:8000/api/v1/users/me",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(res.data);
    navigate(`/profile/${res.data.data.username}`)
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = 200;
      setIsCollapsed(scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
<div className={`${isCollapsed ? 'w-32' : 'w-64'} border-r fixed transition-all ease-in-out duration-500 pt-8 h-full ml-0`}>
      <Lk to='/Home' className='block'>
        <div className='flex items-center hover:bg-slate-100 mb-4 mr-4 ml-4 rounded-full'>
          <FontAwesomeIcon icon={faHouse} className='w-10 h-8 mb-4 mt-4 ml-8' />
          {!isCollapsed && <h5 className='ml-3 text-xl mb-4 mt-4'>Home</h5>}
        </div>
      </Lk>
      <Lk to='/notifications' className='block'>
        <div className='flex items-center hover:bg-slate-100 mb-4 mr-4 ml-4 rounded-full'>
          <FontAwesomeIcon icon={faBell} className='w-10 h-8 mb-4 mt-4 ml-8' />
          {!isCollapsed && <h5 className='ml-3 text-xl mb-4 mt-4'>Notification</h5>}
        </div>
      </Lk>
      <div className='block' onClick={handleClick}>
        <div className='flex items-center hover:bg-slate-100 mb-4 mr-4 ml-4 rounded-full'>
          <FontAwesomeIcon icon={faUser} className='w-10 h-8 mb-4 mt-4 ml-8' />
          {!isCollapsed && <h5 className='ml-3 text-xl mb-4 mt-4'>Profile</h5>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;