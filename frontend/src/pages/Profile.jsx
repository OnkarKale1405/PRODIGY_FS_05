import * as React from "react";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Grid from "@mui/joy/Grid";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Avatar from "@mui/joy/Avatar";
import Button from "@mui/joy/Button";
import Modal from "@mui/material/Modal";
import { Link as Lk, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import axios from "axios";

export default function ProfilePage() {
  const params = useParams();
  const [theUser, setTheUser] = useState(null);
  const [render, setRender] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [modalFor, setModalFor] = useState("Followers");
  const [modalData, setModalData] = useState();

  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      setRender(false);
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("Access token not found");
      }

      const response = await axios.get(
        `http://localhost:8000/api/v1/users/profile/${params.username}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("Response", response);
      const fetchedProfile = response.data;
      setTheUser(fetchedProfile);
      let res = await axios.get(
        "http://localhost:8000/api/v1/users/me",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setCurrentUser(res.data);
      console.log(res.data);
      setRender(true);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleFollowers = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("Access token not found");
      }

      const response = await axios.get(
        `http://localhost:8000/api/v1/follows/followers/${theUser.data[0]._id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data);
      setModalFor("Followers");
      setModalData(response.data);
      setIsOpen(true);
    } catch (error) {
      console.error("Error getting followers data:", error);
    }
  };

  const handleFollowings = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("Access token not found");
      }

      const response = await axios.get(
        `http://localhost:8000/api/v1/follows/followings/${theUser.data[0]._id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data);
      setModalFor("Followings");
      setModalData(response.data);
      setIsOpen(true);
    } catch (error) {
      console.error("Error getting followings data:", error);
    }
  };

  const handleFollow = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("Access token not found");
      }

      const response = await axios.post(
        `http://localhost:8000/api/v1/follows/toggle/${theUser.data[0]._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response);
      fetchProfile();
    } catch (error) {
      console.error("Error following / unfollowing user:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Navbar />
      <Box sx={{ display: "flex", flexDirection: "row", marginTop: "70px" }}>
        <Sidebar />
        <Box sx={{ flex: 2 }}>
          {theUser && render && (
            <>
              <Box sx={{ p: 4, marginLeft: "300px", marginTop: "10px" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 3,
                    marginTop: "20px",
                  }}
                >
                  <Avatar
                    sx={{ width: 200, height: 200 }}
                    alt="Profile Image"
                    src={
                      theUser.data[0].profilepic ||
                      "https://via.placeholder.com/150"
                    }
                  />
                  <Box sx={{ ml: 15 }}>
                    <Typography
                      variant="h2"
                      sx={{
                        fontSize: "3rem",
                        display: "inline",
                        paddingRight: "1.5rem",
                      }}
                    >
                      {theUser.data[0].name || ""}
                    </Typography>
                    <Typography
                      variant="h2"
                      sx={{ fontSize: "3rem", display: "inline" }}
                    >
                      .
                    </Typography>
                    <Typography
                      variant="h2"
                      sx={{
                        fontSize: "2rem",
                        display: "inline",
                        paddingLeft: "1.5rem",
                      }}
                    >
                      @{theUser.data[0].username || ""}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ fontSize: "1.5rem", mr: 2 }}
                        onClick={handleFollowers}
                        className="hover:cursor-pointer"
                      >
                        {theUser.data[0].followersCount} followers
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.primary"
                        sx={{ fontSize: "1.5rem", mr: 2 }}
                        onClick={handleFollowings}
                        className="hover:cursor-pointer"
                      >
                        {theUser.data[0].followingsCount} following
                      </Typography>
                      {/** Follow/Unfollow buttons */}
                      {theUser.data[0].username ===
                      currentUser.data.username ? (
                        <></>
                      ) : (
                        <Button
                          variant="outlined"
                          onClick={handleFollow}
                          sx={{ fontSize: "1.5rem" }}
                        >
                          {theUser.data[0].isFollowing ? "Unfollow" : "Follow"}
                        </Button>
                      )}
                    </Box>
                    {theUser.data[0].username === currentUser.data.username ? (
                      <Lk to="/edit-profile" style={{ textDecoration: "none" }}>
                        <Button
                          variant="outlined"
                          startIcon={<EditRoundedIcon />}
                          sx={{ fontSize: "1.5rem", mt: 2 }}
                        >
                          Edit Profile
                        </Button>
                      </Lk>
                    ) : (
                      <></>
                    )}
                  </Box>
                </Box>
                <Typography
                  variant="body1"
                  color="text.primary"
                  sx={{ fontSize: "1.5rem" }}
                >
                  {theUser.data[0].bio}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.primary"
                  sx={{ fontSize: "1.5rem", mt: 3, mb: 1 }}
                >
                  {theUser.data[0].posts.length}{" "}
                  {theUser.data[0].posts.length === 1 ? "post" : "posts"}
                </Typography>
                <hr
                  style={{
                    border: "1px solid #ccc",
                    width: "100%",
                    marginBottom: "20px",
                  }}
                />
                <Grid container spacing={3}>
                  {theUser.data[0].posts.map((post, index) => (
                    <Grid key={post._id} item xs={4}>
                      <Card style={{ width: "80%" }}>
                        <CardContent>
                          <Typography variant="h6">{post.caption}</Typography>
                          <img
                            src={post.mediaFile[0] || ""}
                            alt={post.caption}
                            style={{ width: "100%", marginTop: 10 }}
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </>
          )}
        </Box>
      </Box>
      <Modal
        open={isOpen}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            boxShadow: 24,
            p: 4,
            width: 400,
          }}
        >
          <Typography variant="h6" component="h2" id="modal-title">
            {modalFor}
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            {modalData &&
              modalData.data.map((item) => (
                <div key={item._id} className="flex w-full items-center">
                  <div
                    className="w-16 h-16 mr-2 border-b border-red-400 rounded-full"
                    onClick={() =>
                      navigate(
                        `/profile/${
                          item.follower.username || item.following.username || 
                          item.follower[0].username || item.following[0].username
                        }`
                      )
                    }
                  >
                    <img
                      src={
                        item.follower.profilepic ||
                        item.following.profilepic ||
                        // item.follower[0].profilepic ||
                        // item.following[0]?.profilepic ||
                        "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
                      }
                      alt=""
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <div>{item.follower.name || item.following.name || item.follower[0].name || item.following[0].name}</div>
                    <div>
                      @{item.follower.username || item.following.username || item.follower[0].username || item.following[0].username}
                    </div>
                  </div>
                </div>
              ))}
          </Typography>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={() => setIsOpen(false)} variant="outlined">
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
