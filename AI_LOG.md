# AI_LOG.md

# AI Usage Log – Gold Loan Application Portal

## 1. AI Tools Used

The following AI tools were used during the development of this project:

- ChatGPT
- GitHub Copilot

AI assistance was used for generating code ideas, form state management, backend API structure, validation logic, UI styling, debugging, and documentation.

## 2. Exact Prompts Used

### Prompt 1 – Form State Management

"Create a React form state management code for a Gold Loan Application Portal with customer name, mobile number, gross weight, net weight, purity, and loan plan selection."

### Prompt 2 – Backend Validation

"Create Node.js and Express backend validation for a gold loan application. Validate required fields, ensure mobile number is exactly 10 digits, ensure net weight is less than or equal to gross weight, and calculate the maximum loan amount using a 75% LTV limit."

## 3. Example of AI-Generated Flawed Code

During development, an AI-generated version did not initially include strict validation for all required fields and did not include the 7-day duplicate mobile number check.

This could have allowed invalid or duplicate applications to be submitted.

## 4. Manual Audit and Fix

The generated code was manually reviewed and tested.

The following improvements were added:

- Required field validation
- 10-digit mobile number validation
- Net weight cannot exceed gross weight
- Purity validation for 18K, 22K, and 24K
- Loan plan validation
- 75% LTV calculation
- Duplicate mobile number check within the last 7 days
- HTTP 400 Bad Request for invalid input
- HTTP 409 Conflict for duplicate applications
- Application status set to SUBMITTED

The API responses and calculations were manually tested using the frontend and MongoDB.

## 5. AI Output Verification

AI-generated code was not used without verification. The business logic, validation rules, database operations, and loan calculations were manually checked against the assignment requirements.

## 6. Conclusion

AI tools helped speed up development, but the generated code was manually reviewed, tested, and corrected before being used in the final project.