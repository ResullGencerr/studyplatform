import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import Footer from "../components/common/Footer";
import ReviewSlider from "../components/common/ReviewSlider";
import Course_Slider from "../components/core/Catalog/Course_Slider";
import CTAButton from "../components/core/HomePage/Button";
import CodeBlocks from "../components/core/HomePage/CodeBlocks";
import ExploreMore from "../components/core/HomePage/ExploreMore";
import HighlightText from "../components/core/HomePage/HighlightText";
import InstructorSection from "../components/core/HomePage/InstructorSection";
import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection";
import TimelineSection from "../components/core/HomePage/TimelineSection";

import { getCatalogPageData } from "../services/operations/pageAndComponentData";

import { FaArrowRight } from "react-icons/fa";
import { MdOutlineRateReview } from "react-icons/md";

import { motion } from "framer-motion";
import { fadeIn } from "./../components/common/motionFrameVarients";

import backgroundImg1 from "../assets/Images/random bg img/coding bg1.jpg";
import backgroundImg10 from "../assets/Images/random bg img/coding bg10.jpg";
import backgroundImg111 from "../assets/Images/random bg img/coding bg11.jpg";
import backgroundImg2 from "../assets/Images/random bg img/coding bg2.jpg";
import backgroundImg3 from "../assets/Images/random bg img/coding bg3.jpg";
import backgroundImg4 from "../assets/Images/random bg img/coding bg4.jpg";
import backgroundImg5 from "../assets/Images/random bg img/coding bg5.jpg";
import backgroundImg6 from "../assets/Images/random bg img/coding bg6.jpeg";
import backgroundImg7 from "../assets/Images/random bg img/coding bg7.jpg";
import backgroundImg8 from "../assets/Images/random bg img/coding bg8.jpeg";
import backgroundImg9 from "../assets/Images/random bg img/coding bg9.jpg";

const randomImges = [
  backgroundImg1,
  backgroundImg2,
  backgroundImg3,
  backgroundImg4,
  backgroundImg5,
  backgroundImg6,
  backgroundImg7,
  backgroundImg8,
  backgroundImg9,
  backgroundImg10,
  backgroundImg111,
];

const Home = () => {
  const [backgroundImg, setBackgroundImg] = useState(null);
  const [CatalogPageData, setCatalogPageData] = useState(null);
  const categoryID = "67f6c7cd862d43627855324c";
  const dispatch = useDispatch();

  useEffect(() => {
    const bg = randomImges[Math.floor(Math.random() * randomImges.length)];
    setBackgroundImg(bg);
  }, []);

  useEffect(() => {
    const fetchCatalogPageData = async () => {
      const result = await getCatalogPageData(categoryID);
      console.log("Fetched Catalog Page Data:", result);
      setCatalogPageData(result);
    };
    if (categoryID) {
      fetchCatalogPageData();
    }
  }, [categoryID]);

  return (
    <React.Fragment>
      <div>
        <div className="w-full h-[450px] md:h-[650px] absolute top-0 left-0 opacity-[0.3] overflow-hidden object-cover ">
          <img
            src={backgroundImg}
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute left-0 bottom-0 w-full h-[250px] opacity_layer_bg "></div>
        </div>
      </div>

      <div className=" ">
        <div className="relative h-[450px] md:h-[550px] justify-center mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white ">
          <Link to={"/signup"}>
            <div className="z-0 group p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit">
              <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900">
                <p>Eğitmen Ol</p>
                <FaArrowRight />
              </div>
            </div>
          </Link>

          <motion.div
            variants={fadeIn("left", 0.1)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: false, amount: 0.1 }}
            className="text-center text-3xl lg:text-4xl font-semibold mt-7"
          >
            Geleceğini
            <HighlightText text={" Kodlama Becerileriyle"} />
            Güçlendir
          </motion.div>

          <motion.div
            variants={fadeIn("right", 0.1)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: false, amount: 0.1 }}
            className=" mt-4 w-[90%] text-center text-base lg:text-lg font-bold text-richblack-300"
          >
            Online kodlama kurslarımızla istediğiniz yerden kendi hızınızda
            öğrenin. Gerçek projeler, quizler ve eğitmenlerden bireysel geri
            bildirimlerle öğrenin.
          </motion.div>

          <div className="flex flex-row gap-7 mt-8">
            <CTAButton active={true} linkto={"/signup"}>
              Daha Fazla Bilgi
            </CTAButton>
            <CTAButton active={false} linkto={"/login"}>
              Demo Al
            </CTAButton>
          </div>
        </div>

        <div className="relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white justify-between">
          <CodeBlocks
            position={"lg:flex-row"}
            heading={
              <div className="text-3xl lg:text-4xl font-semibold">
                <HighlightText text={"Kodlama potansiyelinizi"} /> ortaya
                çıkarın
              </div>
            }
            subheading={
              "Kurslarımız, sektörde deneyimli ve bilgilerini paylaşmaktan heyecan duyan uzmanlar tarafından tasarlanmıştır."
            }
            ctabtn1={{ btnText: "Hemen Dene", linkto: "/signup", active: true }}
            ctabtn2={{
              btnText: "Daha Fazla Bilgi",
              linkto: "/login",
              active: false,
            }}
            codeblock={`<html>\n<head><title>Örnek</title></head>\n<body>\n<h1><a href="/">Başlık</a></h1>\n<nav><a href="one/">Bir</a> <a href="two/">İki</a></nav>`}
            codeColor={"text-yellow-25"}
            backgroundGradient={"code-block1-grad"}
          />

          <CodeBlocks
            position={"lg:flex-row-reverse"}
            heading={
              <div className="w-[100%] text-3xl lg:text-4xl font-semibold lg:w-[50%]">
                <HighlightText text={"Saniyeler içinde kodlamaya"} /> başla
              </div>
            }
            subheading={
              "İlk dersten itibaren gerçek kod yazmaya başla. Uygulamalı öğrenme ortamı seni bekliyor."
            }
            ctabtn1={{
              btnText: "Derse Devam Et",
              link: "/signup",
              active: true,
            }}
            ctabtn2={{
              btnText: "Daha Fazla Bilgi",
              link: "/signup",
              active: false,
            }}
            codeColor={"text-white"}
            codeblock={`import React from "react";\nconst Home = () => {\nreturn (<div>Home</div>)}\nexport default Home;`}
            backgroundGradient={"code-block2-grad"}
          />

          <div className="mx-auto box-content w-full max-w-maxContentTab px- py-12 lg:max-w-maxContent">
            <h2 className="text-white mb-6 text-2xl ">
              Senin İçin Popüler Seçimler 🏆
            </h2>
            <Course_Slider
              Courses={CatalogPageData?.selectedCategory?.courses}
            />
          </div>
          <div className="mx-auto box-content w-full max-w-maxContentTab px- py-12 lg:max-w-maxContent">
            <h2 className="text-white mb-6 text-2xl ">
              Bugünün En Çok Kaydolunanları 🔥
            </h2>
            <Course_Slider Courses={CatalogPageData?.mostSellingCourses} />
          </div>

          <ExploreMore />
        </div>

        <div className="bg-pure-greys-5 text-richblack-700 ">
          <div className="homepage_bg h-[310px]">
            <div className="w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-5 mx-auto">
              <div className="h-[150px]"></div>
              <div className="flex flex-row gap-7 text-white ">
                <CTAButton active={true} linkto={"/signup"}>
                  <div className="flex items-center gap-3">
                    Tüm Kataloğu Keşfet
                    <FaArrowRight />
                  </div>
                </CTAButton>
                <CTAButton active={false} linkto={"/signup"}>
                  Daha fazla öğren
                </CTAButton>
              </div>
            </div>
          </div>

          <div className="mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7">
            <div className="flex flex-col lg:flex-row gap-5 mb-10 mt-[95px]">
              <div className="text-3xl lg:text-4xl font-semibold w-full lg:w-[45%]">
                <HighlightText text={"Talep gören işlere"} /> uygun beceriler
                edinin
              </div>

              <div className="flex flex-col gap-10 w-full lg:w-[40%] items-start">
                <div className="text-[16px]">
                  Modern dünya kendi kurallarını koyar. Rekabetçi bir uzman
                  olmak yalnızca teknik becerilerle değil, aynı zamanda çok
                  yönlülükle mümkündür.
                </div>
                <CTAButton active={true} linkto={"/signup"}>
                  Daha fazla öğren
                </CTAButton>
              </div>
            </div>

            <TimelineSection />
            <LearningLanguageSection />
          </div>
        </div>

        <div className="mt-14 w-11/12 mx-auto max-w-maxContent flex-col items-center justify-between gap-8 first-letter bg-richblack-900 text-white">
          <InstructorSection />

          <h1 className="text-center text-3xl lg:text-4xl font-semibold mt-8 flex justify-center items-center gap-x-3">
            Diğer Öğrencilerden Yorumlar{" "}
            <MdOutlineRateReview className="text-yellow-25" />
          </h1>
          <ReviewSlider />
        </div>

        <Footer />
      </div>
    </React.Fragment>
  );
};

export default Home;
