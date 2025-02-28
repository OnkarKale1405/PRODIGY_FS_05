import React, { useState, useEffect } from "react";
import AvatarPlaceholder from "../assets/profile-img.jpg"; 
import { MdAdd } from "react-icons/md"; 
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from "axios";

const RightSidebar = () => {
  const [scrollY, setScrollY] = useState(0);
  const [users, setUsers] = useState([]);
  const [render, setRender] = useState(false);

  const handleUsers = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("Access token not found");
    }
    let res = await axios.get(
      "http://localhost:8000/api/v1/users/random-users",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(res.data.data);
    let usersData = res.data.data.map(user => ({
      ...user,
      followed: false
    }));
    console.log(usersData);
    setUsers(usersData)
    setRender(true)
  };
  useEffect(() => {
    handleUsers();
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const translation = Math.min(scrollY, 160);

  const handleFollow = async (userId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("Access token not found");
      }

      const response = await axios.post(
        `http://localhost:8000/api/v1/follows/toggle/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response);
      window.alert("Followed Successfully")
      handleUsers();
    } catch (error) {
      console.error("Error following / unfollowing user:", error);
    }
    console.log(`Follow user with ID ${userId}`);
  };

  return (
    <div className="h-72 border-2 p-4 mt-5 mr-10 rounded-2xl fixed top-64 right-0 w-72 transform transition-transform duration-500 ease-in-out" style={{ transform: `translateY(${-translation}px)` }}>
      <h3 className="text-center mb-4">Few Users</h3>
      <ul className="space-y-2">
        {render && users && users.map((user) => (
          <li key={user.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={user.profilepic || "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="}
                alt="Profile"
                className="h-10 w-10 rounded-full border border-red-400"
              />
              <span style={{fontSize:'1.5rem',marginLeft:'20px'}}>{user.name}</span>
            </div>
            <button
              className="bg-black text-white rounded-full p-2"
              onClick={() => {handleFollow(user._id)
              user.followed = true}}
            >
              {
                user.followed? <CheckCircleIcon/> : <MdAdd/>
              }
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RightSidebar;
