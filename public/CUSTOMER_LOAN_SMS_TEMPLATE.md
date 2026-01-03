# Customer Loan Car SMS Templates

## 📱 How to Access Customer Hub

### **Option 1: Direct URL**
Share this link with customers via SMS:

```
https://[YOUR-DOMAIN]/customer-hub?loan=[LOAN_ID]
```

Replace `[YOUR-DOMAIN]` with your actual deployment URL (e.g., `fleetcommand.app`, `myworkshop.com.au`, etc.)

Replace `[LOAN_ID]` with the unique loan ID (e.g., `LOAN-1704326400000`)

---

## 📋 SMS Templates

### **Template 1: Professional**

```
Hi [CUSTOMER_NAME],

Your loan vehicle is ready! 

Vehicle: [MAKE] [MODEL]
Rego: [REGO]
Due back: [DATE] at [TIME]

Complete your loan agreement here:
[CUSTOMER_HUB_LINK]

Upload your licence & start GPS tracking.

Questions? Call us: [WORKSHOP_PHONE]

- [WORKSHOP_NAME]
```

**Example:**
```
Hi Sarah,

Your loan vehicle is ready! 

Vehicle: VW Passat
Rego: YOT95K
Due back: Mon 6 Jan at 2:00 PM

Complete your loan agreement here:
https://fleetcommand.app/customer-hub?loan=LOAN-1704326400000

Upload your licence & start GPS tracking.

Questions? Call us: (02) 9555 1234

- Premium Auto Service
```

---

### **Template 2: Concise**

```
[CUSTOMER_NAME], your loan car is ready!

[MAKE] [MODEL] ([REGO])
Due: [DATE] [TIME]

Accept & start GPS:
[CUSTOMER_HUB_LINK]

[WORKSHOP_NAME]
[PHONE]
```

**Example:**
```
Sarah, your loan car is ready!

VW Passat (YOT95K)
Due: Mon 6 Jan 2:00 PM

Accept & start GPS:
https://fleetcommand.app/hub?loan=L1704326400000

Premium Auto Service
(02) 9555 1234
```

---

### **Template 3: Friendly**

```
Hey [CUSTOMER_NAME]! 👋

Great news - your loan car is all set!

🚗 [MAKE] [MODEL]
🔢 Rego: [REGO]
⏰ Return by: [DATE] at [TIME]

Tap to accept & activate GPS tracking:
[CUSTOMER_HUB_LINK]

You'll need to upload:
✓ Driver's licence (front & back)
✓ Verification photo

Need help? We're here: [PHONE]

[WORKSHOP_NAME]
```

**Example:**
```
Hey Sarah! 👋

Great news - your loan car is all set!

🚗 VW Passat
🔢 Rego: YOT95K
⏰ Return by: Mon 6 Jan at 2:00 PM

Tap to accept & activate GPS tracking:
https://fleetcommand.app/customer-hub?loan=LOAN-1704326400000

You'll need to upload:
✓ Driver's licence (front & back)
✓ Verification photo

Need help? We're here: (02) 9555 1234

Premium Auto Service
```

---

## 🔐 What Customers Will Do

When customers click the link, they will:

### **Step 1: Landing Page**
- See loan vehicle details
- View workshop contact information
- Click "View Loan Details"

### **Step 2: Document Upload**
- Upload driver's licence (front)
- Upload driver's licence (back)
- Take verification selfie with licence
- Review terms & conditions

### **Step 3: Accept & Track**
- Accept loan agreement
- Grant location permissions
- GPS tracking starts automatically
- See real-time tracking status

### **Step 4: During Loan**
- View vehicle details
- See GPS tracking status
- Contact workshop if needed
- Pause/resume tracking
- Return vehicle when done

---

## 📊 What Fleet Managers See

While the customer has the vehicle:

1. **Live Tracking Dashboard** shows:
   - Current GPS coordinates
   - Journey duration
   - Distance traveled
   - Location accuracy
   - Last update time

2. **Journey History** includes:
   - Full timeline of GPS points
   - Each location timestamp
   - Links to Google Maps

3. **Customer Information**:
   - Uploaded licence photos
   - Verification selfie
   - Acceptance timestamp
   - Contact details

---

## 🎯 Benefits

### **For Customers:**
✅ Clear loan terms upfront
✅ Easy document upload via phone camera
✅ See tracking status at all times
✅ Direct workshop contact access
✅ Professional, trustworthy experience

### **For Workshop:**
✅ Digital licence verification
✅ Real-time vehicle tracking
✅ Automated loan acceptance
✅ Reduced paperwork
✅ Improved customer service
✅ Asset protection

---

## 🔗 URL Structure Options

### **With Loan ID Parameter:**
```
/customer-hub?loan=LOAN-1704326400000
```
- Pre-loads specific loan details
- Recommended for SMS links

### **Without Parameter:**
```
/customer-hub
```
- Generic landing page
- Customer can enter loan ID manually

### **Short URL (Alternative):**
```
/hub?loan=L1704326400000
```
- Shorter for SMS character limits
- Same functionality

---

## 📱 Testing the Link

### **On Your Phone Right Now:**

1. Get your current deployment URL (e.g., `localhost:5173` for dev)
2. Open: `http://localhost:5173/customer-hub?loan=DEMO-123`
3. Test the full flow:
   - Accept loan terms
   - Upload sample photos
   - Enable GPS tracking
   - View tracking screen

### **Production URL Examples:**

```
https://fleetcommand.yourworkshop.com.au/customer-hub?loan=LOAN-ABC123

https://loans.premiumauto.com.au/hub?loan=L-20260103-001

https://yourapp.vercel.app/customer-hub?loan=LOAN-1704326400000
```

---

## 🎨 QR Code Option

For in-person handovers, generate a QR code for:

```
https://[YOUR-DOMAIN]/customer-hub?loan=[LOAN_ID]
```

Customers can scan with their phone camera to open the link instantly.

**Free QR Code Generators:**
- https://www.qr-code-generator.com/
- https://www.qrcode-monkey.com/
- https://goqr.me/

---

## 🔧 Integration with Check-Out Flow

When creating a loan in Fleet Command:

1. Generate unique loan ID
2. Create SMS with customer details
3. Send via your SMS provider:
   - Twilio
   - MessageMedia
   - Telstra SMS API
   - AWS SNS

**Example Integration:**
```javascript
const loanId = `LOAN-${Date.now()}`;
const customerHubUrl = `https://fleetcommand.app/customer-hub?loan=${loanId}`;

const smsMessage = `
Hi ${customerName},

Your loan vehicle is ready!

Vehicle: ${make} ${model}
Rego: ${rego}
Due back: ${dueDate} at ${dueTime}

Accept & activate GPS:
${customerHubUrl}

${workshopName}
${workshopPhone}
`.trim();

// Send SMS via your provider
await sendSMS(customerPhone, smsMessage);
```

---

## 📞 Customer Support Tips

**If customer can't access the link:**
- Check they have internet/data connection
- Try copying link into browser directly
- Send link again via email as backup
- Use QR code for in-person handover

**If GPS isn't working:**
- Customer needs to grant location permissions
- Must keep page open in browser
- Works best in Chrome/Safari
- May need to move outdoors for signal

**If photos won't upload:**
- Check browser permissions for camera
- Try different browser
- Can upload from photo gallery
- File size should be under 10MB

---

## 🎊 Ready to Use!

Your Customer Hub is now live and ready to accept loan agreements with GPS tracking!

**Next Steps:**
1. Deploy your app to get production URL
2. Customize SMS templates with your branding
3. Test with a demo loan
4. Send to first customer! 🚗📍

---

**System Status**: ✅ Fully Operational  
**Last Updated**: January 3, 2026  
**Version**: 1.0
