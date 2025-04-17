import React, { useEffect, useState } from "react";
// İkonlar
// import { FaRegStar, FaStar } from "react-icons/fa"
// import ReactStars from "react-rating-stars-component"
import { Link } from "react-router-dom";

import GetAvgRating from "../../../utils/avgRating";
import RatingStars from "../../common/RatingStars";
import Img from "./../../common/Img";

function Course_Card({ course, Height }) {
  // Ortalama değerlendirme puanını hesapla
  const [avgReviewCount, setAvgReviewCount] = useState(0);
  useEffect(() => {
    const count = GetAvgRating(course.ratingAndReviews);
    setAvgReviewCount(count);
  }, [course]);

  return (
    <div className="hover:scale-[1.03] transition-all duration-200 z-50 ">
      <Link to={`/courses/${course._id}`}>
        <div className="">
          <div className="rounded-lg">
            <Img
              src={course?.thumbnail}
              alt="kurs küçük resmi"
              className={`${Height} w-full rounded-xl object-cover `}
            />
          </div>
          <div className="flex flex-col gap-2 px-1 py-3">
            <p className="text-xl text-richblack-5">{course?.courseName}</p>
            <p className="text-sm text-richblack-50">
              {course?.instructor?.firstName} {course?.instructor?.lastName}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-yellow-5">{avgReviewCount || 0}</span>
              {/*
              Değerlendirme yıldızları (ikonu yorum satırında tutuyorum, alternatif olarak kullanılabilir)
              */}
              <RatingStars Review_Count={avgReviewCount} />
              <span className="text-richblack-400">
                {course?.ratingAndReviews?.length} Değerlendirme
              </span>
            </div>
            <p className="text-xl text-richblack-5">₺ {course?.price}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default Course_Card;
