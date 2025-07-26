// //imports
// const express = require('express');
// const mongoose = require("mongoose");
// const product = require("./Models/Productmodel")
// const bike = require("./Models/bikemodel")
// const multer = require('multer');


// const app = express();
// const port = 3000;

// mongoose.set("strictQuery", false);


// app.use(express.json())


// // Define a storage engine for multer
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });


// app.get("/hello", (req, res) => {
//    res.json({ value: "HELLO SUBIN" })
// })




// //Post method
// app.post("/product", async (req, res) => {
//    try {
//       const newproduct = await product.create(req.body)
//       res.status(200).json(newproduct)
//    } catch (error) {
//       console.log(error.message),
//          res.status(500).json({ message: error.message })

//    }
// })


// //get specific data

// app.get("/product/:name", async (req, res) => {
//    try {
//       const {name}=req.params;
//       const newproduct = await product.find({name});
//       res.status(200).json(newproduct)
//    } catch (error) {
//       console.log(error.message),
//          res.status(500).json({ message: error.message })

//    }
// })

// //get method
// app.get("/product", async (req, res) => {
//    try {
//       const newproduct = await product.find({});
//       res.status(200).json(newproduct)
//       console.log(res.statusCode);
//    } catch (error) {
//       console.log(error.message),
//          res.status(500).json({ message: error.message })

//    }
// })

// //put
// app.put("/product/:name", async (req, res) => {
//    try {
//       const {name}=req.params;
//       const newproduct = await product.findandupdate(name, req.body);
//       res.status(200).json(newproduct)
//       console.log('callled');
//    } catch (error) {
//       console.log(error.message),
//          res.status(500).json({ message: error.message })

//    }
// })



//  app.post("/bike",upload.any(), async(req,res)=>{
//    try {
//       const bikes = await bike.create(req.body)
//       res.status(200).json(bikes)
//    } catch (error) {
//       console.log(error.message),
//       res.status(500).json({ message: error.message })
//    }
//  })
//  app.get("/bike", async (req, res) => {
//    try {
//       const newproduct = await product.find({});
//       res.status(200).json(newproduct)
//       console.log(res.statusCode);
//    } catch (error) {
//       console.log(error.message),
//          res.status(500).json({ message: error.message })

//    }
// })



// mongoose.connect("mongodb+srv://subinsubi_7012:mothalamma@cluster0.sul6tip.mongodb.net/noeds?retryWrites=true&w=majority")
//    .then(() => {
//       app.listen(port,() => {
//          console.log('connected at' + port)
//       })
//    })
//    .catch((error) => {
//       console.error("Failed to connect to MongoDB:", error);
//    });

/////////////commented top code for another apis its right now for chat app//////////////////

// Import dependencies
const express = require('express');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

// Initialize Express app
const app = express();
const port = 3000;

// Replace with your actual Agora App credentials
const AGORA_APP_ID = 'ebb96245b4d1498c9668fd48865f9024';
const AGORA_APP_CERTIFICATE = '18475b1178d447eaa54c0d63a2061116';

if (!AGORA_APP_ID || !AGORA_APP_CERTIFICATE) {
  console.error('❌ Missing Agora credentials. Check your AGORA_APP_ID and AGORA_APP_CERTIFICATE.');
  process.exit(1);
}

// Middleware
app.use(express.json());

// Test route
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello from Agora Token Server' });
});

// Token generator route
app.get('/rtc/:channel/:role/:uid', (req, res) => {
  const channelName = req.params.channel;
  const uidParam = req.params.uid;
  const roleParam = req.params.role;

  // ✅ Validate channel name
  if (!channelName || typeof channelName !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing channel name' });
  }

  // ✅ Validate UID
  const uid = parseInt(uidParam, 10);
  if (isNaN(uid)) {
    return res.status(400).json({ error: 'UID must be a number' });
  }

  // ✅ Validate role
  let role;
  if (roleParam === 'publisher') {
    role = RtcRole.PUBLISHER;
  } else if (roleParam === 'subscriber') {
    role = RtcRole.SUBSCRIBER;
  } else {
    return res.status(400).json({ error: 'Role must be "publisher" or "subscriber"' });
  }

  // ✅ Set expiration (1 hour)
  const expirationInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpireTs = currentTimestamp + expirationInSeconds;

  try {
    // 🔐 Generate token
    const token = RtcTokenBuilder.buildTokenWithUid(
      AGORA_APP_ID,
      AGORA_APP_CERTIFICATE,
      channelName,
      uid,
      role,
      privilegeExpireTs
    );

    // 🧾 Log for debugging
    console.log(`✅ Token generated:
    ├─ Channel: ${channelName}
    ├─ UID: ${uid}
    ├─ Role: ${roleParam}
    └─ Expires at: ${new Date(privilegeExpireTs * 1000).toLocaleTimeString()}
    `);

    res.json({ token });
  } catch (err) {
    console.error('💥 Error generating token:', err);
    res.status(500).json({ error: 'Internal server error while generating token' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Agora Token Server running at http://localhost:${port}`);
});
