import React from "react";
import HighlightText from "../HomePage/HighlightText";

const Quote = () => {
  return (
    <div className=" text-xl md:text-4xl font-semibold mx-auto py-5 pb-20 text-center text-white">
      Öğrenme biçimimizi dönüştürmeye tutkuyla bağlıyız. Yenilikçi platformumuz{" "}
      <HighlightText text={"teknolojiyi"} />,{" "}
      <span className="bg-gradient-to-b from-[#FF512F] to-[#F09819] text-transparent bg-clip-text font-bold">
        uzmanlık
      </span>{" "}
      ve topluluğu bir araya getirerek
      <span className="bg-gradient-to-b from-[#E65C00] to-[#F9D423] text-transparent bg-clip-text font-bold">
        {" "}
        benzersiz bir eğitim deneyimi
      </span>{" "}
      sunar.
    </div>
  );
};

export default Quote;
