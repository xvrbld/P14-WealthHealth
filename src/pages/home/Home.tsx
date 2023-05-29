import styles from "./Home.module.scss";
import { Link } from "react-router-dom";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import statesData from "data/States.json";
import { MyModal } from "oc-modal-library";

interface EmployeeData {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  startDate: Date;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  department: string | null;
}

function Home() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [zipCode, setZipCode] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );
  const [showConfirmation, setShowConfirmation] = useState(false);

  function saveEmployee(): void {
    const employee = {
      firstName,
      lastName,
      dateOfBirth,
      startDate,
      address: {
        street,
        city,
        state: selectedState,
        zipCode,
      },
      department: selectedDepartment,
    };
  
    // Retrieve existing employee data from local storage
    const storedData = localStorage.getItem("employeeData");
    let existingData: EmployeeData[] = [];
    if (storedData) {
      existingData = JSON.parse(storedData);
    }
  
    // Make sure existingData is an array
    if (!Array.isArray(existingData)) {
      existingData = [];
    }
  
    // Add the new employee to the existing data
    const updatedData = [...existingData, employee];
  
    // Save updated employee data to local storage
    localStorage.setItem("employeeData", JSON.stringify(updatedData));
  
    setShowConfirmation(true); // Show confirmation text
  }

  const stateOptions = statesData.map((state) => ({
    value: state.abbreviation,
    label: state.name,
  }));

  const departmentOptions = [
    { value: "Sales", label: "Sales" },
    { value: "Marketing", label: "Marketing" },
    { value: "Engineering", label: "Engineering" },
    { value: "Human Resources", label: "Human Resources" },
    { value: "Legal", label: "Legal" },
  ];

  return (
    <div className={styles.home}>
      <div className={styles.title}>
        <h1>HRnet</h1>
      </div>
      <div className={styles.container}>
        <Link to="/employee-list">View Current Employees</Link>
        <h2>Create Employee</h2>
        <form action="#" id="create-employee">
          <label htmlFor="first-name">First Name</label>
          <input
            type="text"
            id="first-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <label htmlFor="last-name">Last Name</label>
          <input
            type="text"
            id="last-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <label htmlFor="date-of-birth">Date of Birth</label>
          <DatePicker
            selected={dateOfBirth}
            onChange={(date: any) => setDateOfBirth(date)}
          />

          <label htmlFor="start-date">Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date: any) => setStartDate(date)}
          />

          <fieldset className={styles.address}>
            <legend>Address</legend>

            <label htmlFor="street">Street</label>
            <input
              id="street"
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />

            <label htmlFor="city">City</label>
            <input
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />

            <label htmlFor="state">State</label>
            <Select
              options={stateOptions}
              id="state"
              className={styles.select}
              value={
                selectedState
                  ? { value: selectedState, label: selectedState }
                  : null
              }
              onChange={(selectedOption) =>
                setSelectedState(selectedOption ? selectedOption.value : null)
              }
            />
            <label htmlFor="zip-code">Zip Code</label>
            <input
              id="zip-code"
              type="number"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
            />
          </fieldset>

          <label htmlFor="department">Department</label>
          <Select
            options={departmentOptions}
            id="department"
            className={styles.select}
            value={
              selectedDepartment
                ? { value: selectedDepartment, label: selectedDepartment }
                : null
            }
            onChange={(selectedOption) =>
              setSelectedDepartment(
                selectedOption ? selectedOption.value : null
              )
            }
          />
        </form>

        <button onClick={saveEmployee}>Save</button>

        {showConfirmation && (
          <div id="confirmation" className={styles.modal}>
            Employee Created!
          </div>
        )}
      </div>
      <MyModal open={showConfirmation} title='Test' />
    </div>
  );
}

export default Home;
