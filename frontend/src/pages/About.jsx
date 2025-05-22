import React from "react";

import FoundingStory from "../assets/Images/FoundingStory.png";
import BannerImage1 from "../assets/Images/aboutus1.webp";
import BannerImage2 from "../assets/Images/aboutus2.webp";
import BannerImage3 from "../assets/Images/aboutus3.webp";

import Footer from "../components/common/Footer";
import ContactFormSection from "../components/core/AboutPage/ContactFormSection";
import LearningGrid from "../components/core/AboutPage/LearningGrid";
import Quote from "../components/core/AboutPage/Quote";
import StatsComponenet from "../components/core/AboutPage/Stats";
import HighlightText from "../components/core/HomePage/HighlightText";
import Img from "../components/common/Img";
import ReviewSlider from "./../components/common/ReviewSlider";

import { motion } from "framer-motion";
import { fadeIn } from "../components/common/motionFrameVarients";

const About = () => {
  return (
    <div>
      <section className="bg-richblack-700">
        <div className="relative mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-center text-white">
          <motion.header className="mx-auto py-20 text-4xl font-semibold lg:w-[70%]">
            <motion.p
              variants={fadeIn("down", 0.1)}
              initial="hidden"
              whileInView={"show"}
              viewport={{ once: false, amount: 0.1 }}
            >
              Online Eğitimde Yeniliğe Yön Veriyoruz:
              <HighlightText text={"Daha Aydınlık Bir Gelecek İçin"} />
            </motion.p>

            <motion.p
              variants={fadeIn("up", 0.1)}
              initial="hidden"
              whileInView={"show"}
              viewport={{ once: false, amount: 0.1 }}
              className="mx-auto mt-3 text-center text-base font-medium text-richblack-300 lg:w-[95%]"
            >
              Studynotion, online eğitimde yeniliklerin öncüsüdür. En yeni
              teknolojilerle desteklenen ileri düzey kurslar sunarak ve canlı
              bir öğrenme topluluğu oluşturarak daha aydınlık bir gelecek için
              çalışıyoruz.
            </motion.p>
          </motion.header>

          <div className="sm:h-[70px] lg:h-[150px]"></div>

          <div className="absolute bottom-0 left-[50%] grid w-[100%] translate-x-[-50%] translate-y-[30%] grid-cols-3 gap-3 lg:gap-5">
            <Img src={BannerImage1} alt="" />
            <Img src={BannerImage2} alt="" />
            <Img src={BannerImage3} alt="" />
          </div>
        </div>
      </section>

      <section className="border-b border-richblack-700">
        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-richblack-500">
          <div className="h-[100px] "></div>
          <Quote />
        </div>
      </section>

      <section>
        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-richblack-500">
          <div className="flex flex-col items-center gap-10 lg:flex-row justify-between">
            <motion.div
              variants={fadeIn("right", 0.1)}
              initial="hidden"
              whileInView={"show"}
              viewport={{ once: false, amount: 0.1 }}
              className="my-24 flex lg:w-[50%] flex-col gap-10"
            >
              <h1 className="bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%]">
                Kuruluş Hikayemiz
              </h1>
              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                E-öğrenme platformumuz, eğitimi dönüştürme vizyonu ve tutkusuyla
                doğdu. Eğitimciler, teknoloji uzmanları ve ömür boyu öğrenmeye
                inananlardan oluşan bir ekip olarak, hızla değişen dijital
                dünyada erişilebilir, esnek ve kaliteli öğrenme fırsatlarına
                ihtiyaç olduğunu fark ettik.
              </p>
              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                Deneyimli eğitimciler olarak geleneksel eğitim sistemlerinin
                kısıtlarını bizzat yaşadık. Eğitimin sınıf duvarlarıyla veya
                coğrafi sınırlarla sınırlanmaması gerektiğine inanıyorduk.
                Herkesin potansiyelini keşfetmesini sağlayacak bir platform
                hayal ettik.
              </p>
            </motion.div>

            <motion.div
              variants={fadeIn("left", 0.1)}
              initial="hidden"
              whileInView={"show"}
              viewport={{ once: false, amount: 0.1 }}
            >
              <Img
                src={FoundingStory}
                alt="Kuruluş Hikayesi"
                className="shadow-[0_0_20px_0] shadow-[#FC6767]"
              />
            </motion.div>
          </div>

          <div className="flex flex-col items-center lg:gap-10 lg:flex-row justify-between">
            <div className="my-24 flex lg:w-[40%] flex-col gap-10">
              <h1 className="bg-gradient-to-b from-[#FF512F] to-[#F09819] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%]">
                Vizyonumuz
              </h1>
              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                Bu vizyonla yola çıkarak, insanların öğrenme şeklini devrim
                niteliğinde değiştirecek bir e-öğrenme platformu oluşturmak
                istedik. Ekibimiz, ileri teknolojileri etkili içerikle
                birleştirerek dinamik ve etkileşimli bir öğrenme deneyimi sunmak
                için gece gündüz çalıştı.
              </p>
            </div>

            <div className="my-24 flex lg:w-[40%] flex-col gap-10">
              <h1 className="bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-transparent bg-clip-text text-4xl font-semibold lg:w-[70%]">
                Misyonumuz
              </h1>
              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                Misyonumuz sadece online kurslar sunmakla sınırlı değil.
                Bireylerin birbirleriyle bağlantı kurabileceği, iş birliği
                yapabileceği ve birlikte öğrenebileceği canlı bir öğrenme
                topluluğu oluşturmak istiyoruz. Bilginin paylaşım ve diyalog
                ortamında geliştiğine inanıyor, bu ruhu forumlar, canlı
                oturumlar ve ağ oluşturma fırsatlarıyla destekliyoruz.
              </p>
            </div>
          </div>
        </div>
      </section>

      <StatsComponenet />

      <section className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white">
        <LearningGrid />
        <ContactFormSection />
      </section>

      {/* Diğer öğrencilerden gelen yorumlar */}
      <div className=" my-20 px-5 text-white ">
        <h1 className="text-center text-4xl font-semibold mt-8">
          Diğer Öğrencilerden Yorumlar
        </h1>
        <ReviewSlider />
      </div>

      <Footer />
    </div>
  );
};

export default About;
