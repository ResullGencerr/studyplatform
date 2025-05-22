const Category = require("../models/category");
const mongoose = require("mongoose");
const Course = require("../models/course");

// Rastgele sayı üret (diğer kategoriler için)
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// ================ Kategori Oluştur ================
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "Tüm alanların doldurulması zorunludur.",
      });
    }

    await Category.create({ name, description });

    res.status(200).json({
      success: true,
      message: "Kategori başarıyla oluşturuldu.",
    });
  } catch (error) {
    console.log("Kategori oluşturulurken hata oluştu:", error);
    res.status(500).json({
      success: false,
      message: "Kategori oluşturulurken bir hata meydana geldi.",
      error: error.message,
    });
  }
};

// ================ Tüm Kategorileri Getir ================
exports.showAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.find({}, { name: true, description: true });

    res.status(200).json({
      success: true,
      data: allCategories,
      message: "Tüm kategoriler başarıyla getirildi.",
    });
  } catch (error) {
    console.log("Kategoriler alınırken hata:", error);
    res.status(500).json({
      success: false,
      message: "Kategoriler getirilirken bir hata oluştu.",
      error: error.message,
    });
  }
};

// ================ Kategori Sayfa Detaylarını Getir ================
exports.getCategoryPageDetails = async (req, res) => {
  try {
    const categoryId = req.body.categoryId?.trim();

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Geçersiz kategori ID'si.",
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
        message: "Bu kategoriye ait yayınlanmış kurs bulunamadı.",
      });
    }

    if (selectedCategory.courses?.length === 0) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Kategoriye ait kurs bulunamadı.",
      });
    }

    // Farklı bir kategoriyi rastgele seç
    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    });

    let differentCategory = null;
    if (categoriesExceptSelected.length > 0) {
      const randomCategory = categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)];

      differentCategory = await Category.findById(randomCategory._id)
        .populate({
          path: "courses",
          match: { status: "Published" },
        })
        .exec();
    }

    // Son eklenen 10 yayındaki kursu getir
    const latestCourses = await Course.find({ status: "Published" })
      .sort({ createdAt: -1 })
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
        mostSellingCourses: latestCourses,
      },
    });
  } catch (error) {
    console.log("Kategori detayları getirilirken hata:", error);
    return res.status(500).json({
      success: false,
      message: "Sunucu hatası oluştu. Lütfen tekrar deneyin.",
      error: error.message,
    });
  }
};
