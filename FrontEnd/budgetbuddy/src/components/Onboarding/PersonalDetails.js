import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useOnboardingState } from "../../Hooks/useOnboardingState";
import { Field } from "../OnboardingParts/Field";
import { Form } from "../OnboardingParts/Form";
import { Input } from "../OnboardingParts/Input"; // Assuming Input is exported as default
import { Button } from "../OnboardingParts/Button"; // Assuming Button is exported as default
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

  // Local state to manage form inputs
  const [formData, setFormData] = useState({
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
        <h3>Personal Details</h3>
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
                className="form-control"
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
                className="form-control"
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
                className="form-control"
              />
            </Field>
          </div>
          <div className="col-md-6">
            <Field label="Country (Where you live)">
              <Input
                name="country"
                type="text"
                id="country"
                placeholder="ex. Canada"
                value={formData.country}
                onChange={handleChange}
                className="form-control"
              />
            </Field>
          </div>
          <div className="col-md-6">
            <Field label="Occupation">
              <Input
                name="occupation"
                type="text"
                id="occupation"
                placeholder="ex. Sales Manager"
                value={formData.occupation}
                onChange={handleChange}
                className="form-control"
              />
            </Field>
          </div>
        </div>
      </div>
      <div className="container mt-3">
        <div className="row">
          <div className="col-md-12 text-right">
            <Button
              type="submit"
              className="btn btn-primary d-inline-flex p-2 justify-items-end"
            >
              Save & Next {">"}
            </Button>
          </div>
        </div>
      </div>
    </Form>
  );
};
