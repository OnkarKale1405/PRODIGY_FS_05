import React from "react";
import Svg1 from "../assets/navbar-svg-1.jsx";
import Svg2 from "../assets/navbar-svg-2.jsx";
import Svg3 from "../assets/navbar-svg-3.jsx";
import Svg4 from "../assets/navbar-svg-4.jsx";
import Svg5 from "../assets/navbar-svg-5.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
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

  const handleLogout = async () => {
    localStorage.removeItem("accessToken");
    navigate("/signin");
}
  return (
    // <nav className="navbar">
    //   <div className="navbar-logo">
    //     <Lk to="/"><img src={Logo} alt='logo' className='logo'/></Lk>
    //   </div>
    //   <div className="navbar-search">
    //     <input type="text" placeholder="Search..." />
    //   </div>
    //   <div className="navbar-Lks">
    //     <Lk to="/login"><button type='submit' /></Lk>
    //     <Lk to="/profile"><img src={profileImage} alt="Profile" className='profile-img'/></Lk>
    //   </div>
    // </nav>
    <nav className="bg-white w-full flex fixed justify-between items-center mx-auto px-8 h-20 border-b-2 border-black shadow-md z-20">
      <div className="inline-flex">
        <a className="_o6689fn" href="/">
          <div className="flex justify-center items-center">
            <Svg1 />
            <span className="ml-2 text-2xl font-bold font-mono">
              Social Sphere
            </span>
          </div>
          <div className="block md:hidden">
            <Svg2 />
          </div>
        </a>
      </div>
      <div className="hidden sm:block flex-shrink flex-grow-0 justify-start px-2">
        <div className="inline-block">
          <div className="inline-flex items-center max-w-full">
            <div className="flex items-center flex-grow-0 flex-shrink pl-2 relative w-96 border rounded-full px-1  py-1">
              <input
                type="text"
                placeholder="Search..."
                className="block flex-grow flex-shrink overflow-hidden border-none focus:ring-0"
              />
              <div
                className="flex items-center justify-center relative  h-8 w-8 rounded-full"
                // onClick={search}
              >
                <Svg3 />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-initial">
        <div className="flex justify-end items-center relative">
          <div className="flex mr-4 items-center">
            <a
              className="inline-block py-2 px-4 hover:bg-gray-200 border rounded-full"
              href="#"
            >
              <div className="flex items-center relative cursor-pointer whitespace-nowrap"
              onClick={handleLogout}>
                <a href="/signin">Logout</a>
              </div>
            </a>
          </div>

          <div className="block">
            <div className="inline relative">
              <button
                type="button"
                className="inline-flex items-center relative px-2 border rounded-full hover:shadow-lg"
                onClick={handleClick}
              >
                <div className="pl-1">
                  <Svg4 />
                </div>
                <div className="block flex-grow-0 flex-shrink-0 h-10 w-12 pl-5">
                  <Svg5 />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
