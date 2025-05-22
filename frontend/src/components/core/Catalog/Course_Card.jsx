import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GetAvgRating from "../../../utils/avgRating";
import RatingStars from "../../common/RatingStars";

function Course_Card({ course }) {
  const [avgReviewCount, setAvgReviewCount] = useState(0);

  useEffect(() => {
    const count = GetAvgRating(course.ratingAndReviews);
    setAvgReviewCount(count);
  }, [course]);

  return (
    <div className="relative w-full max-w-[370px] min-w-[280px] bg-richblack-800 rounded-xl overflow-hidden shadow-md hover:scale-[1.015] transition-all duration-300">
      <Link to={`/courses/${course._id}`}>
        {/* ✅ CANLI Etiketi */}
        {course?.isLive && (
          <div className="absolute top-2 left-2 bg-yellow-5 text-richblack-900  px-3 py-1 text-sm font-bold rounded-md shadow-md tracking-wide">
            CANLI
          </div>
        )}

        {/* Görsel */}
        <div className="w-full aspect-[16/9]">
          <img
            src={course?.thumbnail}
            alt="course thumbnail"
            className="w-full h-full object-cover rounded-t-xl"
          />
        </div>

        {/* İçerik */}
        <div className="flex flex-col gap-2 px-4 py-4">
          {/* Kurs Adı */}
          <p className="text-lg font-semibold text-richblack-5 line-clamp-1">
            {course?.courseName}
          </p>

          {/* Eğitmen */}
          <p className="text-sm text-richblack-300 line-clamp-1">
            {course?.instructor?.firstName} {course?.instructor?.lastName}
          </p>

          {/* Değerlendirme */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-yellow-5">{avgReviewCount || 0}</span>
            <RatingStars Review_Count={avgReviewCount} />
            <span className="text-richblack-400">
              {course?.ratingAndReviews?.length || 0} Değerlendirme
            </span>
          </div>

          {/* Fiyat */}
          <p className="text-md font-bold text-yellow-25">
            ₺ {course?.price?.toLocaleString("tr-TR")}
          </p>
        </div>
      </Link>
    </div>
  );
}

export default Course_Card;
