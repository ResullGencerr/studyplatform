const Category = require("../models/category");
const mongoose = require("mongoose");

const Course = require("../models/course");

// get Random Integer
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// ================ create Category ================
exports.createCategory = async (req, res) => {
  try {
    // extract data
    const { name, description } = req.body;

    // validation
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const categoryDetails = await Category.create({
      name: name,
      description: description,
    });

    res.status(200).json({
      success: true,
      message: "Category created successfully",
    });
  } catch (error) {
    console.log("Error while creating Category");
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error while creating Category",
      error: error.message,
    });
  }
};

// ================ get All Category ================
exports.showAllCategories = async (req, res) => {
  try {
    // get all category from DB
    const allCategories = await Category.find(
      {},
      { name: true, description: true }
    );

    // return response
    res.status(200).json({
      success: true,
      data: allCategories,
      message: "All allCategories fetched successfully",
    });
  } catch (error) {
    console.log("Error while fetching all allCategories");
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error while fetching all allCategories",
    });
  }
};

// ================ Get Category Page Details ================
exports.getCategoryPageDetails = async (req, res) => {
  try {
    const categoryId = req.body.categoryId?.trim();

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Geçersiz kategori ID'si",
      });
    }

    const selectedCategory = await Category.findById(categoryId);
    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Kategori bulunamadı.",
      });
    }

    const categoryCourses = await Course.find({
      category: categoryId,
      status: "Published",
    }).populate("ratingAndReviews");

    if (categoryCourses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Seçilen kategori için kurs bulunamadı.",
      });
    }

    if (selectedCategory.courses?.length === 0) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Kategoriye ait kurs bulunamadı.",
      });
    }

    // Diğer kategorilerden rastgele bir tane seç
    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    });

    let differentCategory = null;
    if (categoriesExceptSelected.length > 0) {
      const randomCategory =
        categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)];

      differentCategory = await Category.findById(randomCategory._id)
        .populate({
          path: "courses",
          match: { status: "Published" },
        })
        .exec();
    }

    // ✅ Tüm yayınlanmış kursları getir, en yenilere göre sırala
    const latestCourses = await Course.find({ status: "Published" })
      .sort({ createdAt: -1 }) // ⬅️ En son eklenenler önce gelsin
      .limit(10)
      .populate("instructor")
      .populate("ratingAndReviews");

    res.status(200).json({
      success: true,
      data: {
        selectedCategory: {
          _id: selectedCategory._id,
          name: selectedCategory.name,
          description: selectedCategory.description,
          courses: categoryCourses,
        },
        differentCategory,
        mostSellingCourses: latestCourses, // 🔥 Home sayfası bunu kullanacak
      },
    });
  } catch (error) {
    console.log("getCategoryPageDetails error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
