import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import RightSidebar from "../components/RightSidebar";
import Posts from "../components/Posts";
import Navbar from "../components/Navbar";

const Home = () => {

  const [loggedIn,setLoggedIn] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      setLoggedIn(true);
    }
  }, [])
  return (
    <>
      <Navbar />
      {
        loggedIn? 
      <div className="flex relative top-20 z-10">
        <div className="flex-none w-64">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col items-center mt-6">
          <Posts />
        </div>
        <div className="flex-none w-64 h-64 p-10 mt-10 mr-10 rounded-lg">
          <RightSidebar />
        </div>
      </div> :
      <div className="flex relative top-60 z-10 justify-center text-3xl font-bold"><span>Please log in first !!</span></div>
      }
    </>
  );
};

export default Home;
