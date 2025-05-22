import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { HiClock } from "react-icons/hi";
import { RiDeleteBin6Line } from "react-icons/ri";

import toast from "react-hot-toast";
import { formatDate } from "../../../../services/formatDate";
import {
  deleteCourse,
  fetchInstructorCourses,
  startLiveClass,
} from "../../../../services/operations/courseDetailsAPI";
import { COURSE_STATUS } from "../../../../utils/constants";
import ConfirmationModal from "../../../common/ConfirmationModal";
import Img from "./../../../common/Img";

export default function CoursesTable({
  courses,
  setCourses,
  loading,
  setLoading,
}) {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const TRUNCATE_LENGTH = 25;

  const handleCourseDelete = async (courseId) => {
    setLoading(true);
    const toastId = toast.loading("Siliniyor...");
    await deleteCourse({ courseId }, token);
    const result = await fetchInstructorCourses(token);
    if (result) {
      setCourses(result);
    }
    setConfirmationModal(null);
    setLoading(false);
    toast.dismiss(toastId);
  };

  const skItem = () => (
    <div className="flex border-b border-richblack-800 px-6 py-8 w-full">
      <div className="flex flex-1 gap-x-4">
        <div className="h-[148px] min-w-[300px] rounded-xl skeleton"></div>
        <div className="flex flex-col w-[40%]">
          <p className="h-5 w-[50%] rounded-xl skeleton"></p>
          <p className="h-20 w-[60%] rounded-xl mt-3 skeleton"></p>
          <p className="h-2 w-[20%] rounded-xl skeleton mt-3"></p>
          <p className="h-2 w-[20%] rounded-xl skeleton mt-2"></p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Table className="rounded-2xl border border-richblack-800">
        <Thead>
          <Tr className="flex gap-x-10 rounded-t-3xl border-b border-b-richblack-800 px-6 py-2">
            <Th className="flex-1 text-left text-sm font-medium uppercase text-richblack-100">
              Kurslar
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              Süre
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              Fiyat
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              İşlemler
            </Th>
          </Tr>
        </Thead>

        {loading && (
          <div>
            {skItem()}
            {skItem()}
            {skItem()}
          </div>
        )}

        <Tbody>
          {!loading && courses?.length === 0 ? (
            <Tr>
              <Td className="py-10 text-center text-2xl font-medium text-richblack-100">
                Hiç kurs bulunamadı
              </Td>
            </Tr>
          ) : (
            courses?.map((course) => (
              <Tr
                key={course._id}
                className="flex gap-x-10 border-b border-richblack-800 px-6 py-8"
              >
                <Td className="flex flex-1 gap-x-4 relative">
                  {/* Thumbnail */}
                  <Img
                    src={course?.thumbnail}
                    alt={course?.courseName}
                    className="h-[148px] min-w-[270px] max-w-[270px] rounded-lg object-cover"
                  />

                  {/* Bilgiler */}
                  <div className="flex flex-col flex-1 relative pr-6 min-h-[180px]">
                    <p className="text-lg font-semibold text-richblack-5 capitalize">
                      {course.courseName}
                    </p>
                    <p className="text-xs text-richblack-300">
                      {course.courseDescription.split(" ").length >
                      TRUNCATE_LENGTH
                        ? course.courseDescription
                            .split(" ")
                            .slice(0, TRUNCATE_LENGTH)
                            .join(" ") + "..."
                        : course.courseDescription}
                    </p>

                    <p className="text-[12px] text-richblack-100 mt-4">
                      Oluşturulma: {formatDate(course?.createdAt)}
                    </p>

                    {course.isLive && course.liveSchedule && (
                      <div className="mt-2 flex flex-col gap-1 text-[12px] text-blue-200">
                        <p>
                          <strong>Canlı Durum:</strong>{" "}
                          {course.liveSchedule.status === "online" ? (
                            <span className="text-green-400">Online</span>
                          ) : (
                            <span className="text-red-400">Offline</span>
                          )}
                        </p>
                        <p>
                          <strong>Günler:</strong>{" "}
                          {course.liveSchedule.days.join(", ")}
                        </p>
                        <p>
                          <strong>Başlangıç:</strong> {course.liveSchedule.time}
                        </p>
                        <p>
                          <strong>Süre:</strong> {course.liveSchedule.duration}{" "}
                          saat
                        </p>
                      </div>
                    )}

                    <p className="text-[12px] text-richblack-100">
                      Güncellendi: {formatDate(course?.updatedAt)}
                    </p>

                    {course.status === COURSE_STATUS.DRAFT ? (
                      <p className="mt-2 flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-pink-100">
                        <HiClock size={14} />
                        Taslak
                      </p>
                    ) : (
                      <div className="mt-2 flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-yellow-100">
                        <p className="flex h-3 w-3 items-center justify-center rounded-full bg-yellow-100 text-richblack-700">
                          <FaCheck size={8} />
                        </p>
                        Yayınlandı
                      </div>
                    )}

                    {/* ✅ Canlı Dersi Başlat Sağ Alt */}
                    {course.isLive && user.accountType === "Instructor" && (
  <div className="absolute bottom-2 right-2">
    <button
      className="px-4 py-1 bg-yellow-500 text-black rounded hover:bg-yellow-400 transition-all text-sm"
      onClick={async () => {
        const result = await startLiveClass(course._id, token);
        if (result?.roomId && result?.token) {
          navigate(`/canli-yayin/${result.roomId}`, {
            state: { jitsiToken: result.token }, // ✅ artık token URL'de değil
          });
        } else {
          toast.error("Canlı ders başlatılamadı.");
        }
      }}
    >
      Canlı Dersi Başlat
    </button>
  </div>
)}
                  </div>
                </Td>

                {/* Süre */}
                <Td className="text-sm font-medium text-richblack-100">
                  {course.isLive && course.liveSchedule?.days?.length > 0
                    ? `${
                        course.liveSchedule.duration *
                        course.liveSchedule.days.length
                      } saat`
                    : "--"}
                </Td>

                {/* Fiyat */}
                <Td className="text-sm font-medium text-richblack-100">
                  ₺{course.price}
                </Td>

                {/* İşlemler */}
                <Td className="text-sm font-medium text-richblack-100">
                  <button
                    disabled={loading}
                    onClick={() =>
                      navigate(`/dashboard/edit-course/${course._id}`)
                    }
                    title="Düzenle"
                    className="px-2 transition-all duration-200 hover:scale-110 hover:text-caribbeangreen-300"
                  >
                    <FiEdit2 size={20} />
                  </button>

                  <button
                    disabled={loading}
                    onClick={() => {
                      setConfirmationModal({
                        text1: "Bu kursu silmek istiyor musunuz?",
                        text2: "Bu kursa ait tüm veriler silinecektir.",
                        btn1Text: !loading ? "Sil" : "Yükleniyor...",
                        btn2Text: "İptal",
                        btn1Handler: !loading
                          ? () => handleCourseDelete(course._id)
                          : () => {},
                        btn2Handler: !loading
                          ? () => setConfirmationModal(null)
                          : () => {},
                      });
                    }}
                    title="Sil"
                    className="px-1 transition-all duration-200 hover:scale-110 hover:text-[#ff0000]"
                  >
                    <RiDeleteBin6Line size={20} />
                  </button>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>

      {/* Silme Onayı */}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
}
