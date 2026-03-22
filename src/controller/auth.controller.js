const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendEmail = require("../services/mail.service");
const SessionModel = require("../models/session.model");

async function UserRegister(req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "USERNAME , EMAIL ,PASSWORD IS REQUIRED FOR REGISTER !!",
    });
  }

  const isUserExits = await UserModel.findOne({
    $or: [{ email: email }, { username: username }],
  });

  if (isUserExits) {
    return res.status(401).json({
      message: "User Already Exits",
    });
  }
  const hashPassword = await bcrypt.hash(password, 10);

  const User = await UserModel.create({
    username,
    email,
    password: hashPassword,
  });



  await sendEmail(
    email,
    "Welcome To Our App",
    `Hello ${username},\n\nThank you for registering with our app! We're excited to have you on board.\n\nBest regards,\nThe Team`,
    `<p>Hello <strong>${username}</strong>,</p><p>Thank you for registering with our app! We're excited to have you on board.</p><p>Best regards,<br>The Team</p>`,
  );
 

  return res.status(201).json({
    message: "User Registered Successfully",
    User:{
        username : User.username,
        email : User.email,
        password : User.password,
        verified : User.verified
    }
    
  });
}

async function UserLogin(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "EMAIL OR PASSWORD IS REQUIRED FOR LOGIN !!",
    });
  }

  const isUserExits = await UserModel.findOne({
    email,
  });

  if (!isUserExits) {
    return res.status(404).json({
      message: "User Not Found Please Login first",
    });
  }
  const isPasswordRight = await bcrypt.compare(password, isUserExits.password);

  if (!isPasswordRight) {
    return res.status(401).json({
      message: "Invalid Password",
    });
  }

  const ReFreshToken = jwt.sign(
    { id: isUserExits._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
  

  const hashRefreshToken = await bcrypt.hash(ReFreshToken, 10);

  const session = await SessionModel.create({
    user: isUserExits._id,
    hashRefreshToken: hashRefreshToken,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });


  const Accesstoken = jwt.sign(
    { id: isUserExits._id , sessionId : session._id},
    process.env.JWT_SECRET,
    { expiresIn: "15m" },
  );

  

  res.cookie("token", ReFreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    message: "User Login Successfully",
    Accesstoken,
  });
}

async function GetInfo(req, res) {
  const token = req.cookies.token;
  console.log(token);

  if (!token) {
    return res.status(401).json({
      message: "Token Not Found",
    });
  }

  try {
    let decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user = await UserModel.findById(decoded.id);

    res.status(200).json({
      message: "Data Fetched Successfully",
      user,
    });
  } catch (err) {
    return res.status(401).json({
      message: "Invalid Token",
    });
  }
}

async function GetRefreshToken(req, res) {
  const RefreshToken = req.cookies.token;

  if (!RefreshToken) {
    return res.status(401).json({
      message: "Access Token Not Found ",
    });
  }

  try {
    const decoded = jwt.verify(RefreshToken, process.env.JWT_SECRET);

    const session = await SessionModel.findOne({
      user: decoded.id,
      revoke: false,
    });

    if (session) {
      const isValidToken = await bcrypt.compare(
        RefreshToken,
        session.hashRefreshToken,
      );
      if (!isValidToken) {
        return res.status(401).json({
          message: "Token Expired Please Login Again",
        });
      }
    }

    const Accesstoken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET);

    const newRefreshToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7D",
      },
    );

    const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 10);
    session.hashRefreshToken = newRefreshTokenHash;
    await session.save();

    res.cookie("token", newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Access Token Generated Successfully",
      Accesstoken,
    });
  } catch (err) {
    return res.status(401).json({
      message: "Invalid Token",
    });
  }
}

async function Logout(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Token Not Found",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const IsTokenExits = await SessionModel.findOne({
      user: decoded.id,
      revoke: false,
    });

    if (!IsTokenExits) {
      return res.status(401).json({
        message: "Invalid Token",
      });
    }

    const isValidToken = await bcrypt.compare(
      token,
      IsTokenExits.hashRefreshToken,
    );

    if (!isValidToken) {
      return res.status(401).json({
        message: "Invalid Token",
      });
    }

    IsTokenExits.revoke = true;
    await IsTokenExits.save();

    res.clearCookie("token");

    res.status(200).json({
      message: "Logout Successfully",
    });
  } catch (err) {
    return res.status(401).json({
      message: "Invalid Token",
    });
  }
}


async function LogoutAll(req, res) {
  const token = req.cookies.token;


  if(!token){    
    return res.status(401).json({
        message : "Token Not Found"
    })
  } 

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  await SessionModel.updateMany({user : decoded.id} , {revoke : true})


  res.status(200).json({
    message: "Logout Successfully",
  });

}

module.exports = {
  UserRegister,
  UserLogin,
  GetInfo,
  GetRefreshToken,
  Logout,
 LogoutAll,
};
