import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from "../contexts/AuthContext";
import { faMoneyBill, faBagShopping, faCreditCard, faBullseye, faUpload, faCamera } from '@fortawesome/free-solid-svg-icons';
import Webcam from 'react-webcam';
import '../css/AddTransaction.css'; // Ensure you have corresponding CSS for styling

export const AddTransaction = () => {
  const { currentUser } = useAuth();
  const token = currentUser.token;
  const user_id = currentUser.id;

  const [showModal, setShowModal] = useState(false);
  const [transactionType, setTransactionType] = useState('budgets');
  const [pocket, setPocket] = useState('');
  const [payee, setPayee] = useState('');
  const [note, setNote] = useState('');
  const [amount, setAmount] = useState('');
  const [createNew, setCreateNew] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [pocketOptions, setPocketOptions] = useState([]);
  const [showCamera, setShowCamera] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');

  const webcamRef = useRef(null);

  useEffect(() => {
    fetchBudgets();
    navigator.mediaDevices.enumerateDevices().then(deviceInfos => {
      const videoDevices = deviceInfos.filter(device => device.kind === 'videoinput');
      setDevices(videoDevices);
      if (videoDevices.length > 0) {
        setSelectedDevice(videoDevices[0].deviceId);
      }
    });
  }, []);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setShowCamera(false);
    setShowUpload(false);
  };
  const handleSaveImage = (url) => {
    setImageUrl(url);
    handleCloseModal();
  };

  const handleSaveTransaction = () => {
    // Logic to save transaction to the database
    // Example: saveTransaction({ transactionType, pocket, payee, note, amount, imageUrl, createNew });
  };

  const handleCancel = () => {
    setTransactionType('budgets');
    setPocket('');
    setPayee('');
    setNote('');
    setAmount('');
    setImageUrl('');
    setCreateNew(false);
  };

  const fetchGoals = async () => {
    const response = await fetch('https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/goals/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': token,
        'user_id': user_id,
      },
    });
    const data = await response.json();
    const options = data.map(goal => ({ value: goal.goal_id, label: goal.goal_name }));
    setPocketOptions(options);
  };

  const fetchDebts = async () => {
    const response = await fetch('https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/debts/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': token,
        'user_id': user_id,
      },
    });
    const data = await response.json();
    const options = data.map(debt => ({ value: debt.debt_id, label: debt.debt_name }));
    setPocketOptions(options);
  };

  const fetchBudgets = async () => {
    const response = await fetch('https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/budgets/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': token,
        'user_id': user_id,
      },
    });
    const data = await response.json();
    const options = data.map(budget => ({ value: budget.budget_id, label: budget.budget_name }));
    setPocketOptions(options);
  };

  const fetchIncomes = async () => {
    const response = await fetch('https://budget-buddy-ca-9ea877b346e7.herokuapp.com/api/incomes/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': token,
        'user_id': user_id,
      },
    });
    const data = await response.json();
    const options = data.map(income => ({ value: income.income_id, label: income.income_name }));
    setPocketOptions(options);
  };

  const handleTransactionTypeChange = (type) => {
    setTransactionType(type);
    setPocket('');
    setPocketOptions([]);

    switch (type) {
      case 'goals':
        fetchGoals();
        break;
      case 'debts':
        fetchDebts();
        break;
      case 'budgets':
        fetchBudgets();
        break;
      case 'income':
        fetchIncomes();
        break;
      default:
        break;
    }
  };

  const validateAmount = (value) => {
    const regex = /^\d*\.?\d{0,2}$/;
    if (regex.test(value) && value >= 0) {
      setAmount(value);
    }
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    // Logic to save the image to the server and get the URL
    handleSaveImage(imageSrc);
  }, [webcamRef]);

  return (
    <div className='addTransactions'>
      <h1>Transactions Page</h1>
      <Form>
        <Form.Group controlId="transactionType">
          <Form.Label>Type of Transaction</Form.Label>
          <div className="transaction-options">
            <Form.Check
              type="radio"
              id="trackExpense"
              name="transactionType"
              label={<><FontAwesomeIcon icon={faBagShopping} /><br />Track Expense</>}
              value="budgets"
              checked={transactionType === 'budgets'}
              onChange={(e) => handleTransactionTypeChange(e.target.value)}
              className="transaction-option"
            />
            <Form.Check
              type="radio"
              id="payDebt"
              name="transactionType"
              label={<><FontAwesomeIcon icon={faCreditCard} /><br />Pay a Debt</>}
              value="debts"
              checked={transactionType === 'debts'}
              onChange={(e) => handleTransactionTypeChange(e.target.value)}
              className="transaction-option"
            />
            <Form.Check
              type="radio"
              id="contributeGoal"
              name="transactionType"
              label={<><FontAwesomeIcon icon={faBullseye} /><br />Contribute to a Goal</>}
              value="goals"
              checked={transactionType === 'goals'}
              onChange={(e) => handleTransactionTypeChange(e.target.value)}
              className="transaction-option"
            />
            <Form.Check
              type="radio"
              id="addIncome"
              name="transactionType"
              label={<><FontAwesomeIcon icon={faMoneyBill} /><br />Add Income</>}
              value="income"
              checked={transactionType === 'income'}
              onChange={(e) => handleTransactionTypeChange(e.target.value)}
              className="transaction-option"
            />
          </div>
        </Form.Group>

        <Form.Group controlId="pocket">
          <Form.Label>Pocket</Form.Label>
          <Form.Control 
            as="select" 
            value={pocket} 
            onChange={(e) => setPocket(e.target.value)}
            required
          >
            <option value="" disabled>Select</option>
            {pocketOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="payee">
          <Form.Label>Payee</Form.Label>
          <Form.Control 
            type="text"
            value={payee}
            onChange={(e) => setPayee(e.target.value)}
            required
          />
        </Form.Group>

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
          <Form.Control 
            type="number"
            value={amount}
            onChange={(e) => validateAmount(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="image">
          <Form.Label>Image</Form.Label>
          <Button variant="secondary" onClick={handleShowModal}>Add Image</Button>
        </Form.Group>

        <Form.Group controlId="createNew">
          <Form.Check 
            type="checkbox" 
            label="Create a new transaction after this" 
            checked={createNew} 
            onChange={(e) => setCreateNew(e.target.checked)} 
          />
        </Form.Group>

        <Button variant="primary" onClick={handleSaveTransaction}>Save</Button>
        <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
      </Form>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="image-options">
            <Button variant="outline-primary" onClick={() => setShowUpload(true)}>
              <FontAwesomeIcon icon={faUpload} /> Upload a Picture
            </Button>
            <Button variant="outline-primary" onClick={() => setShowCamera(true)}>
              <FontAwesomeIcon icon={faCamera} /> Take a Picture
            </Button>
          </div>
          {showUpload && (
            <Form.File 
              id="custom-file"
              label="Choose file"
              custom
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                // Logic to upload the file to the server and get the URL
                handleSaveImage('uploaded_image_url');
              }}
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
                    onChange={(e) => setSelectedDevice(e.target.value)}
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
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
