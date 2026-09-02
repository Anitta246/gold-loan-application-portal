const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

/* =====================================================
   SCHEMA
===================================================== */

const loanApplicationSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true
    },

    mobileNumber: {
      type: String,
      required: true
    },

    grossWeightGrams: {
      type: Number,
      required: true
    },

    netWeightGrams: {
      type: Number,
      required: true
    },

    purityKarat: {
      type: Number,
      required: true
    },

    selectedPlanId: {
      type: String,
      required: true
    },

    pureGoldWeight: {
      type: Number,
      required: true
    },

    totalGoldValue: {
      type: Number,
      required: true
    },

    maximumLoanAmount: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      default: "SUBMITTED"
    }
  },
  {
    timestamps: true
  }
);

/* =====================================================
   MODEL
===================================================== */

const LoanApplication = mongoose.model(
  "LoanApplication",
  loanApplicationSchema
);

/* =====================================================
   LOAN SCHEMES
===================================================== */

app.get("/api/v1/loan-schemes", (req, res) => {
  res.status(200).json([
    {
      id: "PLAN_BULLET_01",
      name: "Bullet Repayment Plan",
      interestRate: 12,
      maxLTV: 75
    },
    {
      id: "PLAN_EMI_01",
      name: "Monthly EMI Plan",
      interestRate: 14,
      maxLTV: 75
    }
  ]);
});

/* =====================================================
   SUBMIT APPLICATION
===================================================== */

app.post("/api/v1/leads/submit", async (req, res) => {
  try {
    console.log("Received Data:", req.body);

    const {
      customerName,
      mobileNumber,
      grossWeightGrams,
      netWeightGrams,
      purityKarat,
      selectedPlanId
    } = req.body;

    /* ---------- REQUIRED FIELD VALIDATION ---------- */

    if (
      !customerName ||
      !mobileNumber ||
      grossWeightGrams === undefined ||
      netWeightGrams === undefined ||
      !purityKarat ||
      !selectedPlanId
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    /* ---------- MOBILE VALIDATION ---------- */

    const mobileRegex = /^[0-9]{10}$/;

    if (!mobileRegex.test(String(mobileNumber))) {
      return res.status(400).json({
        message: "Mobile number must contain exactly 10 digits"
      });
    }

    /* ---------- NUMBER CONVERSION ---------- */

    const grossWeight = Number(grossWeightGrams);
    const netWeight = Number(netWeightGrams);
    const karat = Number(purityKarat);

    if (
      Number.isNaN(grossWeight) ||
      Number.isNaN(netWeight) ||
      Number.isNaN(karat)
    ) {
      return res.status(400).json({
        message: "Weight and purity must be valid numbers"
      });
    }

    /* ---------- WEIGHT VALIDATION ---------- */

    if (grossWeight <= 0 || netWeight <= 0) {
      return res.status(400).json({
        message: "Weights must be greater than 0"
      });
    }

    if (netWeight > grossWeight) {
      return res.status(400).json({
        message: "Net weight cannot be greater than gross weight"
      });
    }

    /* ---------- PURITY VALIDATION ---------- */

    if (![18, 22, 24].includes(karat)) {
      return res.status(400).json({
        message: "Purity must be 18K, 22K or 24K"
      });
    }

    /* ---------- PLAN VALIDATION ---------- */

    if (
      selectedPlanId !== "PLAN_BULLET_01" &&
      selectedPlanId !== "PLAN_EMI_01"
    ) {
      return res.status(400).json({
        message: "Invalid loan plan"
      });
    }

    /* ---------- DUPLICATE CHECK: 7 DAYS ---------- */

    const sevenDaysAgo = new Date();

    sevenDaysAgo.setDate(
      sevenDaysAgo.getDate() - 7
    );

    const existingApplication =
      await LoanApplication.findOne({
        mobileNumber: String(mobileNumber),
        createdAt: {
          $gte: sevenDaysAgo
        }
      });

    if (existingApplication) {
      return res.status(409).json({
        message:
          "An application with this mobile number already exists within the last 7 days"
      });
    }

    /* ---------- GOLD CALCULATION ---------- */

    const pureGoldWeight =
      netWeight * (karat / 24);

    const goldPricePerGram = 7000;

    const totalGoldValue =
      pureGoldWeight * goldPricePerGram;

    /* ---------- 75% LTV ---------- */

    const maximumLoanAmount =
      totalGoldValue * 0.75;

    /* ---------- CREATE APPLICATION ---------- */

    const newApplication =
      new LoanApplication({
        customerName: String(customerName).trim(),
        mobileNumber: String(mobileNumber),
        grossWeightGrams: grossWeight,
        netWeightGrams: netWeight,
        purityKarat: karat,
        selectedPlanId,
        pureGoldWeight,
        totalGoldValue,
        maximumLoanAmount,
        status: "SUBMITTED"
      });

    /* ---------- SAVE ---------- */

    const savedApplication =
      await newApplication.save();

    console.log(
      "Application Saved Successfully:",
      savedApplication._id
    );

    /* ---------- SUCCESS RESPONSE ---------- */

    return res.status(201).json({
      message: "Application Submitted Successfully!",
      applicationId: savedApplication._id,
      maximumLoanAmount:
        savedApplication.maximumLoanAmount,
      status: savedApplication.status
    });

  } catch (error) {
    console.error(
      "ERROR WHILE SAVING APPLICATION:"
    );
    console.error(error);

    return res.status(500).json({
      message:
        error.message || "Error saving application"
    });
  }
});

/* =====================================================
   GET ALL APPLICATIONS
===================================================== */

app.get("/api/v1/leads", async (req, res) => {
  try {
    const applications =
      await LoanApplication.find().sort({
        createdAt: -1
      });

    return res.status(200).json(applications);

  } catch (error) {
    console.error(
      "ERROR WHILE FETCHING APPLICATIONS:"
    );
    console.error(error);

    return res.status(500).json({
      message:
        error.message || "Error fetching applications"
    });
  }
});

/* =====================================================
   UPDATE APPLICATION
===================================================== */

app.put("/api/v1/leads/:id", async (req, res) => {
  try {
    const {
      customerName,
      mobileNumber,
      grossWeightGrams,
      netWeightGrams,
      purityKarat,
      selectedPlanId
    } = req.body;

    /* ---------- REQUIRED FIELD VALIDATION ---------- */

    if (
      !customerName ||
      !mobileNumber ||
      grossWeightGrams === undefined ||
      netWeightGrams === undefined ||
      !purityKarat ||
      !selectedPlanId
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    /* ---------- MOBILE VALIDATION ---------- */

    const mobileRegex = /^[0-9]{10}$/;

    if (!mobileRegex.test(String(mobileNumber))) {
      return res.status(400).json({
        message: "Mobile number must contain exactly 10 digits"
      });
    }

    const grossWeight = Number(grossWeightGrams);
    const netWeight = Number(netWeightGrams);
    const karat = Number(purityKarat);

    /* ---------- NUMBER VALIDATION ---------- */

    if (
      Number.isNaN(grossWeight) ||
      Number.isNaN(netWeight) ||
      Number.isNaN(karat)
    ) {
      return res.status(400).json({
        message: "Weight and purity must be valid numbers"
      });
    }

    /* ---------- WEIGHT VALIDATION ---------- */

    if (grossWeight <= 0 || netWeight <= 0) {
      return res.status(400).json({
        message: "Weights must be greater than 0"
      });
    }

    if (netWeight > grossWeight) {
      return res.status(400).json({
        message: "Net weight cannot be greater than gross weight"
      });
    }

    /* ---------- PURITY VALIDATION ---------- */

    if (![18, 22, 24].includes(karat)) {
      return res.status(400).json({
        message: "Purity must be 18K, 22K or 24K"
      });
    }

    /* ---------- PLAN VALIDATION ---------- */

    if (
      selectedPlanId !== "PLAN_BULLET_01" &&
      selectedPlanId !== "PLAN_EMI_01"
    ) {
      return res.status(400).json({
        message: "Invalid loan plan"
      });
    }

    /* ---------- RECALCULATE ---------- */

    const pureGoldWeight =
      netWeight * (karat / 24);

    const goldPricePerGram = 7000;

    const totalGoldValue =
      pureGoldWeight * goldPricePerGram;

    const maximumLoanAmount =
      totalGoldValue * 0.75;

    /* ---------- UPDATE ---------- */

    const updatedApplication =
      await LoanApplication.findByIdAndUpdate(
        req.params.id,
        {
          customerName: String(customerName).trim(),
          mobileNumber: String(mobileNumber),
          grossWeightGrams: grossWeight,
          netWeightGrams: netWeight,
          purityKarat: karat,
          selectedPlanId,
          pureGoldWeight,
          totalGoldValue,
          maximumLoanAmount
        },
        {
          new: true,
          runValidators: true
        }
      );

    if (!updatedApplication) {
      return res.status(404).json({
        message: "Application not found"
      });
    }

    return res.status(200).json({
      message: "Application updated successfully!",
      application: updatedApplication
    });

  } catch (error) {
    console.error(
      "ERROR WHILE UPDATING APPLICATION:"
    );
    console.error(error);

    return res.status(500).json({
      message:
        error.message || "Error updating application"
    });
  }
});

/* =====================================================
   DELETE APPLICATION
===================================================== */

app.delete("/api/v1/leads/:id", async (req, res) => {
  try {
    const deletedApplication =
      await LoanApplication.findByIdAndDelete(
        req.params.id
      );

    if (!deletedApplication) {
      return res.status(404).json({
        message: "Application not found"
      });
    }

    return res.status(200).json({
      message: "Application deleted successfully!"
    });

  } catch (error) {
    console.error(
      "ERROR WHILE DELETING APPLICATION:"
    );
    console.error(error);

    return res.status(500).json({
      message:
        error.message || "Error deleting application"
    });
  }
});

/* =====================================================
   START SERVER ONLY AFTER MONGODB CONNECTS
===================================================== */

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is missing in .env file"
      );
    }

    await mongoose.connect(
      process.env.MONGO_URI,
      {
        serverSelectionTimeoutMS: 10000
      }
    );

    console.log(
      "MongoDB Connected Successfully!"
    );

    app.listen(PORT, () => {
      console.log(
        `Server is running on port ${PORT}`
      );
    });

  } catch (error) {
    console.error(
      "MongoDB Connection Failed!"
    );
    console.error(
      "Name:",
      error.name
    );
    console.error(
      "Message:",
      error.message
    );

    process.exit(1);
  }
}

startServer();