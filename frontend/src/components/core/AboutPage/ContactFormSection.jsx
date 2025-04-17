import React from "react";
import ContactUsForm from "../ContactPage/ContactUsForm";

const ContactFormSection = () => {
  return (
    <div className="mx-auto">
      <h1 className="text-center text-4xl font-semibold">İletişime Geçin</h1>
      <p className="text-center text-richblack-300 mt-3">
        Sizden haber almak isteriz, lütfen bu formu doldurun.
      </p>

      <div className="mt-12 mx-auto">
        <ContactUsForm />
      </div>
    </div>
  );
};

export default ContactFormSection;
