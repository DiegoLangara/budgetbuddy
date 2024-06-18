import React, { useEffect } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useOnboardingState } from "../../Hooks/useOnboardingState";
import { Field } from "../OnboardingParts/Field";
import { Form } from "../OnboardingParts/Form";
import { Input } from "../OnboardingParts/Input";
import { Button } from "../OnboardingParts/Button";

// Diego's DB Test
// Improved personalDetails function with error handling
// async function personalDetails(id, token) {
//   try {
//     const response = await fetch(
//       `https://inteligencia.ec/budgetbuddy/backend/user/${id}`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           token: token,
//         },
//         // credentials: "include", // Uncomment if using cookies
//       }
//     );
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     return await response.json();
//   } catch (error) {
//     console.error("Failed to fetch personal details:", error);
//     return null;
//   }
// }

export const PersonalDetails = () => {
  const [state, setState] = useOnboardingState();
  const { handleSubmit, register, setValue } = useForm({
    defaultValues: state,
  });
  const navigate = useNavigate();

  // Diego's DB Test
  // Fetch and populate form with personal details
  // useEffect(() => {
  //   async function fetchData() {
  //     const user = await personalDetails(
  //       13,
  //       "0a2ebfd62a439afd739953435b8749cc"
  //     );
  //     if (user) {
  //       // Populate form fields with fetched data
  //       Object.entries(user).forEach(([key, value]) => {
  //         if (value !== null && value !== undefined) {
  //           setValue(key, value);
  //         }
  //       });
  //     }
  //   }
  //   fetchData();
  // }, [setValue]);

  useEffect(() => {
    if (state) {
      setValue("firstName", state.firstName);
      setValue("lastName", state.lastName);
      setValue("email", state.email);
      setValue("phone", state.phone);
      setValue("address", state.address);
    }
  }, [setValue, state]);

  const saveToDatabase = async (data) => {
    try {
      const response = await fetch("/api/saveDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const responseData = await response.json();
      console.log("Data saved successfully:", responseData);
    } catch (error) {
      console.error("Failed to save data:", error);
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
        {/* <p>********** Diego's DB test **********</p> */}
        {/* <Field label="Email" error={errors.firstName}>
        <Input
          {...register("email")}
          type="email"
          id="email"
          placeholder="email@domain.com"
        />
      </Field> */}

        <Field label="First Name">
          <Input
            {...register("firstName")}
            type="text"
            id="first-name"
            placeholder="First Name"
          />
        </Field>
        <Field label="Last Name">
          <Input
            {...register("lastName")}
            type="text"
            id="last-name"
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
