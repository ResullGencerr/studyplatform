const Profile = require('../models/profile');
const User = require('../models/user');
const CourseProgress = require('../models/courseProgress');
const Course = require('../models/course');

const { uploadImageToCloudinary, deleteResourceFromCloudinary } = require('../utils/imageUploader');
const { convertSecondsToDuration } = require('../utils/secToDuration');


exports.updateProfile = async (req, res) => {
  try {
    const { gender = '', dateOfBirth = '', about = '', contactNumber = '', firstName, lastName } = req.body;
    const userId = req.user.id;

    const userDetails = await User.findById(userId);
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);

    userDetails.firstName = firstName;
    userDetails.lastName = lastName;
    await userDetails.save();

    profileDetails.gender = gender;
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.contactNumber = contactNumber;
    await profileDetails.save();

    const updatedUserDetails = await User.findById(userId).populate('additionalDetails');

    res.status(200).json({
      success: true,
      updatedUserDetails,
      message: 'Profil başarıyla güncellendi.',
    });
  } catch (error) {
    console.log('Profil güncellenirken hata:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Profil güncellenirken bir hata oluştu.',
    });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const userDetails = await User.findById(userId);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı.',
      });
    }

    await deleteResourceFromCloudinary(userDetails.image);

    const userEnrolledCoursesId = userDetails.courses;
    for (const courseId of userEnrolledCoursesId) {
      await Course.findByIdAndUpdate(courseId, {
        $pull: { studentsEnrolled: userId },
      });
    }

    await Profile.findByIdAndDelete(userDetails.additionalDetails);
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: 'Hesap başarıyla silindi.',
    });
  } catch (error) {
    console.log('Hesap silinirken hata:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Hesap silinirken bir hata oluştu.',
    });
  }
};


exports.getUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const userDetails = await User.findById(userId).populate('additionalDetails').exec();

    res.status(200).json({
      success: true,
      data: userDetails,
      message: 'Kullanıcı bilgileri başarıyla getirildi.',
    });
  } catch (error) {
    console.log('Kullanıcı bilgileri alınırken hata:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Kullanıcı bilgileri alınırken bir hata oluştu.',
    });
  }
};


exports.updateUserProfileImage = async (req, res) => {
  try {
    const profileImage = req.files?.profileImage;
    const userId = req.user.id;

    const image = await uploadImageToCloudinary(profileImage, process.env.FOLDER_NAME, 1000, 1000);

    const updatedUserDetails = await User.findByIdAndUpdate(
      userId,
      { image: image.secure_url },
      { new: true }
    ).populate('additionalDetails');

    res.status(200).json({
      success: true,
      message: 'Profil fotoğrafı başarıyla güncellendi.',
      data: updatedUserDetails,
    });
  } catch (error) {
    console.log('Profil fotoğrafı güncellenirken hata:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: 'Profil fotoğrafı güncellenirken hata oluştu.',
    });
  }
};


exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    let userDetails = await User.findOne({ _id: userId })
      .populate({
        path: 'courses',
        populate: {
          path: 'courseContent',
          populate: {
            path: 'subSection',
          },
        },
      })
      .exec();

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Kullanıcı bulunamadı.`,
      });
    }

    userDetails = userDetails.toObject();
    var SubsectionLength = 0;

    for (let i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0;
      SubsectionLength = 0;

      for (let j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        totalDurationInSeconds += userDetails.courses[i].courseContent[j].subSection.reduce(
          (acc, curr) => acc + parseInt(curr.timeDuration),
          0
        );

        userDetails.courses[i].totalDuration = convertSecondsToDuration(totalDurationInSeconds);
        SubsectionLength += userDetails.courses[i].courseContent[j].subSection.length;
      }

      let courseProgressCount = await CourseProgress.findOne({
        courseID: userDetails.courses[i]._id,
        userId: userId,
      });

      const completedCount = courseProgressCount?.completedVideos.length || 0;

      if (SubsectionLength === 0) {
        userDetails.courses[i].progressPercentage = 100;
      } else {
        const multiplier = Math.pow(10, 2);
        userDetails.courses[i].progressPercentage =
          Math.round((completedCount / SubsectionLength) * 100 * multiplier) / multiplier;
      }
    }

    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Kurs bilgileri alınırken bir hata oluştu.',
    });
  }
};

exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id });

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnrolled.length;
      const totalAmountGenerated = totalStudentsEnrolled * course.price;

      return {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        totalStudentsEnrolled,
        totalAmountGenerated,
      };
    });

    res.status(200).json({
      courses: courseData,
      message: 'Eğitmen paneli verileri başarıyla getirildi.',
    });
  } catch (error) {
    console.error('Eğitmen paneli verisi alınamadı:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası oluştu.',
    });
  }
};
