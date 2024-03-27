const POST = require('../models/post');
const asyncHandler = require('express-async-handler');
const cloudinary = require("cloudinary");
const fetchAllPosts = asyncHandler(
    async (req, res) => {
        try {
            const posts = await POST.find().sort({createdAt:-1}).populate("postedBy", "-password -followers -following -userName -email");
            if(posts) {
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

const savePic = asyncHandler(async (req, res) => {
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
        "\\postPics\\" +
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
        folder: "posts",
      });
      if (output) {
        res.status(200).json({
          success: true,
          data: output.secure_url,
  
          message: "Image stored Successfully",
        });
      } else {
        res.status(500).json({
          success: false,
          data: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
          message: "Cant store Image",
        });
      }
    }
});
const createPost = asyncHandler(
    async (req, res) => {
        const { body, pic } = req.body;
        if(!body) {
            res.status(500).json({
                success:false,
                message:"Incomplete data",
                data:null,
            })
        } else {
            const { _id } = req.user._id;
            try {
                const post = await POST.create({
                    body,
                    photo:pic,
                    postedBy:_id,
                })
                const post_populated = await POST.findOne({_id:post._id}).populate("postedBy", "-password -followers -following");
                if(post) {
                    res.status(200).json({
                        success:true,
                        message:"Post Created Successfully",
                        data : post_populated,
                    })
                } 
                else {
                    res.status(500).json({
                        success:false,
                        message:"Please try after some time",
                        data : null,
                    })
                }
            } catch(error) {
                res.status(500).json({
                    success:false,
                    message:"Server error -> " + error.message,
                    data : null,
                })
            }
        }
    }
);

const likePost = asyncHandler(async (req,res) => {
    const { _id } = req.body;
    if(!_id) {
        res.status(500).json({
            success: false,
            message: "Post id not provided",
            data: null,
        });
    } else {
        try {
            const updatedPost = await POST.findByIdAndUpdate({_id}, {
                $push: {
                    likes: req.user._id,
                }
            },
            {
                new: true,
            }).populate("likes", "-password -followers -following ");
            if(!updatedPost) {
                res.status(500).json({
                    success: false,
                    message: "Cant fetch your post",
                    data:null,
                })
            } else {
                res.status(200).json({
                    success: true,
                    message: "Liked",
                    data:updatedPost,
                });
            } 
        } catch(error) {
            res.status(500).json({
                success: false,
                message:`Error -> ${error.message}`,
                data:null,
            })
        }
    }
    
});

const unLikePost = asyncHandler(async (req,res) => {
    const { _id } = req.body;
    if(!_id) {
        res.status(500).json({
            success: false,
            message: "Post id not provided",
            data: null,
        });
    } else {
        try {
            const updatedPost = await POST.findByIdAndUpdate({_id}, {
                $pull: {
                    likes: req.user._id,
                }
            },
            {
                new: true,
            }).populate("likes", "-password -followers -following ");
            if(!updatedPost) {
                res.status(500).json({
                    success: false,
                    message: "Cant fetch your post",
                    data:null,
                })
            } else {
                res.status(200).json({
                    success: true,
                    message: "Liked",
                    data:updatedPost,
                });
            } 
        } catch(error) {
            res.status(500).json({
                success: false,
                message:`Error -> ${error.message}`,
                data:null,
            });
        }
    }
    
});

const postComment = asyncHandler(async (req, res) => {
    const { comment,postID } = req.body;
    if(!comment) {
        res.status(500).send({
            success: false,
            code: 10,
            message: 'Empty comment',
        });
    } else {
        try {
            const post = await POST.findByIdAndUpdate({_id:postID}, {
                $push: {
                    comments: {
                        comment,
                        postedBy: req.user._id,
                    }
                }
            }).populate("comments.postedBy", "-password -followers -following -userName");
            if(post) {
                res.status(200).json({
                    code: 20,
                    message: "Comment posted successfully",
                    success: true,
                    data: post,
                })
            } else {
                res.status(500).send({
                    code: 30,
                    message: "Cant post a comment",
                    success: false,
                });
            }  
        }catch(error) {
            res.status(500).json({
                code: 40,
                message: error.message,
                success: false,
            })
        }
    }
});

const removePost = asyncHandler(async (req, res) => {
    const _id = req.params.id;
    if(!_id) {
        res.status(500).send({
            success: false,
            message: "Post id not received",
        });
    } else {
        const rem = await POST.deleteOne({_id});
        if(rem) {
            res.status(200).send({
                sucess: true,
                rem,
                message: "Post removed successfully", 
            })
        } else {
            res.status(500).send({
                success: false,
                message: "Try after some time",
            });
        }
    }
});

module.exports = { createPost, fetchAllPosts, likePost, unLikePost, postComment, savePic, removePost }