# Dummy Data for MongoDB Compass

This folder contains sample data for populating the doctor-appointments database.

## Files

1. **users.json** - Sample User documents (with role DOCTOR)
2. **doctors.json** - Sample Doctor documents

## How to Import into MongoDB Compass

### Step 1: Import Users

1. Open MongoDB Compass
2. Connect to your database: `mongodb://localhost:27017`
3. Select your database (e.g., `doctor-appointments-local`)
4. Click on the `users` collection
5. Click "Add Data" → "Import File"
6. Select `users.json`
7. Choose "JSON" format
8. Click "Import"

**Note:** After importing, copy the `_id` values of the imported users. You'll need them for the next step.

### Step 2: Update Doctor Documents with User IDs

1. Open `doctors.json` in a text editor
2. Replace `REPLACE_WITH_USER_ID_1` with the actual `_id` from the first user
3. Replace `REPLACE_WITH_USER_ID_2` with the actual `_id` from the second user
4. Continue for all 6 users

**Example:**
```json
{
  "user": "507f1f77bcf86cd799439011",  // Replace with actual ObjectId
  "specialization": "Cardiologist",
  ...
}
```

### Step 3: Import Doctors

1. In MongoDB Compass, select the `doctors` collection
2. Click "Add Data" → "Import File"
3. Select the updated `doctors.json`
4. Choose "JSON" format
5. Click "Import"

## Alternative: Manual Insertion

You can also copy-paste individual documents directly into MongoDB Compass:

1. Open the collection
2. Click "Insert Document"
3. Paste the JSON document
4. Click "Insert"

## Sample Data Overview

### Users (6 doctors)
- Dr. Rajesh Kumar - Cardiologist
- Dr. Priya Sharma - Dermatologist
- Dr. Amit Patel - Orthopedic Surgeon
- Dr. Sneha Reddy - Pediatrician
- Dr. Vikram Singh - General Physician
- Dr. Anjali Mehta - Gynecologist

### Doctors (6 profiles)
All doctors have:
- Different specializations
- Various experience levels (8-20 years)
- Consultation fees ranging from ₹800 to ₹2000
- Weekly schedules with multiple days
- Different cities (Noida, New Delhi, Mumbai, Bangalore, Kolkata, Hyderabad)
- All approved (`isApproved: true`)

## Important Notes

1. **Password Hash**: The password hashes in `users.json` are dummy values. In production, use proper bcrypt hashes. For testing, you may want to create users through the registration API instead.

2. **User IDs**: Make sure the `user` field in doctor documents references valid user `_id` values from the users collection.

3. **ObjectId Format**: MongoDB ObjectIds are 24-character hexadecimal strings. Example: `507f1f77bcf86cd799439011`

4. **Timestamps**: MongoDB will automatically add `createdAt` and `updatedAt` fields if your schema has `timestamps: true`.

## Quick Script Alternative

If you prefer, you can also use MongoDB shell or a script to insert this data programmatically after creating users through your application.

