import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { deleteProfile } from "../../../../services/operations/SettingsAPI";
import ConfirmationModal from "./../../../common/ConfirmationModal";

export default function DeleteAccount() {
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [check, setCheck] = useState(false);

  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <>
      <div className="my-10 flex flex-row gap-x-5 rounded-md border-[1px] border-pink-700 bg-pink-900 p-8 px-6 sm:px-12">
        <div className="flex aspect-square h-14 w-14 items-center justify-center rounded-full bg-pink-700">
          <FiTrash2 className="text-3xl text-pink-200" />
        </div>

        <div className="flex flex-col ">
          <h2 className="text-lg font-semibold text-richblack-5 ">
            {" "}
            Hesabı Sil
          </h2>

          <div className="sm:w-3/5 text-pink-25 flex flex-col gap-3 mt-1">
            <p>Hesabınızı silmek istiyor musunuz?</p>
            <p>
              Bu hesapta satın alınmış kurslar bulunabilir. Hesabınızı silmeniz
              kalıcıdır ve hesaba ait tüm içerikler tamamen kaldırılır.
            </p>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4 text-indigo-600 rounded-full form-style cursor-pointer"
              checked={check}
              onChange={() => setCheck((prev) => !prev)}
            />

            <button
              type="button"
              className="w-fit italic text-pink-300"
              onClick={() =>
                check &&
                setConfirmationModal({
                  text1: "Emin misiniz?",
                  text2: "Hesabımı sil!",
                  btn1Text: "Sil",
                  btn2Text: "İptal",
                  btn1Handler: () => dispatch(deleteProfile(token, navigate)),
                  btn2Handler: () => {
                    setConfirmationModal(null);
                    setCheck(false);
                  },
                })
              }
            >
              Hesabımı silmek istiyorum.
            </button>
          </div>
        </div>
      </div>

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
}
