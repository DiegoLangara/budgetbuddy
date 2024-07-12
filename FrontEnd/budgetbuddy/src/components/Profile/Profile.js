import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "../OnboardingParts/Button";
import { useAuth } from "../../contexts/AuthContext";

async function fetchPersonalDetails(user_id, token) {
  try {
    const response = await fetch(
      `https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/user/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: token,
          user_id: user_id,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch personal details:", error);
    return null;
  }
}

export const Profile = ({ open, onClose }) => {
  const { currentUser } = useAuth();
  const token = currentUser.token;
  const user_id = currentUser.id;

  const [formData, setFormData] = useState({
    email: "",
    firstname: "",
    lastname: "",
    password: "",
    aboutme: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    firstname: "",
    lastname: "",
    password: "",
    aboutme: "",
  });

  const [editMode, setEditMode] = useState(false);

  const handleEditToggle = (event) => {
    event.preventDefault();
    setEditMode(!editMode);
  };

  useEffect(() => {
    async function fetchData() {
      const user = await fetchPersonalDetails(user_id, token);
      console.log(user);
      if (user) {
        const formattedUser = {
          ...user,
        };
        setFormData(formattedUser);
      }
    }
    fetchData();
  }, [user_id, token]);

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <ProfileContainer>
        <ProfileHeader>
          <Typography variant="h6">Profile</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </ProfileHeader>
        <Typography>
          Make changes to your profile here. Click save when you're done.
        </Typography>
        <Box
          component="form"
          sx={{ mt: 2 }}
          onSubmit={(e) => e.preventDefault()}
        >
          <Box
            display="flex"
            gap="2rem"
            flexDirection="column"
            alignItems="center"
          >
            <Avatar
              src="/path/to/profile-image.jpg"
              sx={{ width: 120, height: 120 }}
            />
            <Button>Change</Button>
          </Box>
          <FormGroup>
            <Typography variant="h6">Contact Information</Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={4}>
                <Typography textAlign={"right"}>Email</Typography>
              </Grid>
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  type="email"
                  value={formData.email}
                  InputProps={{ readOnly: !editMode }}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={4}>
                <Typography textAlign={"right"}>First Name</Typography>
              </Grid>
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  type="text"
                  value={formData.firstname}
                  InputProps={{ readOnly: !editMode }}
                  onChange={(e) =>
                    setFormData({ ...formData, firstname: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={4}>
                <Typography textAlign={"right"}>Last Name</Typography>
              </Grid>
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  type="text"
                  value={formData.lastname}
                  InputProps={{ readOnly: !editMode }}
                  onChange={(e) =>
                    setFormData({ ...formData, lastname: e.target.value })
                  }
                />
              </Grid>
            </Grid>
          </FormGroup>
          <FormGroup>
            <Typography variant="h6">Change Password</Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={4}>
                <Typography textAlign={"right"}>Password</Typography>
              </Grid>
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  type="password"
                  value={formData.password}
                  InputProps={{ readOnly: !editMode }}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </Grid>
            </Grid>
          </FormGroup>
          <FormGroup>
            <Typography variant="h6">About me</Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  value={formData.aboutme}
                  InputProps={{ readOnly: !editMode }}
                  onChange={(e) =>
                    setFormData({ ...formData, aboutme: e.target.value })
                  }
                />
              </Grid>
            </Grid>
          </FormGroup>
          <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
            {editMode ? (
              <>
                <Button variant="contained" onClick={handleEditToggle}>
                  save
                </Button>
                <Button variant="outlined" onClick={handleEditToggle}>
                  cancel
                </Button>
              </>
            ) : (
              <Button variant="outlined" onClick={handleEditToggle}>
                edit
              </Button>
            )}
          </Box>
        </Box>
      </ProfileContainer>
    </Drawer>
  );
};

const ProfileContainer = styled(Box)`
  width: 400px;
  padding: 20px;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ProfileHeader = styled(Box)`
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FormGroup = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 2rem;
`;

const EditButton = styled(Button)`
  align-self: flex-end;
`;

export default Profile;
