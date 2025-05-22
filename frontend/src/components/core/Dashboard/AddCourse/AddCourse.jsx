import { useEffect } from "react";
import RenderSteps from "./RenderSteps";

export default function AddCourse() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex w-full items-start gap-x-6">
      <div className="flex flex-1 flex-col">
        <h1 className="mb-14 text-3xl font-medium text-richblack-5 font-boogaloo text-center lg:text-left">
          Kurs Ekle
        </h1>

        <div className="flex-1">
          <RenderSteps />
        </div>
      </div>

      {/* Kurs Yükleme İpuçları */}
      <div className="sticky top-10 hidden lg:block max-w-[400px] flex-1 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
        <p className="mb-8 text-lg text-richblack-5">
          ⚡ Kurs Yükleme İpuçları
        </p>

        <ul className="ml-5 list-item list-disc space-y-4 text-xs text-richblack-5">
          <li>Kurs fiyatını belirleyin veya ücretsiz yapın.</li>
          <li>Kurs küçük resmi için standart boyut 1024x576’dır.</li>
          <li>Video bölümü, kurs tanıtım videosunu içerir.</li>
          <li>Kurs Oluşturucu, dersi oluşturduğun ve düzenlediğin yerdir.</li>
          <li>
            Kurs Oluşturucu’da konular ekleyerek dersler, sınavlar ve ödevler
            oluşturabilirsiniz.
          </li>
          <li>
            Ek Bilgiler kısmındaki bilgiler, kursun detay sayfasında gösterilir.
          </li>
          <li>Duyurular yaparak önemli bilgileri paylaşabilirsiniz.</li>
          <li>Tüm kayıtlı öğrencilere notlar gönderebilirsiniz.</li>
        </ul>
      </div>
    </div>
  );
}
