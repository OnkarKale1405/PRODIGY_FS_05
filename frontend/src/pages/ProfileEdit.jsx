import * as React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";
import Input from "@mui/joy/Input";
import IconButton from "@mui/joy/IconButton";
import Textarea from "@mui/joy/Textarea";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Link from "@mui/joy/Link";
import Card from "@mui/joy/Card";
import CardActions from "@mui/joy/CardActions";
import CardOverflow from "@mui/joy/CardOverflow";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { Link as Lk, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function Profile() {
  const [email, setEmail] = React.useState("");
  const [bio, setBio] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [selectedImage, setSelectedImage] = React.useState(null);
  const navigate = useNavigate();

  const fileInputRef = React.useRef(null);

  const handleEditIconClick = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleFullNameChange = (event) => {
    setFullName(event.target.value);
  };

  const handleBioChange = (event) => {
    setBio(event.target.value);
  };

  const handleSaveChanges = async () => {
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("name", fullName);
      formData.append("bio", bio);
      if (selectedImage) {
        formData.append("profilepic", selectedImage);
      }

      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("Access token not found");
      }

      const response = await axios.patch(
        "http://localhost:8000/api/v1/users/update-account",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      console.log("Profile updated successfully:", response.data);
      window.alert("Profile Updated Successfully");
      navigate(`/profile/${response.data.data.username}`)
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Navbar />
      {/* <Box
        sx={{
          position: 'sticky',
          top: { sm: -100, md: -110 },
          bgcolor: 'background.body',
          zIndex: 9995,
        }}
      >
        <Box sx={{ px: { xs: 2, md: 6 } }}>
          <Breadcrumbs
            size="sm"
            aria-label="breadcrumbs"
            separator={<ChevronRightRoundedIcon fontSize="sm" />}
            sx={{ pl: 0 }}
          >
            <Link
              underline="none"
              color="neutral"
              href="#some-link"
              aria-label="Home"
            >
             <Lk to='/Home' style={{textDecoration:'none'}}><HomeRoundedIcon /></Lk>
            </Link>
            <Typography color="primary" fontWeight={500} fontSize={12}>
              My profile
            </Typography>
          </Breadcrumbs>
          <Typography level="h2" component="h1" sx={{ mt: 1, mb: 2 }}>
            My profile
          </Typography>
        </Box>
        
      </Box> */}

      <Box sx={{ display: "flex", flexDirection: "row", marginTop: "70px" }}>
        <Sidebar />
        <Stack
          spacing={4}
          sx={{
            display: "flex",
            maxWidth: "800px",
            width: "700px",
            marginTop: "30px",
            mx: "auto",
            px: { xs: 2, md: 6 },
            py: { xs: 2, md: 3 },
          }}
        >
          <Card>
            <Box sx={{ mb: 1 }}>
              <Typography level="title-md">Personal info</Typography>
              <Typography level="body-sm">
                Customize how your profile information will appear to the
                networks.
              </Typography>
            </Box>
            <Divider />
            <Stack
              direction="row"
              spacing={3}
              sx={{ display: { xs: "none", md: "flex" }, my: 1 }}
            >
              <Stack direction="column" spacing={1}>
                <AspectRatio
                  ratio="1"
                  maxHeight={200}
                  sx={{ flex: 1, minWidth: 120, borderRadius: "100%" }}
                >
                  <img
                    src={
                      selectedImage
                        ? URL.createObjectURL(selectedImage)
                        : "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
                    }
                    loading="lazy"
                    alt=""
                  />
                </AspectRatio>
                <input
                  type="file"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                />
                <IconButton
                  aria-label="upload new picture"
                  size="sm"
                  variant="outlined"
                  color="neutral"
                  sx={{
                    bgcolor: "background.body",
                    position: "absolute",
                    zIndex: 2,
                    borderRadius: "50%",
                    left: 100,
                    top: 170,
                    boxShadow: "sm",
                  }}
                  onClick={handleEditIconClick}
                >
                  <EditRoundedIcon />
                </IconButton>
              </Stack>
              <Stack spacing={2} sx={{ flexGrow: 1 }}>
                <Stack spacing={1}>
                  <FormLabel>Name</FormLabel>
                  <FormControl
                    sx={{
                      display: { sm: "flex-column", md: "flex-row" },
                      gap: 2,
                    }}
                  >
                    <Input
                      size="sm"
                      placeholder="Full name"
                      name="fullName"
                      value={fullName}
                      onChange={handleFullNameChange}
                    />
                  </FormControl>
                </Stack>
                <Stack spacing={1}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    size="sm"
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={email}
                    onChange={handleEmailChange}
                  />
                </Stack>
                <Button size="sm" variant="outlined" color="primary">
                  <Lk
                    to="/change-password"
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    Change Password
                  </Lk>
                </Button>
              </Stack>
            </Stack>
          </Card>

          <Card>
            <Box sx={{ mb: 1 }}>
              <Typography level="title-md">Bio</Typography>
              <Typography level="body-sm">
                Write a short introduction to be displayed on your profile.
              </Typography>
            </Box>
            <Divider />
            <Stack spacing={2} sx={{ my: 1 }}>
              <FormControl>
                <Textarea
                  size="sm"
                  minRows={4}
                  sx={{ mt: 1.5 }}
                  name="bio"
                  value={bio}
                  onChange={handleBioChange}
                />
              </FormControl>
              <FormHelperText sx={{ mt: 0.75, fontSize: "xs" }}>
                275 characters limit
              </FormHelperText>
            </Stack>
            <CardOverflow
              sx={{ borderTop: "1px solid", borderColor: "divider" }}
            >
              <CardActions sx={{ alignSelf: "flex-end", pt: 2 }}>
                <Button size="sm" variant="outlined" color="neutral">
                  Cancel
                </Button>
                <Button size="sm" variant="solid" onClick={handleSaveChanges}>
                  Save Changes
                </Button>
              </CardActions>
            </CardOverflow>
          </Card>
        </Stack>
      </Box>
    </Box>
  );
}
