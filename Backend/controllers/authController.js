export const registerUser = async (req, res) => {

  try {

    const {
      fullName,
      collegeEmail,
      rollNumber,
      phone,
      semester,
      department,
      address,
      fatherName,
      motherName,
      mentorName,
      dob,
      gender,
      password,
      role
    } = req.body;

    // check existing user

    const existingUser = await User.findOne({
      $or: [
        { collegeEmail },
        { rollNumber }
      ]
    });

    if (existingUser) {

      return res.status(400).json({
        message: "User already exists"
      });

    }

    // hash password

    const hashedPassword = await bcrypt.hash(password, 10);

    // create user

    const user = await User.create({

      fullName,
      collegeEmail,
      rollNumber,
      phone,
      semester,
      department,
      address,
      fatherName,
      motherName,
      mentorName,
      dob,
      gender,

      password: hashedPassword,

      role: role || "user"

    });

    res.status(201).json({
      message: "Registration successful",
      user
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Registration failed"
    });

  }
};