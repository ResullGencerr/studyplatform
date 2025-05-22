import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { getFullDetailsOfCourse } from "../../../../services/operations/courseDetailsAPI";
import { setCourse, setEditCourse } from "../../../../slices/courseSlice";
import RenderSteps from "../AddCourse/RenderSteps";
import Loading from "./../../../common/Loading";

export default function EditCourse() {
  const dispatch = useDispatch();
  const { courseId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const { course } = useSelector((state) => state.course);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFullCourseDetails = async () => {
      setLoading(true);
      const result = await getFullDetailsOfCourse(courseId, token);
      if (result?.courseDetails) {
        dispatch(setEditCourse(true));
        dispatch(setCourse(result?.courseDetails));
      }
      setLoading(false);
    };

    fetchFullCourseDetails();
  }, []);

  // Yükleniyor ekranı
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex w-full items-start gap-x-6">
      <div className="flex flex-1 flex-col">
        <h1 className="mb-14 text-3xl font-medium text-richblack-5 text-center sm:text-left">
          Kursu Düzenle
        </h1>

        {loading ? (
          <Loading />
        ) : (
          <div className="flex-1">
            {course ? (
              <RenderSteps />
            ) : (
              <p className="mt-14 text-center text-3xl font-semibold text-richblack-100">
                Kurs bulunamadı
              </p>
            )}
          </div>
        )}
      </div>

      {/* Kurs Yükleme İpuçları */}
      {/*
      <div className="sticky top-10 hidden lg:block max-w-[400px] flex-1 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6 ">
        <p className="mb-8 text-lg text-richblack-5">⚡ Kurs Yükleme İpuçları</p>
        <ul className="ml-5 list-item list-disc space-y-4 text-xs text-richblack-5">
          <li>Kurs fiyatını belirleyin veya ücretsiz yapın.</li>
          <li>Kurs küçük resmi için önerilen boyut 1024x576’dır.</li>
          <li>Video bölümü kurs tanıtım videosunu içerir.</li>
          <li>Kurs Oluşturucu ile kursunuzu oluşturup düzenleyebilirsiniz.</li>
          <li>Dersler, quizler, ödevler eklemek için konular oluşturun.</li>
          <li>Ek Bilgiler bölümü, kurs detay sayfasında gösterilir.</li>
          <li>Önemli bilgileri duyuru olarak paylaşın.</li>
          <li>Tüm öğrencilere aynı anda not gönderin.</li>
        </ul>
      </div>
      */}
    </div>
  );
}
