import React from "react";
import { ImGithub, ImLinkedin2 } from "react-icons/im";
import { Link } from "react-router-dom";
import { FooterLink2 } from "../../../data/footer-links";

// Görseller
import StudyNotionLogo from "../../assets/Logo/Logo-Full-Light.png";

// footer verileri
const BottomFooter = [
  "Gizlilik Politikası",
  "Çerez Politikası",
  "Şartlar ve Koşullar",
];
const Resources = [
  "Makaleler",
  "Blog",
  "Özet Sayfası",
  "Kod Alıştırmaları",
  "Dokümantasyon",
  "Projeler",
  "Videolar",
  "Çalışma Alanları",
];
const Plans = ["Ücretli Üyelikler", "Öğrenciler İçin", "Kurumsal Çözümler"];
const Community = ["Forumlar", "Topluluklar", "Etkinlikler"];

const Footer = () => {
  return (
    <div className="bg-richblack-800 mx-7 rounded-3xl mb-10">
      <div className="flex lg:flex-row gap-8 items-center justify-between w-11/12 max-w-maxContent text-richblack-400 leading-6 mx-auto relative py-14">
        <div className="border-b w-[100%] flex flex-col lg:flex-row pb-5 border-richblack-700">
          {/* Bölüm 1 */}
          <div className="lg:w-[50%] flex flex-wrap flex-row justify-between lg:border-r lg:border-richblack-700 pl-3 lg:pr-5 gap-3">
            <div className="w-[30%] flex flex-col gap-3 lg:w-[30%] mb-7 lg:pl-0">
              <img src={StudyNotionLogo} alt="" className="object-contain" />
              <h1 className="text-richblack-50 font-semibold text-[16px]">
                Şirket
              </h1>
              <div className="flex flex-col gap-2">
                {["Hakkımızda", "Kariyer", "İş Ortaklığı"].map((ele, i) => {
                  return (
                    <div
                      key={i}
                      className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                    >
                      <Link to={ele.toLowerCase()}>{ele}</Link>
                    </div>
                  );
                })}
              </div>
              {/* sosyal ikonlar */}
              <div className="flex gap-3 text-lg duration-200">
                {/* Facebook */}
                <svg
                  className="w-5 cursor-pointer hover:scale-95 "
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  id="facebook"
                >
                  <path
                    fill="#1976D2"
                    d="M14 0H2C.897 0 0 .897 0 2v12c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V2c0-1.103-.897-2-2-2z"
                  ></path>
                  <path
                    fill="#FAFAFA"
                    fillRule="evenodd"
                    d="M13.5 8H11V6c0-.552.448-.5 1-.5h1V3h-2a3 3 0 0 0-3 3v2H6v2.5h2V16h3v-5.5h1.5l1-2.5z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                {/* Google */}
                <svg
                  className="w-5 cursor-pointer hover:scale-95 "
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  id="google"
                >
                  <path fill="#fbbb00" d="M113.47 309.408..."></path>
                </svg>
                {/* Twitter */}
                <svg
                  className="w-5 cursor-pointer hover:scale-95"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 126.24 102.59"
                  id="twitter"
                >
                  <path fill="#1da1f2" d="M40.58..."></path>
                </svg>
                {/* YouTube */}
                <svg
                  className="w-5 cursor-pointer hover:scale-95"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  id="youtube"
                >
                  <g fillRule="evenodd" clipRule="evenodd">
                    <path fill="#F44336" d="M15.32..."></path>
                    <path fill="#FAFAFA" d="M6 11.5v-6l5 3z"></path>
                  </g>
                </svg>
              </div>
            </div>

            <div className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
              <h1 className="text-richblack-50 font-semibold text-[16px]">
                Kaynaklar
              </h1>
              <div className="flex flex-col gap-2 mt-2">
                {Resources.map((ele, index) => (
                  <div
                    key={index}
                    className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                  >
                    <Link to={ele.split(" ").join("-").toLowerCase()}>
                      {ele}
                    </Link>
                  </div>
                ))}
              </div>

              <h1 className="text-richblack-50 font-semibold text-[16px] mt-7">
                Destek
              </h1>
              <div className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200 mt-2">
                <Link to={"/help-center"}>Yardım Merkezi</Link>
              </div>
            </div>

            <div className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
              <h1 className="text-richblack-50 font-semibold text-[16px]">
                Planlar
              </h1>
              <div className="flex flex-col gap-2 mt-2">
                {Plans.map((ele, index) => (
                  <div
                    key={index}
                    className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                  >
                    <Link to={ele.split(" ").join("-").toLowerCase()}>
                      {ele}
                    </Link>
                  </div>
                ))}
              </div>

              <h1 className="text-richblack-50 font-semibold text-[16px] mt-7">
                Topluluk
              </h1>
              <div className="flex flex-col gap-2 mt-2">
                {Community.map((ele, index) => (
                  <div
                    key={index}
                    className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                  >
                    <Link to={ele.split(" ").join("-").toLowerCase()}>
                      {ele}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bölüm 2 */}
          <div className="lg:w-[50%] flex flex-wrap flex-row justify-between pl-3 lg:pl-5 gap-3">
            {FooterLink2.map((ele, i) => (
              <div key={i} className="w-[35%] lg:w-[30%] mb-7 lg:pl-0">
                <h1 className="text-richblack-50 font-semibold text-[16px]">
                  {ele.title}
                </h1>
                <div className="flex flex-col gap-2 mt-2">
                  {ele.links.map((link, index) => (
                    <div
                      key={index}
                      className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                    >
                      <Link to={link.link}>{link.title}</Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alt Footer */}
      <div className="flex flex-row items-center justify-between w-11/12 max-w-maxContent text-richblack-400 mx-auto pb-14 text-sm">
        <div className="flex justify-between lg:items-start items-center flex-col lg:flex-row gap-3 w-full">
          <div className="flex">
            {BottomFooter.map((ele, ind) => (
              <div
                key={ind}
                className={` ${
                  BottomFooter.length - 1 === ind
                    ? ""
                    : "border-r border-richblack-700"
                } px-3 cursor-pointer hover:text-richblack-50 transition-all duration-200`}
              >
                <Link to={ele.split(" ").join("-").toLocaleLowerCase()}>
                  {ele}
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center flex flex-col sm:flex-row ">
            <div className="flex">
              <span> Sevgiyle yapıldı ❤️ </span>
              <Link
                to="https://github.com/Aniruddha-Gade"
                target="__blank"
                className="text-white hover:underline mr-1"
              >
                Aniruddha Gade
              </Link>
            </div>
            <span> © 2023 Studynotion</span>
          </div>

          <div className="flex items-center">
            <a
              href="https://www.linkedin.com/in/aniruddha-gade-a48800231/"
              className="text-white p-3 hover:bg-richblack-700 rounded-full duration-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ImLinkedin2 size={17} />
            </a>
            <a
              href="https://www.github.com/Aniruddha-Gade"
              className="text-white p-3 hover:bg-richblack-700 rounded-full duration-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ImGithub size={17} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
