import ChangeProfilePicture from "./ChangeProfilePicture";
import DeleteAccount from "./DeleteAccount";
import EditProfile from "./EditProfile";
import UpdatePassword from "./UpdatePassword";

export default function Settings() {
  return (
    <>
      <h1 className="mb-14 text-3xl font-medium text-richblack-5 font-boogaloo text-center sm:text-left">
        Profili Düzenle
      </h1>
      {/* Profil Resmini Değiştir */}
      <ChangeProfilePicture />
      {/* Profili Düzenle */}
      <EditProfile />
      {/* Şifre Güncelle */}
      <UpdatePassword />
      {/* Hesabı Sil */}
      <DeleteAccount />
    </>
  );
}
