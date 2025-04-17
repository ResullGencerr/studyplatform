import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import { MdNavigateNext } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

import {
  addCourseDetails,
  editCourseDetails,
  fetchCourseCategories,
} from "../../../../../services/operations/courseDetailsAPI";
import { setCourse, setStep } from "../../../../../slices/courseSlice";
import { COURSE_STATUS } from "../../../../../utils/constants";
import IconBtn from "../../../../common/IconBtn";
import Upload from "../Upload";
import ChipInput from "./ChipInput";
import RequirementsField from "./RequirementField";

export default function CourseInformationForm() {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { course, editCourse } = useSelector((state) => state.course);
  const [loading, setLoading] = useState(false);
  const [courseCategories, setCourseCategories] = useState([]);
  const [liveClass, setLiveClass] = useState(false);
  const [scheduleDays, setScheduleDays] = useState("");
  const [scheduleStartTime, setScheduleStartTime] = useState("");
  const [scheduleDuration, setScheduleDuration] = useState("");

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      const categories = await fetchCourseCategories();
      if (categories.length > 0) {
        setCourseCategories(categories);
      }
      setLoading(false);
    };

    // Düzenleme modundaysa alanları doldur
    if (editCourse) {
      setValue("courseTitle", course.courseName);
      setValue("courseShortDesc", course.courseDescription);
      setValue("coursePrice", course.price);
      setValue("courseTags", course.tag);
      setValue("courseBenefits", course.whatYouWillLearn);
      setValue("courseCategory", course.category);
      setValue("courseRequirements", course.instructions);
      setValue("courseImage", course.thumbnail);
    }

    getCategories();
  }, []);

  // Form güncellenmiş mi kontrol et
  const isFormUpdated = () => {
    const currentValues = getValues();
    if (
      currentValues.courseTitle !== course.courseName ||
      currentValues.courseShortDesc !== course.courseDescription ||
      currentValues.coursePrice !== course.price ||
      currentValues.courseTags.toString() !== course.tag.toString() ||
      currentValues.courseBenefits !== course.whatYouWillLearn ||
      currentValues.courseCategory._id !== course.category._id ||
      currentValues.courseRequirements.toString() !==
        course.instructions.toString() ||
      currentValues.courseImage !== course.thumbnail
    ) {
      return true;
    }
    return false;
  };

  // Sonraki adıma geçme işlemi
  const onSubmit = async (data) => {
    if (editCourse) {
      if (isFormUpdated()) {
        const currentValues = getValues();
        const formData = new FormData();
        formData.append("courseId", course._id);

        if (currentValues.courseTitle !== course.courseName) {
          formData.append("courseName", data.courseTitle);
        }
        if (currentValues.courseShortDesc !== course.courseDescription) {
          formData.append("courseDescription", data.courseShortDesc);
        }
        if (currentValues.coursePrice !== course.price) {
          formData.append("price", data.coursePrice);
        }
        if (currentValues.courseTags.toString() !== course.tag.toString()) {
          formData.append("tag", JSON.stringify(data.courseTags));
        }
        if (currentValues.courseBenefits !== course.whatYouWillLearn) {
          formData.append("whatYouWillLearn", data.courseBenefits);
        }
        if (currentValues.courseCategory._id !== course.category._id) {
          formData.append("category", data.courseCategory);
        }
        if (
          currentValues.courseRequirements.toString() !==
          course.instructions.toString()
        ) {
          formData.append(
            "instructions",
            JSON.stringify(data.courseRequirements)
          );
        }
        if (currentValues.courseImage !== course.thumbnail) {
          formData.append("thumbnailImage", data.courseImage);
        }

        setLoading(true);
        const result = await editCourseDetails(formData, token);
        setLoading(false);
        if (result) {
          dispatch(setCourse(result));

          if (liveClass) {
            dispatch(setStep(3)); // Canlı kurs ise doğrudan 3. adıma atla.
          } else {
            dispatch(setStep(2));
          }
        }
      } else {
        toast.error("Formda herhangi bir değişiklik yapılmadı.");
      }
      return;
    }

    // İlk kez kurs ekleniyorsa
    const formData = new FormData();
    formData.append("courseName", data.courseTitle);
    formData.append("courseDescription", data.courseShortDesc);
    formData.append("price", data.coursePrice);
    formData.append("tag", JSON.stringify(data.courseTags));
    formData.append("whatYouWillLearn", data.courseBenefits);
    formData.append("category", data.courseCategory);
    formData.append("status", COURSE_STATUS.DRAFT);
    formData.append("instructions", JSON.stringify(data.courseRequirements));
    formData.append("thumbnailImage", data.courseImage);
    formData.append("liveClass", liveClass ? "true" : "false");

    if (liveClass) {
      const daysArray = scheduleDays
        .split(",")
        .map((day) => day.trim())
        .filter((day) => day.length > 0);

      formData.append("scheduleDays", JSON.stringify(daysArray));
      formData.append("scheduleStartTime", scheduleStartTime);
      formData.append("scheduleDuration", String(scheduleDuration));
    }

    setLoading(true);
    const result = await addCourseDetails(formData, token);
    if (result) {
      dispatch(setCourse(result));

      if (liveClass) {
        dispatch(setStep(3)); // Canlı kurs ise doğrudan 3. adıma
      } else {
        dispatch(setStep(2)); // Video kurs ise normal şekilde 2. adıma
      }
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6 "
    >
      {/* Kurs Başlığı */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseTitle">
          Kurs Başlığı <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="courseTitle"
          placeholder="Kurs başlığını girin"
          {...register("courseTitle", { required: true })}
          className="form-style w-full"
        />
        {errors.courseTitle && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Kurs başlığı zorunludur
          </span>
        )}
      </div>

      {/* Kısa Açıklama */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseShortDesc">
          Kısa Açıklama <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="courseShortDesc"
          placeholder="Açıklama girin"
          {...register("courseShortDesc", { required: true })}
          className="form-style resize-x-none min-h-[130px] w-full ] "
        />
        {errors.courseShortDesc && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Kurs açıklaması zorunludur
          </span>
        )}
      </div>

      {/* Fiyat */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="coursePrice">
          Kurs Fiyatı <sup className="text-pink-200">*</sup>
        </label>
        <div className="relative">
          <input
            id="coursePrice"
            placeholder="Kurs fiyatını girin"
            {...register("coursePrice", {
              required: true,
              valueAsNumber: true,
              pattern: {
                value: /^(0|[1-9]\d*)(\.\d+)?$/,
              },
            })}
            className="form-style w-full !pl-12"
          />
          <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400" />
        </div>
        {errors.coursePrice && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Kurs fiyatı zorunludur
          </span>
        )}
      </div>

      {/* Kategori */}
      <div className="flex flex-col space-y-2 ">
        <label className="text-sm text-richblack-5" htmlFor="courseCategory">
          Kurs Kategorisi <sup className="text-pink-200">*</sup>
        </label>
        <select
          {...register("courseCategory", { required: true })}
          defaultValue=""
          id="courseCategory"
          className="form-style w-full cursor-pointer"
        >
          <option value="" disabled>
            Kategori Seçin
          </option>
          {!loading &&
            courseCategories?.map((category, indx) => (
              <option key={indx} value={category?._id}>
                {category?.name}
              </option>
            ))}
        </select>
        {errors.courseCategory && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Kurs kategorisi zorunludur
          </span>
        )}
      </div>

      {/* Kurs Türü */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="liveClass">
          Kurs Türü <sup className="text-pink-200">*</sup>
        </label>
        <select
          id="liveClass"
          value={liveClass}
          onChange={(e) => setLiveClass(e.target.value === "true")}
          className="form-style w-full"
        >
          <option value={false}>Video Kurs</option>
          <option value={true}>Canlı Kurs</option>
        </select>
      </div>

      {/* Canlı Kurs Detayları */}
      {liveClass && (
        <>
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="scheduleDays">
              Günler (örn: ["Pazartesi", "Çarşamba"])
            </label>
            <input
              type="text"
              id="scheduleDays"
              value={scheduleDays}
              onChange={(e) => setScheduleDays(e.target.value)}
              className="form-style w-full"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label
              className="text-sm text-richblack-5"
              htmlFor="scheduleStartTime"
            >
              Başlangıç Saati
            </label>
            <input
              type="time"
              id="scheduleStartTime"
              value={scheduleStartTime}
              onChange={(e) => setScheduleStartTime(e.target.value)}
              className="form-style w-full"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label
              className="text-sm text-richblack-5"
              htmlFor="scheduleDuration"
            >
              Ders Süresi (Saat)
            </label>
            <input
              type="number"
              id="scheduleDuration"
              value={scheduleDuration}
              onChange={(e) => setScheduleDuration(e.target.value)}
              className="form-style w-full"
            />
          </div>
        </>
      )}

      {/* Etiketler */}
      <ChipInput
        label="Etiketler"
        name="courseTags"
        placeholder="Etiketleri girin ve Enter veya Virgül'e basın"
        register={register}
        errors={errors}
        setValue={setValue}
      />

      {/* Kurs Görseli */}
      <Upload
        name="courseImage"
        label="Kurs Küçük Resmi"
        register={register}
        setValue={setValue}
        errors={errors}
        editData={editCourse ? course?.thumbnail : null}
      />

      {/* Öğrenilecekler */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseBenefits">
          Bu kursta neler öğreneceksiniz? <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="courseBenefits"
          placeholder="Kursun faydalarını yazın"
          {...register("courseBenefits", { required: true })}
          className="form-style resize-x-none min-h-[130px] w-full"
        />
        {errors.courseBenefits && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Bu alan zorunludur
          </span>
        )}
      </div>

      {/* Gereksinimler */}
      <RequirementsField
        name="courseRequirements"
        label="Gereksinimler / Talimatlar"
        register={register}
        setValue={setValue}
        errors={errors}
      />

      {/* Butonlar */}
      <div className="flex justify-end gap-x-2">
        {editCourse && (
          <button
            onClick={() => dispatch(setStep(2))}
            disabled={loading}
            className={`flex cursor-pointer items-center gap-x-2 rounded-md py-[8px] px-[20px] font-semibold
        text-richblack-900 bg-richblack-300 hover:bg-richblack-900 hover:text-richblack-300 duration-300`}
          >
            Kaydetmeden Devam Et
          </button>
        )}
        <IconBtn
          disabled={loading}
          text={!editCourse ? "İleri" : "Değişiklikleri Kaydet"}
        >
          <MdNavigateNext />
        </IconBtn>
      </div>
    </form>
  );
}
