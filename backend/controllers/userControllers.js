const asyncHandler = require('express-async-handler');
const USER = require('../models/user');
const POST = require('../models/post');
const cloudinary = require("cloudinary");
const { hashIt, isSame } = require('../config/hashIt');
const generateWebToken = require('../config/generateWebToken');

const loginController = asyncHandler(
    async (req,res) => {
        const { email, password } = req.body;
        if(!email || !password) {
            res.status(500).json({
                success:false,
                data:"null",
                message:"incomplete credentials",
            });
        } else {
            try { 
                const data = await USER.findOne({email});
                if(data) {
                    const areSame = await isSame(data.password, password);
                    if(areSame) {
                        const token = generateWebToken(data._id, email);
                        if(token) {
                            data.password = undefined;
                            res.status(200).json({
                            success:true,
                            message:"Logged in successfully",
                            data,
                            token,
                            })
                        } else {
                            res.status(500).json({
                            success:false,
                            message:"Can't generate token right now",
                            data : null,
                            })
                        }
                    } else {
                        res.status(500).json({
                            success:false,
                            message:"Invalid password",
                            data:null,
                        })
                    }
                } else {
                    res.status(500).json({
                        success:false,
                        message:"Please register yourself",
                        data:null,
                    })
                }
            } catch(error) {
                // Do something
                res.status(500).json({
                    success:false,
                    message:"Internal Error",
                    data:null,
                })
            }
        }
    }
)
const signupController = asyncHandler(
    async(req, res) => {
        let {name,email,userName,password} = req.body;
        // console.log(name,email,userName, password);
        if(!name || !email || !userName || !password) {
            res.status(500).json({
                success:false,
                data:null,
                message:"Full details are not provided",
            });
        } else {
            // Checking if user already exists-> 
            let user = await USER.findOne({email});
            if(user) {
                res.status(500).json({
                    success:false,
                    message:"User already exists",
                })
            } else {
                password = await hashIt(password);
                user = await USER.create({
                    name,
                    email,
                    userName,
                    password,
                })
                if(user) {
                    res.status(200).json({
                        success:true,
                        message:"Registered Successfully",
                        data:user,
                    });
                } else {
                    res.status(500).json({
                        success:false,
                        message:"Internal Server error",
                        data:null,
                    })
                }
            }
        }
    }
)
const showProfile = asyncHandler( async(req, res) => {
    try {
        const id = req.params.id;
        // console.log(id);
        if(!id) {
            res.status(500).send({
                sucess:false,
                data:null,
                message:'Id Not received',
            })
        } else {
            const user = await USER.findById({_id:id}).select("-password");
            const posts = await POST.find({postedBy:id});
            // console.log(posts);
            if(!user || !posts ) {
                res.status(500).send({
                    sucess:false,
                    data:null,
                    message:'Cannot find user',
                })
            } else {
                res.status(200).send({
                    sucess:true,
                    data:{user, posts},
                    message:'Here is your profile',
                })
            }
        }
    } catch(error) {
        res.status(500).send({
            sucess:false,
            data:null,
            message:error.message,
        })
    }
}) 

const fetchUserPosts = asyncHandler(
    async (req, res) => {
        // console.log(req)
        try {   
            const posts = await POST.find({postedBy: req.user._id}).populate('postedBy', '-password -followers -following').populate('comments.postedBy', '-password -userName -email -_id -followers -following -__v');
            // posts.postedBy.password = undefined;
            
            if(posts) {
                    // console.log(posts);
                    res.status(200).json({
                    success:true,
                    message:"Posts fetched successfully",
                    data:posts,
                })
            } else {
                    res.status(500).json({
                    success:false,
                    message:"No posts available",
                    data:null,
                })
            }
        } catch(error) {
                res.status(500).json({
                success:false,
                message:"error -> " + error.message,
                data:null,
            })
        }
    }
);

const saveUserPic = asyncHandler(async (req, res) => {
    // console.log(req.files.file);
    const file = req.files.file;
    // console.log(file);
    if (!file) {
      res.status(500).json({
        success: false,
        message: `Can't fetch data right now`,
        data: null,
      });
    //   process.exit(1);
    } else {
      if (
        file.name.split(".")[1] !== "png" &&
        file.name.split(".")[1] !== "jpeg" &&
        file.name.split(".")[1] !== "jpg"
      ) {
        res.status(500).json({
          success: false,
          message: "Other file",
          data: null,
        });
        process.exit(1);
      }
      const path =
        __dirname +
        "\\userPics\\" +
        Date.now() +
        "." +
        file.name.split(".")[1];
      file.mv(path, (error) => {
        if (error) {
          res.status(500).json({
            success: false,
            message: `Can't fetch data right now`,
            data: null,
          });
        }
      });
      const output = await cloudinary.v2.uploader.upload(path, {
        folder: "userProfile",
      });
      if (output) {
        const updated = await USER.findByIdAndUpdate({_id: req.user._id}, {
            Photo: output.secure_url,
        });
        if(updated) {
            res.status(200).json({
            url: output.secure_url,
            success: true,
            message: "Image stored Successfully",
            });
        } else {
                res.status(500).send({
                success: false,
                message: "some error occured",
                });
        }
      } else {
        res.status(500).json({
          success: false,
          data: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
          message: "Cant store Image",
        });
      }
    }
});

const followUser = asyncHandler(async (req, res) => {
    // console.log(req.body);
    const { _id } = req.body;
    try {
        const result = await USER.findByIdAndUpdate({_id}, {
            $push: {
                followers: _id,
            },
        }, {
            new:true,
        });
        const followings = await USER.findByIdAndUpdate({_id:req.user._id}, {
            $push: {
                following: _id,
            },
        }, 
        {
            new:true,
        });
        if(result) {
            res.status(200).send({
                success: true,
                result,
            });
        } else  {
            res.status(500).send({
                success:false,
                result,
            })
        }
    } catch(error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});

const unfollowUser = asyncHandler(async (req, res) => {
    // console.log(req.body);
    const { _id } = req.body;
    try {
        const result = await USER.findByIdAndUpdate({_id}, {
            $pull: {
                followers: _id,
            },
        }, {
            new:true,
        });
        const followings = await USER.findByIdAndUpdate({_id:req.user._id}, {
            $pull: {
                following: _id,
            },
        }, 
        {
            new:true,
        });
        if(result) {
            res.status(200).send({
                success: true,
                result,
            });
        } else  {
            res.status(500).send({
                success:false,
                result,
            })
        }
    } catch(error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});
module.exports = { loginController, signupController, showProfile, fetchUserPosts, saveUserPic, followUser, unfollowUser };