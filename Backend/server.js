const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const path = require('path');

const bcrypt = require('bcryptjs');

const User = require('./models/User');

const app = express();

const complaintRoutes = require('./routes/complaints');


// ================= MIDDLEWARE =================

app.use(cors());

app.use(express.json());

app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'))
);


// ================= ROUTES =================

app.use('/api/auth', require('./routes/auth'));

app.use('/api/complaints', complaintRoutes);

app.use('/api/admin', require('./routes/admin'));


// ================= SUPER ADMIN CREATOR =================

const createSuperAdmin = async () => {

  try {

    const existingAdmin = await User.findOne({
      role: 'superadmin'
    });

    if (!existingAdmin) {

      const hashedPassword = await bcrypt.hash(
        'admin123',
        10
      );

      await User.create({

        adminName: 'Super Admin',

        adminEmail: 'superadmin@resolvio.com',

        adminId: 'SUPER001',

        password: hashedPassword,

        role: 'superadmin'

      });

      console.log('✅ Super Admin Created');
    }

  } catch (error) {

    console.log(error);

  }
};


// ================= DATABASE =================

console.log("Attempting to connect to MongoDB...");

console.log(
  "URI being used:",
  process.env.MONGO_URI
);

mongoose.connect(process.env.MONGO_URI)

.then(async () => {

  console.log(
    'MongoDB Connected Successfully'
  );

  // IMPORTANT
  await createSuperAdmin();

})

.catch(err =>
  console.error(
    'MongoDB Connection Error:',
    err.message
  )
);


// ================= SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);