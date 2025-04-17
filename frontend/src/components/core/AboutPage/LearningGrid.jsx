import React from "react";
import CTAButton from "../../../components/core/HomePage/Button";
import HighlightText from "../../../components/core/HomePage/HighlightText";

const LearningGridArray = [
  {
    order: -1,
    heading: "Dünya Standartlarında Eğitim",
    highlightText: "Herkes İçin, Her Yerde",
    description:
      "Studynotion, bireylere ve kurumlara esnek, uygun fiyatlı ve iş dünyasına uygun çevrimiçi eğitimler sunmak için 275'ten fazla lider üniversite ve şirketle iş birliği yapmaktadır.",
    BtnText: "Daha Fazla Bilgi",
    BtnLink: "/",
  },
  {
    order: 1,
    heading: "Sektör İhtiyaçlarına Uygun Müfredat",
    description:
      "Zaman ve paradan tasarruf edin! Belajar müfredatı daha kolay anlaşılabilir ve sektörel ihtiyaçlarla uyumlu olacak şekilde tasarlanmıştır.",
  },
  {
    order: 2,
    heading: "Öğrenme Yöntemlerimiz",
    description:
      "Studynotion, bireylere ve kurumlara kaliteli eğitim sunmak için 275'ten fazla kurumla ortaklık yapmaktadır.",
  },
  {
    order: 3,
    heading: "Sertifikasyon",
    description:
      "Studynotion, bireylere ve kurumlara kaliteli eğitim sunmak için 275'ten fazla kurumla ortaklık yapmaktadır.",
  },
  {
    order: 4,
    heading: `Puanlama "Otomatik Değerlendirme"`,
    description:
      "Studynotion, bireylere ve kurumlara kaliteli eğitim sunmak için 275'ten fazla kurumla ortaklık yapmaktadır.",
  },
  {
    order: 5,
    heading: "İşe Hazır",
    description:
      "Studynotion, bireylere ve kurumlara kaliteli eğitim sunmak için 275'ten fazla kurumla ortaklık yapmaktadır.",
  },
];

const LearningGrid = () => {
  return (
    <div className="grid mx-auto w-[350px] lg:w-fit grid-cols-1 lg:grid-cols-4 mb-12">
      {LearningGridArray.map((card, i) => {
        return (
          <div
            key={i}
            className={`${i === 0 && "lg:col-span-2 lg:h-[294px]"}  ${
              card.order % 2 === 1
                ? "bg-richblack-700 h-[294px]"
                : card.order % 2 === 0
                ? "bg-richblack-800 h-[294px]"
                : "bg-transparent"
            } ${card.order === 3 && "lg:col-start-2"}`}
          >
            {card.order < 0 ? (
              <div className="lg:w-[90%] flex flex-col gap-3 pb-10 lg:pb-0">
                <div className="text-4xl font-semibold ">
                  {card.heading}
                  <HighlightText text={card.highlightText} />
                </div>
                <p className="text-richblack-300 font-medium">
                  {card.description}
                </p>

                <div className="w-fit mt-2">
                  <CTAButton active={true} linkto={card.BtnLink}>
                    {card.BtnText}
                  </CTAButton>
                </div>
              </div>
            ) : (
              <div className="p-8 flex flex-col gap-8">
                <h1 className="text-richblack-5 text-lg">{card.heading}</h1>

                <p className="text-richblack-300 font-medium">
                  {card.description}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LearningGrid;
