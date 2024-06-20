import { Button } from "../OnboardingParts/Button";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

export const Welcome = () => {
  const navigate = useNavigate();

  const startOnboarding = () => {
    navigate("/onboarding/personal-details");
  };

  return (
    <StyledWelcome>
      <h1>Welcome to BudgetBuddy!!</h1>
      <p>
        In order to provide the best budgeting services BudgetBuddy has to
        offer, it is optimal for your to input your data.
      </p>
      <Button onClick={startOnboarding}>Start</Button>
    </StyledWelcome>
  );
};

const StyledWelcome = styled.div`
  margin: 5rem;
  text-align: center;
`;
