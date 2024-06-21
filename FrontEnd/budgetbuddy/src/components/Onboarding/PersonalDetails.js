import React, { useEffect } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
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
  const { handleSubmit, register, setValue } = useForm({
    defaultValues: state,
  });
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const token = currentUser.token;
  const user_id = currentUser.id;

  useEffect(() => {
    async function fetchData() {
      const user = await fetchPersonalDetails(user_id, token);
      console.log("Fetched user data:", user); // Debug output
      if (user) {
        Object.entries(user).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            if (key === "dob") {
              setValue(key, formatDate(value)); // Format date before setting
            } else {
              setValue(key, value);
            }
          }
        });
      }
    }
    fetchData();
  }, [setValue, user_id, token]);

  useEffect(() => {
    if (state) {
      setValue("firstname", state.firstname);
      setValue("lastname", state.lastname);
      setValue("dob", state.dob);
      setValue("country", state.country);
      setValue("occupation", state.occupation);
    }
  }, [setValue, state]);

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

  const saveData = async (data) => {
    const updatedData = {
      ...state,
      ...data,
    };
    setState(updatedData);
    await saveToDatabase(updatedData);
    navigate("/onboarding/goals");
  };

  return (
    <Form onSubmit={handleSubmit(saveData)}>
      <div style={{ margin: "2.1rem 0 2.2rem" }}>
        <h3>Personal Details</h3>
      </div>
      <StyledPersonalDetails>
        <Field label="First Name">
          <Input
            {...register("firstname")}
            type="text"
            id="firstname"
            placeholder="First Name"
          />
        </Field>
        <Field label="Last Name">
          <Input
            {...register("lastname")}
            type="text"
            id="lastname"
            placeholder="Last Name"
          />
        </Field>
        <Field label="Date of Birth">
          <Input {...register("dob")} type="date" id="dob" />
        </Field>
        <Field label="Country (Where you live)">
          <Input
            {...register("country")}
            type="text"
            id="country"
            placeholder="ex. Canada"
          />
        </Field>
        <Field label="Occupation">
          <Input
            {...register("occupation")}
            type="text"
            id="occupation"
            placeholder="ex. Sales Manager"
          />
        </Field>
      </StyledPersonalDetails>
      <StyledBottomBtnWrapper>
        <StyledLink to="/onboarding">{"<"} Return</StyledLink>
        <Button type="submit" style={{ padding: "0 .5rem" }}>
          Save & Next {">"}
        </Button>
      </StyledBottomBtnWrapper>
    </Form>
  );
};

const StyledPersonalDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  border: 1px solid #bbb;
  border-radius: 4px;
  padding: 0.7rem 1rem 1.3rem;
  margin-bottom: 5.3rem;
`;

const StyledLink = styled(Link)`
  display: inline-block;
  padding: 0.4rem 0.4rem;
  margin: 0 0 1.5rem;
  font-weight: bold;
  text-decoration: none;
  background-color: white;
  color: black;
  border: 2px solid black;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  &:hover {
    background-color: lightgray;
    text-decoration: none;
  }
`;

const StyledBottomBtnWrapper = styled.div`
  margin-top: 0.5rem;
  display: grid;
  grid-template-columns: auto auto;
  justify-content: space-between;
`;
