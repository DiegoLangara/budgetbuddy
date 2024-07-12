import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboardingState } from "../../Hooks/useOnboardingState";
import { Field } from "../OnboardingParts/Field";
import { Form } from "../OnboardingParts/Form";
import { Input } from "../OnboardingParts/Input";
import { useAuth } from "../../contexts/AuthContext";
import { Card, Container, Button as BootstrapButton } from "react-bootstrap";
import logo from "../../Assets/Logonn.png"; // Import the logo
import "../../css/PersonalDetails.css"; // Import the CSS file

// Utility function to format the date
const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

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

export const PersonalDetails = () => {
  const [state, setState] = useOnboardingState();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const token = currentUser.token;
  const user_id = currentUser.id;

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    dob: "",
    country: "",
    occupation: "",
  });

  const [formErrors, setFormErrors] = useState({
    firstname: "",
    lastname: "",
    dob: "",
    country: "",
    occupation: "",
  });

  useEffect(() => {
    async function fetchData() {
      const user = await fetchPersonalDetails(user_id, token);
      if (user) {
        const formattedUser = {
          ...user,
          dob: user.dob ? formatDate(user.dob) : "",
        };
        setFormData(formattedUser);
        setState(formattedUser);
      }
    }
    fetchData();
  }, [user_id, token, setState]);

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

  const validateForm = () => {
    const errors = {};
    if (!formData.firstname) errors.firstname = "Input required";
    if (!formData.lastname) errors.lastname = "Input required";
    if (!formData.dob) errors.dob = "Input required";
    if (!formData.country) errors.country = "Input required";
    if (!formData.occupation) errors.occupation = "Input required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveToDatabase = async (data) => {
    try {
      const response = await fetch(
        `https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/user/`,
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

  const saveData = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const updatedData = { ...state, ...formData };
    setState(updatedData);
    await saveToDatabase(updatedData);
    navigate("/onboarding/goals");
  };

  return (
    <div className="personal-details-background">
      <Container className="d-flex align-items-center justify-content-center personal-details-background-container">
        <Card className="card">
          <Card.Body className="mb-0">
            <div className="d-flex align-items-center mb-4">
              <img
                src={logo}
                alt="Budget Buddy Logo"
                className="img-black w-2vw"
              />
              <h3 className="text-left mb-0 ml-1">Budget Buddy</h3>
            </div>
            <Form onSubmit={saveData} className="my-4 mx-0">
              <h3 className="mb-3 mt-2" style={{ fontSize: "2.2rem" }}>
                Personal Details
              </h3>
              <p className="mb-5" style={{ fontSize: "1rem" }}>
                Before we begin, let’s go over your basic details.
              </p>
              <div className="container px-0 pb-4">
                <div className="form-row">
                  <div className="col-md-6 form-group">
                    <Field label="First Name">
                      <Input
                        name="firstname"
                        type="text"
                        id="firstname"
                        placeholder="First Name"
                        value={formData.firstname}
                        onChange={handleChange}
                        error={formErrors.firstname}
                        required
                      />
                    </Field>
                  </div>
                  <div className="col-md-6 form-group">
                    <Field label="Last Name">
                      <Input
                        name="lastname"
                        type="text"
                        id="lastname"
                        placeholder="Last Name"
                        value={formData.lastname}
                        onChange={handleChange}
                        error={formErrors.lastname}
                        required
                      />
                    </Field>
                  </div>
                </div>
                <div className="form-group">
                  <Field label="Date of Birth">
                    <Input
                      name="dob"
                      type="date"
                      id="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      error={formErrors.dob}
                      required
                    />
                  </Field>
                </div>
                <div className="form-group">
                  <Field label="Country (Where you live)">
                    <Input
                      name="country"
                      type="text"
                      id="country"
                      placeholder="e.g. Canada"
                      value={formData.country}
                      onChange={handleChange}
                      error={formErrors.country}
                      required
                    />
                  </Field>
                </div>
                <div className="form-group">
                  <Field label="Occupation">
                    <Input
                      name="occupation"
                      type="text"
                      id="occupation"
                      placeholder="e.g. Sales Manager"
                      value={formData.occupation}
                      onChange={handleChange}
                      error={formErrors.occupation}
                      required
                    />
                  </Field>
                </div>
              </div>
              <div className="container">
                <div className="row">
                  <div className="col-md-12 px-0 pt-2">
                    <BootstrapButton
                      type="submit"
                      className="w-100 submit-btn-personal-details"
                    >
                      Continue
                    </BootstrapButton>
                  </div>
                </div>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};
