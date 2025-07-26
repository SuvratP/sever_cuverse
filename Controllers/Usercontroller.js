// import UserModel from "../Models/userModel.js";
// import bcrypt from "bcrypt";
// import jwt from 'jsonwebtoken'
// // // get a User
// export const getUser = async (req, res) => {
//   const id = req.params.id;

//   try {
//     const user = await UserModel.findById(id);

//     if (user) 
//     {
//           const { password, ...otherDetails } = user._doc;
//       res.status(200).json(otherDetails);

//     } 
//     else 
//     {
//       res.status(404).json("No such user exists");
//     }
//   } catch (error) {
//     res.status(500).json(error);
//   }
// };

// // // update a user
// export const updateUser = async (req, res) => {
//   const id = req.params.id;
//   // console.log("Data Received", req.body)
//   const { _id, currentUserAdmin, password } = req.body;
  
//   if (id === _id) {
//     try {
//       // if we also have to update password then password will be bcrypted again
//       if (password) {
//         const salt = await bcrypt.genSalt(10);
//         req.body.password = await bcrypt.hash(password, salt);
//       }
//       // have to change this
//       const user = await UserModel.findByIdAndUpdate(id, req.body, {
//         new: true,
//       });
//       const token = jwt.sign(
//         { username: user.username, id: user._id },
//         process.env.JWTKEY,
//         { expiresIn: "1h" }
//       );
//       console.log({user, token})
//       res.status(200).json({user, token});
//     } catch (error) {
//       console.log("Error agya hy")
//       res.status(500).json(error);
//     }
//   } 
  
//   else {
//     res
//       .status(403)
//       .json("Access Denied! You can update only your own Account.");
//   }
// };

// // // Delete user
// export const deleteUser = async (req, res) => {
//   const id = req.params.id;

//   const { currentUserId, currentUserAdminStatus } = req.body;

//   if (currentUserId === id || currentUserAdminStatus) {
//     try {
//       await UserModel.findByIdAndDelete(id);
//       res.status(200).json("User deleted successfully");
//     } catch (error) {
//       res.status(500).json(error);
//     }
//   } else {
//     res.status(403).json("Access Denied! you can only delete your own profile");
//   }
// };

// // // Follow a User
// export const followUser = async (req, res) => {
//   const id = req.params.id;

//   const { currentUserId } = req.body;

//   if (currentUserId === id) {
//     res.status(403).json("Action forbidden");
//   } else {
//     try {
//       const followUser = await UserModel.findById(id);
//       const followingUser = await UserModel.findById(currentUserId);

//       if (!followUser.followers.includes(currentUserId)) {
//         await followUser.updateOne({ $push: { followers: currentUserId } });
//         await followingUser.updateOne({ $push: { following: id } });
//         res.status(200).json("User followed!");
//       } else {
//         res.status(403).json("User is Already followed by you");
//       }
//     } catch (error) {
//       res.status(500).json(error);
//     }
//   }
// };

// // // UnFollow a User
// export const UnFollowUser = async (req, res) => {
//   const id = req.params.id;

//   const { currentUserId } = req.body;

//   if (currentUserId === id) {
//     res.status(403).json("Action forbidden");
//   } else {
//     try {
//       const followUser = await UserModel.findById(id);
//       const followingUser = await UserModel.findById(currentUserId);

//       if (followUser.followers.includes(currentUserId)) {
//         await followUser.updateOne({ $pull: { followers: currentUserId } });
//         await followingUser.updateOne({ $pull: { following: id } });
//         res.status(200).json("User Unfollowed!");
//       } else {
//         res.status(403).json("User is not followed by you");
//       }
//     } catch (error) {
//       res.status(500).json(error);
//     }
//   }
// };

import UserModel from "../Models/userModel.js";
import bcrypt from 'bcryptjs';

import jwt from 'jsonwebtoken'


// Get all users
export const getAllUsers = async (req, res) => {

  try {
    let users = await UserModel.find();
    users = users.map((user)=>{
      const {password, ...otherDetails} = user._doc
      return otherDetails
    })
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
};

// get a User
export const getUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await UserModel.findById(id);

    if (user) {
      const { password, ...otherDetails } = user._doc;

      res.status(200).json(otherDetails);
    } else {
      res.status(404).json("No such user exists");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
// UPDATE USER
export const updateUser = async (req, res) => {
  const id = req.params.id;
  const { _id, password } = req.body;

  // ✅ Only allow self or admin to update
  if (id === _id) {
    try {
      if (password) {
        req.body.password = await bcrypt.hash(password, 10);
      }

      const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        req.body,
        { new: true } // ✅ Return the updated doc
      );

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Update failed:", error);
      res.status(500).json({ message: "Update failed", error });
    }
  } else {
    res.status(403).json({ message: "Access denied! You can update only your own profile" });
  }
};


// Delete user
export const deleteUser = async (req, res) => {
  const id = req.params.id;

  const { currentUserId, currentUserAdminStatus } = req.body;

  if (currentUserId === id || currentUserAdminStatus) {
    try {
      await UserModel.findByIdAndDelete(id);
      res.status(200).json("User deleted successfully");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("Access Denied! you can only delete your own profile");
  }
};

// Follow a User
export const followUser = async (req, res) => {
  const id = req.params.id;

  const { currentUserId } = req.body;

  if (currentUserId === id) {
    res.status(403).json("Action forbidden");
  } else {
    try {
      const followUser = await UserModel.findById(id);
      const followingUser = await UserModel.findById(currentUserId);

      if (!followUser.followers.includes(currentUserId)) {
        await followUser.updateOne({ $push: { followers: currentUserId } });
        await followingUser.updateOne({ $push: { following: id } });
        res.status(200).json("User followed!");
      } else {
        res.status(403).json("User is Already followed by you");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
};

// UnFollow a User
export const UnFollowUser = async (req, res) => {
  const id = req.params.id;

  const { currentUserId } = req.body;

  if (currentUserId === id) {
    res.status(403).json("Action forbidden");
  } else {
    try {
      const followUser = await UserModel.findById(id);
      const followingUser = await UserModel.findById(currentUserId);

      if (followUser.followers.includes(currentUserId)) {
        await followUser.updateOne({ $pull: { followers: currentUserId } });
        await followingUser.updateOne({ $pull: { following: id } });
        res.status(200).json("User Unfollowed!");
      } else {
        res.status(403).json("User is not followed by you");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
};

// new updatd