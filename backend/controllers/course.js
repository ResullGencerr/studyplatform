const Course = require("../models/course");
const User = require("../models/user");
const Category = require("../models/category");
const Section = require("../models/section");
const SubSection = require("../models/subSection");
const CourseProgress = require("../models/courseProgress");
const {
  createRoom,
  generateToken,
  deleteRoom,
} = require("../utils/videoUtils");

const {
  uploadImageToCloudinary,
  deleteResourceFromCloudinary,
} = require("../utils/imageUploader");
const { convertSecondsToDuration } = require("../utils/secToDuration");


exports.createCourse = async (req, res) => {
  try {
  
    const {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      category,
      status: rawStatus,
      instructions: _instructions,
      tag: _tag,
      liveClass: _liveClass,
      scheduleDays,
      scheduleStartTime,
      scheduleDuration,
    } = req.body;


    const tag = JSON.parse(_tag || "[]");
    const instructions = JSON.parse(_instructions || "[]");

    const liveClass = _liveClass === "true" || _liveClass === true;

   
    const thumbnail = req.files?.thumbnailImage;
    if (!thumbnail) {
      return res.status(400).json({
        success: false,
        message: "Kurs görseli zorunludur.",
      });
    }
    const thumbnailDetails = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    let liveSchedule = undefined;
    if (liveClass) {
      const days = JSON.parse(scheduleDays || "[]");
      const duration = Number(scheduleDuration);

      if (!days.length || !scheduleStartTime || !duration) {
        return res.status(400).json({
          success: false,
          message: "Canlı ders için gün, saat ve süre zorunludur.",
        });
      }

      liveSchedule = {
        days,
        time: scheduleStartTime,
        duration,
        status: "offline",
      };
    }

 
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !category ||
      !tag.length ||
      !instructions.length
    ) {
      return res.status(400).json({
        success: false,
        message: "Tüm alanlar zorunludur.",
      });
    }

    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Kategori bulunamadı.",
      });
    }

   
    const instructorId = req.user.id;
    const status = rawStatus || "Draft";

    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorId,
      whatYouWillLearn,
      price,
      category: categoryDetails._id,
      tag,
      status,
      instructions,
      thumbnail: thumbnailDetails.secure_url,
      isLive: liveClass,
      liveSchedule,
      liveMeetingLink: null,
      createdAt: Date.now(),
    });

    await User.findByIdAndUpdate(
      instructorId,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

   
    await Category.findByIdAndUpdate(
      categoryDetails._id,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    // 10. Yanıtla
    return res.status(200).json({
      success: true,
      data: newCourse,
      message: "Kurs başarıyla oluşturuldu.",
    });
  } catch (error) {
   
    return res.status(500).json({
      success: false,
      message: "Sunucu hatası",
      error: error.message,
    });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        courseDescription: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
      .populate({
        path: "instructor",
        select: "firstName lastName email image",
      })
      .exec();

    return res.status(200).json({
      success: true,
      data: allCourses,
      message: "Data for all courses fetched successfully",
    });
  } catch (error) {
    console.log("Error while fetching data of all courses");
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Error while fetching data of all courses",
    });
  }
};


exports.getCourseDetails = async (req, res) => {
  try {
    // get course ID
    const { courseId } = req.body;

    // find course details
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")

      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
          select: "-videoUrl",
        },
      })
      .exec();

    //validation
    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find the course with ${courseId}`,
      });
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    // console.log('courseDetails -> ', courseDetails)
    let totalDurationInSeconds = 0;
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration);
        totalDurationInSeconds += timeDurationInSeconds;
      });
    });

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
      },
      message: "Fetched course data successfully",
    });
  } catch (error) {
    console.log("Error while fetching course details");
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Error while fetching course details",
    });
  }
};

exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;
    // console.log('courseId userId  = ', courseId, " == ", userId)

    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    });

    //   console.log("courseProgressCount : ", courseProgressCount)

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      });
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    //   count total time duration of course
    let totalDurationInSeconds = 0;
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration);
        totalDurationInSeconds += timeDurationInSeconds;
      });
    });

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const updates = req.body;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // If Thumbnail Image is found, update it
    if (req.files) {
      // console.log("thumbnail update")
      const thumbnail = req.files.thumbnailImage;
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      );
      course.thumbnail = thumbnailImage.secure_url;
    }

    // Update only the fields that are present in the request body
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (key === "tag" || key === "instructions") {
          course[key] = JSON.parse(updates[key]);
        } else {
          course[key] = updates[key];
        }
      }
    }

    // updatedAt
    course.updatedAt = Date.now();

    //   save data
    await course.save();

    const updatedCourse = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    // success response
    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while updating course",
      error: error.message,
    });
  }
};


exports.getInstructorCourses = async (req, res) => {
  try {
    // Get the instructor ID from the authenticated user or request body
    const instructorId = req.user.id;

    // Find all courses belonging to the instructor
    const instructorCourses = await Course.find({
      instructor: instructorId,
    }).sort({ createdAt: -1 });

    // Return the instructor's courses
    res.status(200).json({
      success: true,
      data: instructorCourses,
      // totalDurationInSeconds:totalDurationInSeconds,
      message: "Courses made by Instructor fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    });
  }
};


exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentsEnrolled;
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      });
    }

    // delete course thumbnail From Cloudinary
    await deleteResourceFromCloudinary(course?.thumbnail);

    // Delete sections and sub-sections
    const courseSections = course.courseContent;
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId);
      if (section) {
        const subSections = section.subSection;
        for (const subSectionId of subSections) {
          const subSection = await SubSection.findById(subSectionId);
          if (subSection) {
            await deleteResourceFromCloudinary(subSection.videoUrl); // delete course videos From Cloudinary
          }
          await SubSection.findByIdAndDelete(subSectionId);
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId);
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error while Deleting course",
      error: error.message,
    });
  }
};

exports.startLiveClass = async (req, res) => {
  const { courseId } = req.body;
  const teacher = req.user;

  try {
    const course = await Course.findById(courseId).populate("instructor");

    if (!course) {
      return res.status(404).json({ error: "Kurs bulunamadı." });
    }

    if (!teacher || (!teacher._id && !teacher.id)) {
      return res.status(400).json({ error: "Kullanıcı bilgisi eksik." });
    }

    if (!course.instructor || !course.instructor._id) {
      return res.status(400).json({ error: "Kursun eğitmeni tanımlı değil." });
    }

    const teacherId = teacher._id || teacher.id;
    if (course.instructor._id.toString() !== teacherId.toString()) {
      return res.status(403).json({ error: "Bu kurs size ait değil." });
    }

    if (course.liveSchedule?.status === "online") {
      return res.status(400).json({ error: "Bu ders zaten canlı durumda." });
    }

    const room = await createRoom(`course-${courseId}`);
    await new Promise((r) => setTimeout(r, 1000));

    const token = await generateToken(room.id, teacherId.toString(), "Instructor");
  

    course.liveSchedule.status = "online";
    course.liveMeetingLink = room.id;
    await course.save();

   
    return res.status(200).json({
      message: "Canlı ders başlatıldı.",
      roomId: room.id,
      token,
    });
  } catch (err) {
    console.error("🔥 startLiveClass error:", err);
    return res.status(500).json({ error: "Sunucu hatası" });
  }
};

exports.joinLiveClass = async (req, res) => {
  const { courseId } = req.params;
  const user = req.user;
  const userId = user._id || user.id;

  try {
   

    const course = await Course.findById(courseId);
    if (!course || course.liveSchedule.status !== "online") {
      return res.status(400).json({ error: "Canlı ders aktif değil." });
    }

    const isEnrolled = course.studentsEnrolled.some(
      (studentId) => studentId.toString() === userId.toString()
    );

    if (!isEnrolled) {
      return res.status(403).json({ error: "Bu derse kayıtlı değilsiniz." });
    }

    const token = await generateToken(
      course.liveMeetingLink,
      userId.toString(),
      user.accountType
    );

   
    return res.status(200).json({
      roomId: course.liveMeetingLink,
      token,
    });
  } catch (err) {
    console.error("🔥 joinLiveClass error:", err);
    return res.status(500).json({ error: "Sunucu hatası" });
  }
};

exports.endLiveClass = async (req, res) => {
  const { courseId } = req.body;
  const user = req.user;
  const io = req.app.get("io");

  try {
    const course = await Course.findById(courseId);

    console.log("🎯 courseId geldi:", courseId);
    console.log("🎯 course bulundu:", course?.title);
     
    if (!course || course.liveSchedule.status !== "online") {
      return res.status(400).json({ error: "Canlı ders aktif değil." });
    }

    const userId = user._id || user.id;
    if (course.instructor.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Sadece eğitmen bitirebilir." });
    }

    const roomName = course.liveMeetingLink;

    // 🎯 Katılımcılara sinyal gönder
    if (io && roomName) {
      io.to(roomName).emit("LIVE_CLASS_ENDED");
      console.log(`📡 Oda kapatıldı: ${roomName}`);
    }

    // ✅ Veritabanını güncelle
    course.liveSchedule.status = "offline";
    course.liveMeetingLink = null;
    course.markModified("liveSchedule"); // 💥 En önemli satır!
    await course.save();
console.log(`📚 Kurs ${courseId} başarıyla offline yapıldı.`);
    return res.status(200).json({ message: "Ders bitirildi." });
  } catch (err) {
    console.error("🔥 endLiveClass error:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

