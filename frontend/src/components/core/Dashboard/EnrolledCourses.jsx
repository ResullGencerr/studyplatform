import ProgressBar from "@ramonak/react-progress-bar";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { joinLiveClass } from "../../../services/operations/courseDetailsAPI";
import { getUserEnrolledCourses } from "../../../services/operations/profileAPI";
import Img from "./../../common/Img";
export default function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState(null);

  const getEnrolledCourses = async () => {
    try {
      const res = await getUserEnrolledCourses(token);
      setEnrolledCourses(res);
    } catch (error) {
      console.log("Kayıt olunan kurslar getirilemedi.");
    }
  };

  useEffect(() => {
    getEnrolledCourses();
  }, []);

  if (enrolledCourses?.length === 0) {
    return (
      <p className="grid h-[50vh] w-full place-content-center text-center text-richblack-5 text-3xl">
        Henüz herhangi bir kursa kayıt olmadınız.
      </p>
    );
  }

  return (
    <>
      <div className="text-4xl text-richblack-5 font-boogaloo text-center sm:text-left">
        Kayıt Olunan Kurslar
      </div>

      <div className="my-8 text-richblack-5">
        {/* Başlıklar */}
        <div className="flex rounded-t-2xl bg-richblack-800">
          <p className="w-[45%] px-5 py-3">Kurs Adı</p>
          <p className="w-1/4 px-2 py-3 text-center">Süre</p>
          <p className="flex-1 px-2 py-3 text-center">İlerleme</p>
        </div>

        {/* Kurslar */}
        {enrolledCourses?.map((course, i, arr) => (
          <div
            key={course._id}
            className={`flex flex-col sm:flex-row sm:items-center border border-richblack-700 ${
              i === arr.length - 1 ? "rounded-b-2xl" : ""
            }`}
          >
            {/* Kurs Bilgisi */}
            <div
              className="flex sm:w-[45%] items-center gap-4 px-5 py-3 cursor-pointer"
              onClick={() => {
                navigate(
                  `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                );
              }}
            >
              <Img
                src={course.thumbnail}
                alt="kurs_resmi"
                className="h-14 w-14 rounded-lg object-cover"
              />

              <div className="flex max-w-xs flex-col gap-2">
                <p className="font-semibold">{course.courseName}</p>
                <p className="text-xs text-richblack-300">
                  {course.courseDescription.length > 50
                    ? `${course.courseDescription.slice(0, 50)}...`
                    : course.courseDescription}
                </p>
              </div>
            </div>

            {/* Süre veya Canlı Detaylar */}
            <div className="w-1/4 px-2 py-3 text-center flex flex-col items-center justify-center gap-1">
              {course.isLive ? (
                <>
                  <span className="text-xs font-semibold">
                    Durum:{" "}
                    <span
                      className={
                        course.liveSchedule?.status === "online"
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {course.liveSchedule?.status === "online"
                        ? "🟢 Online"
                        : "🔴 Offline"}
                    </span>
                  </span>
                  <span className="text-xs text-blue-100">
                    <strong>Günler:</strong>{" "}
                    {course.liveSchedule?.days.join(", ")}
                  </span>
                  <span className="text-xs text-blue-100">
                    <strong>Başlangıç:</strong> {course.liveSchedule?.time}
                  </span>
                  <span className="text-xs text-blue-100">
                    <strong>Süre:</strong> {course.liveSchedule?.duration} saat
                  </span>
                </>
              ) : (
                <span className="text-sm">{course.totalDuration || "--"}</span>
              )}
            </div>

            {/* İlerleme veya Katılım */}
            <div className="flex-1 px-2 py-3 flex flex-col items-center justify-center gap-2">
              {!course.isLive ? (
                <>
                  <p className="text-sm">
                    İlerleme: {course.progressPercentage || 0}%
                  </p>
                  <ProgressBar
                    completed={course.progressPercentage || 0}
                    height="8px"
                    isLabelVisible={false}
                    className="w-[90%]"
                    bgColor="#facc15"
                    baseBgColor="#1a1a1a"
                  />
                </>
              ) : (
                <button
                  onClick={() => {
                    console.log("Öğrenci token:", token);
                    dispatch(joinLiveClass(course._id, navigate, token));
                  }}
                  className="bg-yellow-500 text-black px-4 py-1 rounded hover:bg-yellow-400 transition-all text-sm"
                >
                  Canlı Derse Katıl
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
