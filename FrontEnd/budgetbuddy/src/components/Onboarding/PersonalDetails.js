import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboardingState } from "../../Hooks/useOnboardingState";
import { Field } from "../OnboardingParts/Field";
import { Form } from "../OnboardingParts/Form";
import { Input } from "../OnboardingParts/Input";
import { Button } from "../OnboardingParts/Button";
import { useAuth } from "../../contexts/AuthContext";

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
  // console.log(token, user_id);

  // Local state to manage form inputs
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    dob: "",
    country: "",
    occupation: "",
  });

  // State to manage form errors
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
      console.log("Fetched user data:", user); // Debug output
      if (user) {
        const formattedUser = {
          ...user,
          dob: user.dob ? formatDate(user.dob) : "",
        };
        setFormData(formattedUser);
        setState(formattedUser); // Initialize state with fetched data
      }
    }
    fetchData();
  }, [user_id, token, setState]);

  // Handle input change
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
  // Errors for form validation
  const validateForm = () => {
    const errors = {};
    if (!formData.firstname) {
      errors.firstname = "Input required";
    }
    if (!formData.lastname) {
      errors.lastname = "Input required";
    }
    if (!formData.dob) {
      errors.dob = "Input required";
    }
    if (!formData.country) {
      errors.country = "Input required";
    }
    if (!formData.occupation) {
      errors.occupation = "Input required";
    }
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
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const responseData = await response.json();
      console.log("Data updated successfully:", responseData);
    } catch (error) {
      console.error("Failed to update data:", error);
    }
  };

  const saveData = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const updatedData = {
      ...state,
      ...formData,
    };
    setState(updatedData);
    await saveToDatabase(updatedData);
    navigate("/onboarding/goals");
  };

  return (
    <Form onSubmit={saveData} className="my-4 mx-2">
      <div>
        <h3 className="mb-4 pt-5" style={{ fontSize: "2.5rem" }}>
          Personal Details
        </h3>
        <p className="mb-5" style={{ fontSize: "1.2rem" }}>
          Before we begin, let’s go over your basic details.
        </p>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-6">
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
          <div className="col-md-6">
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
          <div className="col-md-6">
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
          <div className="col-md-6">
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
          <div className="col-md-6">
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
      </div>
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-12 text-right">
            <Button type="submit" className="btn btn-primary p-2 w-100">
              Continue
            </Button>
          </div>
        </div>
      </div>
    </Form>
  );
};
