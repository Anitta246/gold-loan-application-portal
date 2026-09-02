import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [grossWeight, setGrossWeight] = useState("");
  const [netWeight, setNetWeight] = useState("");
  const [purity, setPurity] = useState("22");
  const [selectedPlan, setSelectedPlan] = useState("PLAN_BULLET_01");

  const [message, setMessage] = useState("");
  const [applicationId, setApplicationId] = useState("");

  const [applications, setApplications] = useState([]);
  const [showApplications, setShowApplications] = useState(false);
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);

  const pureGoldWeight =
    netWeight ? Number(netWeight) * (Number(purity) / 24) : 0;

  const goldPricePerGram = 7000;

  const totalGoldValue =
    pureGoldWeight * goldPricePerGram;

  const maximumLoanAmount =
    totalGoldValue * 0.75;

  /* ================= FETCH APPLICATIONS ================= */

  const fetchApplications = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/leads"
      );

      const data = await response.json();

      if (response.ok) {
        setApplications(data);
      }
    } catch (error) {
      console.log("Error loading applications");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  /* ================= MASK MOBILE ================= */

  const maskMobileNumber = (mobile) => {
    if (!mobile || mobile.length !== 10) return mobile;

    return `${mobile.substring(0, 4)}XXXX${mobile.substring(8)}`;
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    setMessage("");
    setApplicationId("");

    const data = {
      customerName,
      mobileNumber,
      grossWeightGrams: Number(grossWeight),
      netWeightGrams: Number(netWeight),
      purityKarat: Number(purity),
      selectedPlanId: selectedPlan
    };

    try {
      const response = await fetch(
        editingId
          ? `http://localhost:5000/api/v1/leads/${editingId}`
          : "http://localhost:5000/api/v1/leads/submit",
        {
          method: editingId ? "PUT" : "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(data)
        }
      );

      const result = await response.json();

      if (response.ok) {
        if (editingId) {
          setMessage("Application Updated Successfully!");
          setEditingId(null);
        } else {
          setMessage("Application Submitted Successfully!");

          setApplicationId(result.applicationId);
        }

        setCustomerName("");
        setMobileNumber("");
        setGrossWeight("");
        setNetWeight("");
        setPurity("22");
        setSelectedPlan("PLAN_BULLET_01");

        fetchApplications();

      } else {
        setMessage(`Error: ${result.message}`);
      }

    } catch (error) {
      setMessage("Error connecting to backend server");
    }
  };

  /* ================= EDIT ================= */

  const handleEdit = (application) => {
    setEditingId(application._id);

    setCustomerName(application.customerName);
    setMobileNumber(application.mobileNumber);
    setGrossWeight(application.grossWeightGrams);
    setNetWeight(application.netWeightGrams);
    setPurity(String(application.purityKarat));
    setSelectedPlan(application.selectedPlanId);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/leads/${id}`,
        {
          method: "DELETE"
        }
      );

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message);
        fetchApplications();
      } else {
        setMessage(`Error: ${result.message}`);
      }

    } catch (error) {
      setMessage("Error deleting application");
    }
  };

  /* ================= FILTER SEARCH ================= */

  const filteredApplications = applications.filter(
    (application) =>
      application.customerName
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      application.mobileNumber.includes(search)
  );

  /* ================= DASHBOARD ================= */

  const totalApplications = applications.length;

  const totalLoanAmount = applications.reduce(
    (total, application) =>
      total + application.maximumLoanAmount,
    0
  );

  return (
    <div className="container">

      <h1>🟡 Gold Loan Application Portal</h1>

      {/* DASHBOARD */}

      <div className="dashboard">

        <div className="dashboard-card">
          <h3>Total Applications</h3>
          <p>{totalApplications}</p>
        </div>

        <div className="dashboard-card">
          <h3>Total Loan Amount</h3>
          <p>₹{totalLoanAmount.toFixed(2)}</p>
        </div>

        <div className="dashboard-card">
          <h3>Gold Price / Gram</h3>
          <p>₹7000</p>
        </div>

      </div>

      {/* FORM */}

      <div className="form-card">

        <h2>
          {editingId
            ? "Edit Application"
            : "Customer & Gold Details"}
        </h2>

        <input
          type="text"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Mobile Number"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
        />

        <input
          type="number"
          placeholder="Gross Weight (grams)"
          value={grossWeight}
          onChange={(e) => setGrossWeight(e.target.value)}
        />

        <input
          type="number"
          placeholder="Net Weight (grams)"
          value={netWeight}
          onChange={(e) => setNetWeight(e.target.value)}
        />

        <select
          value={purity}
          onChange={(e) => setPurity(e.target.value)}
        >
          <option value="18">18K</option>
          <option value="22">22K</option>
          <option value="24">24K</option>
        </select>

        {/* CALCULATION */}

        <div className="calculator">

          <h2>Loan Calculation</h2>

          <p>
            <strong>Pure Gold Weight:</strong>{" "}
            {pureGoldWeight.toFixed(2)} grams
          </p>

          <p>
            <strong>Total Gold Value:</strong> ₹
            {totalGoldValue.toFixed(2)}
          </p>

          <p>
            <strong>Maximum Eligible Loan:</strong> ₹
            {maximumLoanAmount.toFixed(2)}
          </p>

        </div>

        {/* PLANS */}

        <h2>Select Loan Plan</h2>

        <div className="plan-container">

          <div
            className={`plan-card ${
              selectedPlan === "PLAN_BULLET_01"
                ? "selected"
                : ""
            }`}
            onClick={() =>
              setSelectedPlan("PLAN_BULLET_01")
            }
          >
            <h3>Bullet Repayment Plan</h3>
            <p>Interest Rate: 12%</p>
            <p>Maximum LTV: 75%</p>
          </div>

          <div
            className={`plan-card ${
              selectedPlan === "PLAN_EMI_01"
                ? "selected"
                : ""
            }`}
            onClick={() =>
              setSelectedPlan("PLAN_EMI_01")
            }
          >
            <h3>Monthly EMI Plan</h3>
            <p>Interest Rate: 14%</p>
            <p>Maximum LTV: 75%</p>
          </div>

        </div>

        <button
          className="submit-btn"
          onClick={handleSubmit}
        >
          {editingId
            ? "Update Application"
            : "Submit Application"}
        </button>

        {message && (
          <div className="message">

            <p>{message}</p>

            {applicationId && (
              <p>
                <strong>
                  Application ID:
                </strong>{" "}
                {applicationId}
              </p>
            )}

          </div>
        )}

        <button
          className="view-btn"
          onClick={() => {
            setShowApplications(!showApplications);
            fetchApplications();
          }}
        >
          {showApplications
            ? "Hide Applications"
            : "View All Applications"}
        </button>

      </div>

      {/* APPLICATION LIST */}

      {showApplications && (

        <div className="applications-card">

          <h2>All Loan Applications</h2>

          <input
            className="search-box"
            type="text"
            placeholder="🔍 Search by Name or Mobile Number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {filteredApplications.length === 0 ? (

            <p className="no-data">
              No applications found
            </p>

          ) : (

            filteredApplications.map(
              (application) => (

                <div
                  className="application-item"
                  key={application._id}
                >

                  <h3>
                    {application.customerName}
                  </h3>

                  <p>
                    <strong>Mobile:</strong>{" "}
                    {maskMobileNumber(
                      application.mobileNumber
                    )}
                  </p>

                  <p>
                    <strong>Gross Weight:</strong>{" "}
                    {application.grossWeightGrams} grams
                  </p>

                  <p>
                    <strong>Net Weight:</strong>{" "}
                    {application.netWeightGrams} grams
                  </p>

                  <p>
                    <strong>Purity:</strong>{" "}
                    {application.purityKarat}K
                  </p>

                  <p>
                    <strong>Maximum Loan:</strong> ₹
                    {application.maximumLoanAmount.toFixed(2)}
                  </p>

                  <p>
                    <strong>Plan:</strong>{" "}
                    {application.selectedPlanId ===
                    "PLAN_BULLET_01"
                      ? "Bullet Repayment Plan"
                      : "Monthly EMI Plan"}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    {application.status || "SUBMITTED"}
                  </p>

                  <div className="action-buttons">

                    <button
                      className="edit-btn"
                      onClick={() =>
                        handleEdit(application)
                      }
                    >
                      ✏️ Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDelete(application._id)
                      }
                    >
                      🗑 Delete
                    </button>

                  </div>

                </div>
              )
            )
          )}

        </div>
      )}

    </div>
  );
}

export default App;