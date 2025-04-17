import React from "react";

import Footer from "../components/common/Footer";
import ContactDetails from "../components/core/ContactPage/ContactDetails";
import ContactForm from "../components/core/ContactPage/ContactForm";
import ReviewSlider from "./../components/common/ReviewSlider";

const Contact = () => {
  return (
    <div>
      <div className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white lg:flex-row">
        {/* İletişim Bilgileri */}
        <div className="lg:w-[40%]">
          <ContactDetails />
        </div>

        {/* İletişim Formu */}
        <div className="lg:w-[60%]">
          <ContactForm />
        </div>
      </div>

      {/* Diğer Öğrencilerden Gelen Yorumlar */}
      <div className=" my-20 px-5 text-white ">
        <h1 className="text-center text-4xl font-semibold mt-8">
          Diğer Öğrencilerden Yorumlar
        </h1>
        <ReviewSlider />
      </div>

      {/* Alt Bilgi */}
      <Footer />
    </div>
  );
};

export default Contact;
