import React, { useState, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Avatar,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../../contexts/AuthContext";
import { Form } from "../ProfileParts/Form";
import { Field } from "../ProfileParts/Field";
import { Input } from "../ProfileParts/Input";
import { Button } from "../ProfileParts/Button";
import { FieldForTextBox } from "../ProfileParts/FieldForTextbox";
import { Textarea } from "../ProfileParts/Textarea";
import Swal from "sweetalert2";
import "../../css/Profile.css";

async function fetchPersonalDetails(user_id, token) {
  try {
    const response = await fetch(
      process.env.REACT_APP_API_HOST+`/api/user/profile`,
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
  const passwordRef = useRef();

  const validatePassword = (password) => {
    const re = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\W).{8,}$/;
    return re.test(password);
  };

  const [formData, setFormData] = useState({
    email: "",
    firstname: "",
    lastname: "",
    aboutme: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    firstname: "",
    lastname: "",
    aboutme: "",
    password: "",
  });

  const [editName, setEditName] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [editAboutMe, setEditAboutMe] = useState(false);

  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleEditToggle = (section) => (event) => {
    event.preventDefault();
    if (section === "name") setEditName(!editName);
    if (section === "password") setEditPassword(!editPassword);
    if (section === "aboutMe") setEditAboutMe(!editAboutMe);
  };

  useEffect(() => {
    async function fetchData() {
      const user = await fetchPersonalDetails(user_id, token);
      if (user) {
        setFormData(user);
      }
    }
    fetchData();
  }, [user_id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const saveToDatabase = async (data) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_HOST+`/api/user/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: token,
            user_id: user_id,
          },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) throw new Error("Network response was not ok");
      await response.json();
    } catch (error) {
      console.error("Failed to update data:", error);
    }
  };

  const validateForm = (fields) => {
    const errors = {};
    if (fields.includes("firstname") && !formData.firstname) errors.firstname = "Input required";
    if (fields.includes("lastname") && !formData.lastname) errors.lastname = "Input required";
    if (fields.includes("password")) {
      if (!formData.password) errors.password = "Input required";
      if (!validatePassword(formData.password)) errors.password = "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, and a special character.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveData = async (fields, e) => {
    e.preventDefault();
    if (!validateForm(fields)) return;
    const updatedData = fields.reduce((data, field) => {
      if (field === "password") {
        data[field] = passwordRef.current.value;
      } else {
        data[field] = formData[field];
      }
      return data;
    }, {});
    await saveToDatabase(updatedData);
    Swal.fire({
      position: "bottom-start",
      icon: "success",
      title: "Profile has been saved",
      showConfirmButton: false,
      timer: 1200,
      width: "300px",
      height: "200px",
    });
    // Reset the edit states
    setEditName(false);
    setEditPassword(false);
    setEditAboutMe(false);
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose} className="profile-expanded">
      <ProfileContainer>
        <ProfileHeader className="profile-header">
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
          <Form>
            <Typography variant="h6" mt={4} mb={3}>Contact Information</Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                <Field label="Email">
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    readOnly={true}
                  />
                </Field>
              </Grid>
              <Grid item xs={12}>
                <Field label="First Name">
                  <Input
                    name="firstname"
                    type="text"
                    value={formData.firstname}
                    readOnly={!editName}
                    onChange={handleChange}
                    error={formErrors.firstname}
                  />
                </Field>
              </Grid>
              <Grid item xs={12}>
                <Field label="Last Name">
                  <Input
                    name="lastname"
                    type="text"
                    value={formData.lastname}
                    readOnly={!editName}
                    onChange={handleChange}
                    error={formErrors.lastname}
                  />
                </Field>
              </Grid>
            </Grid>
            <Box className="profile-buttons">
              {editName ? (
                <>
                  <Button variant="contained" onClick={(e) => saveData(["firstname", "lastname"], e)}>
                    Save
                  </Button>
                  <Button variant="outlined" onClick={handleEditToggle("name")}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button variant="outlined" onClick={handleEditToggle("name")}>
                  Edit
                </Button>
              )}
            </Box>
            <Typography variant="h6" mt={4} mb={3}>Change Password</Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                <Field label="Password">
                  <Input
                    name="password"
                    type="password"
                    value={formData.password}
                    readOnly={!editPassword}
                    error={formErrors.password}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                  />
                </Field>
              </Grid>
            </Grid>
            <Box className="profile-buttons">
              {editPassword ? (
                <>
                  <Button variant="contained" onClick={(e) => saveData(["password"], e)}>
                    Save
                  </Button>
                  <Button variant="outlined" onClick={handleEditToggle("password")}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button variant="outlined" onClick={handleEditToggle("password")}>
                  Edit
                </Button>
              )}
            </Box>
            <Typography variant="h6" mt={4} mb={3}>About me</Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                <FieldForTextBox>
                  <Textarea
                    name="aboutme"
                    multiline
                    value={formData.aboutme}
                    readOnly={!editAboutMe}
                    onChange={handleChange}
                  />
                </FieldForTextBox>
              </Grid>
            </Grid>
            <Box className="profile-buttons">
              {editAboutMe ? (
                <>
                  <Button variant="contained" onClick={(e) => saveData(["aboutme"], e)}>
                    Save
                  </Button>
                  <Button variant="outlined" onClick={handleEditToggle("aboutMe")}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button variant="outlined" onClick={handleEditToggle("aboutMe")}>
                  Edit
                </Button>
              )}
            </Box>
          </Form>
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
