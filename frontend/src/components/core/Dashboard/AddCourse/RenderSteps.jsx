import React from "react";
import { FaCheck } from "react-icons/fa";
import { useSelector } from "react-redux";

import CourseBuilderForm from "./CourseBuilder/CourseBuilderForm";
import CourseInformationForm from "./CourseInformation/CourseInformationForm";
import PublishCourse from "./PublishCourse";
import EditCourse from "./../EditCourse/EditCourse";

export default function RenderSteps() {
  const { step } = useSelector((state) => state.course);
  const { editCourse } = useSelector((state) => state.course);

  const steps = [
    {
      id: 1,
      title: "Kurs Bilgileri",
    },
    {
      id: 2,
      title: "Kurs Oluşturucu",
    },
    {
      id: 3,
      title: "Yayınla",
    },
  ];

  return (
    <>
      {/* Adım göstergesi daireler */}
      <div className="relative mb-2 flex w-full select-none justify-center ">
        {steps.map((item) => (
          <React.Fragment key={item.id}>
            <div className="flex flex-col items-center">
              <div
                className={`grid aspect-square w-[34px] place-items-center rounded-full border-[1px]
                  ${
                    step === item.id
                      ? "border-yellow-50 bg-yellow-900 text-yellow-50"
                      : "border-richblack-700 bg-richblack-800 text-richblack-300"
                  }
                  ${step > item.id && "bg-yellow-50 text-yellow-50"}`}
              >
                {step > item.id ? (
                  <FaCheck className="font-bold text-richblack-900" />
                ) : (
                  item.id
                )}
              </div>
            </div>

            {/* Adımlar arası kesikli çizgiler */}
            {item.id !== steps.length && (
              <div
                className={`h-[calc(34px/2)] w-[33%] border-dashed border-b-2 ${
                  step > item.id ? "border-yellow-50" : "border-richblack-500"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Adım başlıkları */}
      <div className="relative mb-16 flex w-full select-none justify-between">
        {steps.map((item) => (
          <div
            className={`sm:min-w-[130px] flex flex-col items-center gap-y-2 ${
              editCourse && "sm:min-w-[270px]"
            }`}
            key={item.id}
          >
            <p
              className={`text-sm ${
                step >= item.id ? "text-richblack-5" : "text-richblack-500"
              }`}
            >
              {item.title}
            </p>
          </div>
        ))}
      </div>

      {/* Aktif adıma göre form bileşeni göster */}
      {step === 1 && <CourseInformationForm />}
      {step === 2 && <CourseBuilderForm />}
      {step === 3 && <PublishCourse />}
    </>
  );
}
