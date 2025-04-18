import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useParams } from "react-router-dom";

import CourseReviewModal from "../components/core/ViewCourse/CourseReviewModal";
import VideoDetailsSidebar from "../components/core/ViewCourse/VideoDetailsSidebar";
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI";
import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "../slices/viewCourseSlice";

import { setCourseViewSidebar } from "../slices/sidebarSlice";

export default function ViewCourse() {
  const { courseId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [reviewModal, setReviewModal] = useState(false);

  // Kursun tüm detaylarını alma işlemi
  useEffect(() => {
    (async () => {
      const courseData = await getFullDetailsOfCourse(courseId, token);
      // Redux state’ine kurs detaylarını gönderiyoruz
      dispatch(setCourseSectionData(courseData.courseDetails.courseContent));
      dispatch(setEntireCourseData(courseData.courseDetails));
      dispatch(setCompletedLectures(courseData.completedVideos));

      // Toplam ders sayısını hesaplayıp state’e gönderiyoruz
      let lectures = 0;
      courseData?.courseDetails?.courseContent?.forEach((sec) => {
        lectures += sec.subSection.length;
      });
      dispatch(setTotalNoOfLectures(lectures));
    })();
  }, []);

  // Küçük ekranlarda sidebar görünürlüğünü kontrol etmek için ekran genişliği state’i
  const { courseViewSidebar } = useSelector((state) => state.sidebar);
  const [screenSize, setScreenSize] = useState(undefined);

  // Ekran boyutunu dinleme
  useEffect(() => {
    const handleScreenSize = () => setScreenSize(window.innerWidth);

    window.addEventListener("resize", handleScreenSize);
    handleScreenSize();

    return () => window.removeEventListener("resize", handleScreenSize);
  });

  // Ekran genişliğine göre sidebar açma/kapama
  useEffect(() => {
    if (screenSize <= 640) {
      dispatch(setCourseViewSidebar(false));
    } else {
      dispatch(setCourseViewSidebar(true));
    }
  }, [screenSize]);

  return (
    <>
      <div className="relative flex min-h-[calc(100vh-3.5rem)] ">
        {/* Kurs detayları için sol taraf sidebar bileşeni */}
        {courseViewSidebar && (
          <VideoDetailsSidebar setReviewModal={setReviewModal} />
        )}

        {/* Sağ kısım: Video ve ders içeriklerinin gösterileceği alan */}
        <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto mt-14">
          <div className="mx-6">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Kullanıcı yorum modalı (Kapatmak için setReviewModal kullanılır) */}
      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </>
  );
}
