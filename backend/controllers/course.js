const Course = require("../models/course");
const User = require("../models/user");
const Category = require("../models/category");
const Section = require("../models/section");
const SubSection = require("../models/subSection");
const CourseProgress = require("../models/courseProgress");
const generateJitsiJWT = require("../utils/generateJitsiJWT");

const {
  uploadImageToCloudinary,
  deleteResourceFromCloudinary,
} = require("../utils/imageUploader");
const { convertSecondsToDuration } = require("../utils/secToDuration");

// ================ create new course ================
exports.createCourse = async (req, res) => {
  try {
    // 1. Verileri al
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

    // 2. String verileri parse et
    const tag = JSON.parse(_tag || "[]");
    const instructions = JSON.parse(_instructions || "[]");

    const liveClass = _liveClass === "true" || _liveClass === true;

    // 3. Thumbnail yükle
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

    // 4. Canlı ders bilgilerini oluştur
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

    // 5. Zorunlu alan kontrolü
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

    // 6. Kategoriyi doğrula
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Kategori bulunamadı.",
      });
    }

    // 7. Kursu oluştur
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

    // 8. Eğitmene kursu ekle
    await User.findByIdAndUpdate(
      instructorId,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    // 9. Kategoriye kursu ekle
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
    console.log("Kurs oluşturulurken hata:", error);
    return res.status(500).json({
      success: false,
      message: "Sunucu hatası",
      error: error.message,
    });
  }
};

// ================ show all courses ================
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

// ================ Get Course Details ================
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

    //return response
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

// ================ Get Full Course Details ================
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

// ================ Edit Course Details ================
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

// ================ Get a list of Course for a given Instructor ================
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

// ================ Delete the Course ================
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
  const io = req.app.get("io");

  try {
    const course = await Course.findById(courseId).populate("instructor");

    if (!course || !course.isLive) {
      return res
        .status(404)
        .json({ error: "Kurs bulunamadı veya canlı kurs değil." });
    }

    if (course.liveSchedule.status === "online") {
      return res.status(400).json({ error: "Canlı ders zaten başlatılmış." });
    }

    const roomId = `${courseId}-${Date.now()}`;
    const meetingLink = `https://resulgencer.infy.uk/${roomId}`;

    // 🔐 MODERATOR TOKEN
    const teacher = req.user;
    const jitsiToken = generateJitsiJWT(teacher, roomId, true); // 🔥 öğretmen moderatör
    const fullLinkWithToken = `${meetingLink}?jwt=${jitsiToken}`;

    // 🌐 Veritabanına kaydet
    course.liveSchedule.status = "online";
    course.liveMeetingLink = meetingLink;
    await course.save();

    // 🔔 Socket ile öğrencilere yayın başlatıldı bildirimi
    io.emit("live-class-started", {
      courseId: course._id.toString(),
      title: course.courseName,
      teacher: course.instructor?.firstName || "Öğretmen",
      link: meetingLink,
    });

    // 🎯 Öğretmene tokenlı link dön
    res.status(200).json({
      message: "Canlı ders başarıyla başlatıldı.",
      link: fullLinkWithToken, // 🔑 link + token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

exports.endLiveClass = async (req, res) => {
  const { courseId } = req.body;
  console.log("🎯 Gelen Kapatma İsteği:", courseId); // TEST LOG BURADA
  try {
    const course = await Course.findById(courseId);

    if (!course || !course.isLive) {
      return res
        .status(404)
        .json({ error: "Kurs bulunamadı veya canlı kurs değil." });
    }

    if (course.liveSchedule.status === "offline") {
      return res.status(400).json({ error: "Canlı ders zaten bitirilmiş." });
    }

    course.liveSchedule.status = "offline";
    course.liveMeetingLink = null;

    await course.save();

    res.status(200).json({ message: "Canlı ders başarıyla sona erdi." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};
exports.joinLiveClass = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId).populate("instructor");

    if (!course || !course.isLive) {
      return res
        .status(404)
        .json({ success: false, message: "Kurs bulunamadı." });
    }

    if (course.liveSchedule.status !== "online") {
      return res
        .status(403)
        .json({ success: false, message: "Canlı ders henüz başlatılmadı." });
    }

    // ✅ Kullanıcı bilgisi alınıyor
    const user = req.user;

    // ✅ Güvenli şekilde moderator kontrolü
    const isModerator =
      course?.instructor &&
      user &&
      user._id?.toString() === course.instructor._id?.toString();

    // ✅ Room adı linkin sonundan çekiliyor
    const roomName = course.liveMeetingLink.split("/").pop();

    // ✅ Token üretiliyor
    const jitsiToken = generateJitsiJWT(user, roomName, isModerator);

    // ✅ Geriye tam bağlantı dönülüyor
    const fullLink = `${course.liveMeetingLink}?jwt=${jitsiToken}`;
    const payload = JSON.parse(
      Buffer.from(jitsiToken.split(".")[1], "base64").toString()
    );
    console.log("🎯 JOIN LIVE CLASS TOKEN PAYLOAD:", payload);

    return res.status(200).json({
      success: true,
      link: fullLink,
    });
  } catch (error) {
    console.error("joinLiveClass Hatası:", error);
    return res.status(500).json({
      success: false,
      message: "Sunucu hatası",
    });
  }
};
