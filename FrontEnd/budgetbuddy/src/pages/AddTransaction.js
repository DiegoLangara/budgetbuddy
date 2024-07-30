import React, { useState, useEffect, useRef, useCallback } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../contexts/AuthContext";
import {
  faMoneyBill,
  faBagShopping,
  faCreditCard,
  faBullseye,
  faUpload,
  faCamera,
  faCalendar,
  faDollarSign,
} from "@fortawesome/free-solid-svg-icons";
import Webcam from "react-webcam";
import "../css/AddTransaction.css"; // Ensure you have corresponding CSS for styling
import { useParams } from "react-router-dom";
import { useTheme, useMediaQuery } from "@mui/material";
import styled from "styled-components";
import Swal from "sweetalert2";

export const AddTransaction = () => {
  const money_format = (value) => {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const token = currentUser.token;
  const user_id = currentUser.id;

  const [showModal, setShowModal] = useState(false);
  const [transactionType, setTransactionType] = useState("budgets");
  const [pocket, setPocket] = useState("");
  const [payee, setPayee] = useState("");
  const [note, setNote] = useState("");
  const [amount, setAmount] = useState("");
  const [createNew, setCreateNew] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [pocketOptions, setPocketOptions] = useState([]);
  const [incomeAccID, setIncomeAccID] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [balance, setBalance] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10)); // Current date set by default
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const Container_home = styled.div`
    width: 97%;
    padding: ${(props) =>
      props.isMobile ? "1vh" : "1vh 10vw 3vh calc(10vw + 63px)"};
    margin: 0 auto;
  `;

  // transaction id passed from ExpenseTable.js to edit data
  const { id } = useParams();
  console.log("Transaction ID:", id);

  const webcamRef = useRef(null);

  useEffect(() => {
    fetchBudgets();
    fetchBalance();
    navigator.mediaDevices.enumerateDevices().then((deviceInfos) => {
      const videoDevices = deviceInfos.filter(
        (device) => device.kind === "videoinput"
      );
      setDevices(videoDevices);
      if (videoDevices.length > 0) {
        setSelectedDevice(videoDevices[0].deviceId);
      }
    });
  }, []);

  const fetchBalance = async () => {
    const response = await fetch(
      "https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/balance/",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: token,
          user_id: user_id,
          type: "income",
        },
      }
    );
    const data = await response.json();
    setBalance(data.balance);
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setShowCamera(false);
    setShowUpload(false);
  };

  const handleSaveImage = (url, base64) => {
    setImageUrl(url);
    setImageBase64(base64);
    handleCloseModal();
  };

  const handleSaveTransaction = async () => {
    if (parseFloat(amount) > parseFloat(balance)) {
      if (transactionType !== "income") {
        Swal.fire({
          position: "center",
          icon: "error",
          title:
            "Amount exceeds available balance, please add some income to increase available funds, or revise the amount you would like to pay in your " +
            transactionType,
          showConfirmButton: false,
          timer: 3000,
          width: "600px",
        });

        return;
      }
    }

    const transactionData = {
      transaction_date: date, // Add date to transaction data
      transaction_payee:
        transactionType === "debts" || transactionType === "goals" ? "" : payee,
      transaction_note: note,
      transaction_amount: parseFloat(amount),
      transaction_image_url: imageBase64,
      transaction_category: transactionType,
      id_type_account:
        transactionType === "income" ? parseInt(incomeAccID) : parseInt(pocket),
    };

    console.log(transactionData);

    try {
      const response = await fetch(
        "https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/transaction",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
            user_id: user_id,
          },
          body: JSON.stringify(transactionData),
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        // Transaction saved successfully
        console.log("Transaction saved successfully");

        Swal.fire({
          position: "center",
          icon: "success",
          title: `${responseData.message}`,
          showConfirmButton: false,
          timer: 3000,
          width: "600px",
        });

        if (createNew) {
          // Reset all fields and update balance
          handleTransactionTypeChange("budgets");
          setPocket("");
          setPayee("");
          setNote("");
          setAmount("");
          setImageUrl("");
          setImageBase64("");
          fetchBalance();
        } else {
          // Navigate away to home/expenses
          navigate("/home/expenses");
        }
      } else {
        // Handle error
        console.log("Error saving transaction");

        Swal.fire({
          position: "center",
          icon: "error",
          title: `${responseData.message}`,
          showConfirmButton: false,
          timer: 3000,
          width: "600px",
        });
      }
    } catch (error) {
      console.log("Error:", error);

      Swal.fire({
        position: "center",
        icon: "error",
        title: `An unexpected error occurred. Please try again.`,
        showConfirmButton: false,
        timer: 3000,
        width: "600px",
      });
    }
  };

  const handleCancel = () => {
    handleTransactionTypeChange("budgets");
    setPocket("");
    setPayee("");
    setNote("");
    setAmount("");
    setImageUrl("");
    setImageBase64("");
    setCreateNew(false);

    // Navigate away to home/expenses
    navigate("/home/expenses");
  };

  const fetchGoals = useCallback(async () => {
    const response = await fetch(
      "https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/goals/",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: token,
          user_id: user_id,
        },
      }
    );
    const data = await response.json();
    const options = data.map((goal) => ({
      value: goal.goal_id,
      label: goal.goal_name,
    }));
    setPocketOptions(options);
  }, [token, user_id]);

  const fetchDebts = useCallback(async () => {
    const response = await fetch(
      "https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/debts/",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: token,
          user_id: user_id,
        },
      }
    );
    const data = await response.json();
    const options = data.map((debt) => ({
      value: debt.debt_id,
      label: debt.debt_name,
    }));
    setPocketOptions(options);
  }, [token, user_id]);

  const fetchBudgets = useCallback(async () => {
    const response = await fetch(
      "https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/budgets/",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: token,
          user_id: user_id,
        },
      }
    );
    const data = await response.json();
    const options = data.map((budget) => ({
      value: budget.budget_id,
      label: budget.budget_name,
    }));
    setPocketOptions(options);
  }, [token, user_id]);

  const fetchIncomes = useCallback(async () => {
    const response = await fetch(
      "https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/incomes/",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: token,
          user_id: user_id,
        },
      }
    );
    const data = await response.json();
    const options = data.map((income) => ({
      value: income.income_id,
      label: income.income_name,
    }));
    setPocketOptions(options);
    setIncomeAccID(data[0].account_id);
  }, [token, user_id]);

  const handleTransactionTypeChange = useCallback(
    (type) => {
      setTransactionType(type);
      setPocket("");
      setPocketOptions([]);

      switch (type) {
        case "goals":
          fetchGoals();
          break;
        case "debts":
          fetchDebts();
          break;
        case "budgets":
          fetchBudgets();
          break;
        case "income":
          fetchIncomes();
          break;
        default:
          break;
      }
    },
    [fetchGoals, fetchDebts, fetchBudgets, fetchIncomes]
  );

  const validateAmount = useCallback((value) => {
    const regex = /^\d*\.?\d{0,2}$/;
    if (regex.test(value) && value >= 0) {
      setAmount(value);
    }
  }, []);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    handleSaveImage(imageSrc, imageSrc);
  }, [webcamRef]);

  const handleDeviceChange = (e) => {
    setSelectedDevice(e.target.value);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result
        .replace("data:", "")
        .replace(/^.+,/, "");
      handleSaveImage(reader.result, base64String);
    };
    reader.readAsDataURL(file);
  };
  const ShowBtns = (camera, upload) => {
    setShowCamera(camera);
    setShowUpload(upload);
  };

  return (
    <div className="addTransactions">
      <div className="transaction_header">
        <h1>Create a transaction</h1>
        <h2>
          Available Funds: <br /> ${money_format(balance)}
        </h2>
      </div>
      <Form>
        <Form.Group controlId="transactionType">
          <Form.Label>What kind of transaction do you want to make?</Form.Label>
          <div className="transaction-options">
            <Form.Check
              type="radio"
              id="trackExpense"
              name="transactionType"
              label={
                <>
                  <FontAwesomeIcon icon={faBagShopping} />
                  Track Expense
                </>
              }
              value="budgets"
              checked={transactionType === "budgets"}
              onChange={(e) => handleTransactionTypeChange(e.target.value)}
              className="transaction-option"
            />
            <Form.Check
              type="radio"
              id="payDebt"
              name="transactionType"
              label={
                <>
                  <FontAwesomeIcon icon={faCreditCard} />
                  Pay a Debt
                </>
              }
              value="debts"
              checked={transactionType === "debts"}
              onChange={(e) => handleTransactionTypeChange(e.target.value)}
              className="transaction-option"
            />
            <Form.Check
              type="radio"
              id="contributeGoal"
              name="transactionType"
              label={
                <>
                  <FontAwesomeIcon icon={faBullseye} />
                  Contribute to a Goal
                </>
              }
              value="goals"
              checked={transactionType === "goals"}
              onChange={(e) => handleTransactionTypeChange(e.target.value)}
              className="transaction-option"
            />
            <Form.Check
              type="radio"
              id="addIncome"
              name="transactionType"
              label={
                <>
                  <FontAwesomeIcon icon={faMoneyBill} />
                  Add Income
                </>
              }
              value="income"
              checked={transactionType === "income"}
              onChange={(e) => handleTransactionTypeChange(e.target.value)}
              className="transaction-option"
            />
          </div>
        </Form.Group>

        <Form.Group controlId="pocket">
          <Form.Label>Please select a category:</Form.Label>
          <Form.Control
            as="select"
            value={pocket}
            onChange={(e) => setPocket(e.target.value)}
            required
          >
            <option value="" disabled>
              Select
            </option>
            {pocketOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        {transactionType !== "debts" && transactionType !== "goals" && (
          <Form.Group controlId="payee">
            <Form.Label>
              {transactionType === "income" ? "Payer" : "Payee"}
            </Form.Label>
            <Form.Control
              type="text"
              value={payee}
              onChange={(e) => setPayee(e.target.value)}
              required
            />
          </Form.Group>
        )}

        <Form.Group controlId="note">
          <Form.Label>Note</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="amount">
          <Form.Label>Amount</Form.Label>
          <div className="amount-field">
            <Form.Control
              type="number"
              value={amount}
              onChange={(e) => validateAmount(e.target.value)}
              required
            />
            <FontAwesomeIcon icon={faDollarSign} className="icon-dollar" />
          </div>
        </Form.Group>

        <Form.Group controlId="date">
          <Form.Label>Select the date</Form.Label>
          <div className="date-field">
            <Form.Control
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <FontAwesomeIcon icon={faCalendar} className="icon-calendar" />
          </div>
        </Form.Group>

        <Form.Group controlId="image">
          <Form.Label>Upload your receipt or take a picture</Form.Label>
          <Button
            variant="secondary"
            onClick={handleShowModal}
            className="upload-btn"
          >
            <FontAwesomeIcon icon={faUpload} /> click to upload your receipt
          </Button>
        </Form.Group>

        <Form.Group controlId="createNew">
          <Form.Check
            type="checkbox"
            label="Create a new transaction after this"
            checked={createNew}
            onChange={(e) => setCreateNew(e.target.checked)}
          />
        </Form.Group>
        <div className="buttons_footer">
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>

          <Button variant="primary" onClick={handleSaveTransaction}>
            Add
          </Button>
        </div>
      </Form>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="image-options">
            <Button
              className="internal-btn"
              onClick={() => ShowBtns(false, true)}
            >
              <FontAwesomeIcon icon={faUpload} /> <span>Upload a Picture</span>
            </Button>
            <Button
              className="internal-btn"
              onClick={() => ShowBtns(true, false)}
            >
              <FontAwesomeIcon icon={faCamera} /> Take a Picture
            </Button>
          </div>
          {showUpload && (
            <Form.File
              id="custom-file"
              label="Choose file"
              custom
              accept="image/*"
              onChange={handleFileUpload}
            />
          )}
          {showCamera && (
            <div className="webcam-container">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ deviceId: selectedDevice }}
                className="webcam"
              />
              {devices.length > 1 && (
                <Form.Group controlId="cameraSelect">
                  <Form.Label>Choose Camera</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedDevice}
                    onChange={handleDeviceChange}
                  >
                    {devices.map((device, idx) => (
                      <option key={device.deviceId} value={device.deviceId}>
                        {device.label || `Camera ${idx + 1}`}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              )}
              <Button onClick={capture}>Capture Image</Button>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
