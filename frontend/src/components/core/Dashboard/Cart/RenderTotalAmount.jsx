import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { buyCourse } from "../../../../services/operations/studentFeaturesAPI";
import IconBtn from "../../../common/IconBtn";

export default function RenderTotalAmount() {
  const { total, cart } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleBuyCourse = async () => {
    const courses = cart.map((course) => course._id);
    await buyCourse(token, courses, user, navigate, dispatch);
  };

  return (
    <div className="min-w-[280px] rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      {/* Toplam tutar başlığı */}
      <p className="mb-1 text-sm font-medium text-richblack-300">Toplam:</p>

      {/* Tutar */}
      <p className="mb-6 text-3xl font-medium text-yellow-100">₺ {total}</p>

      {/* Satın Al Butonu */}
      <IconBtn
        text="Satın Al"
        onclick={handleBuyCourse}
        customClasses="w-full justify-center"
      />
    </div>
  );
}
