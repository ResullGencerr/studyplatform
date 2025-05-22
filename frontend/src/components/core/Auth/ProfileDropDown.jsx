import { useRef, useState } from "react";
import { AiOutlineCaretDown } from "react-icons/ai";
import { VscDashboard, VscSignOut } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import useOnClickOutside from "../../../hooks/useOnClickOutside";
import { logout } from "../../../services/operations/authAPI";
import Img from "./../../common/Img";

export default function ProfileDropdown() {
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useOnClickOutside(ref, () => setOpen(false));

  if (!user) return null;

  return (
    <div className="relative hidden sm:flex" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-x-1"
      >
        <Img
          src={user?.image}
          alt={`profile-${user?.firstName}`}
          className="aspect-square w-[32px] rounded-full object-cover ring-2 ring-richblack-600"
        />
        <AiOutlineCaretDown className="text-sm text-richblack-100" />
      </button>

      {open && (
        <div
          className="absolute top-full left-1/2 z-[1000] w-[160px] mt-2 -translate-x-1/2 rounded-md border border-richblack-700 bg-richblack-800 shadow-lg"

          onClick={(e) => e.stopPropagation()}
        >
          <Link to="/dashboard/my-profile" onClick={() => setOpen(false)}>
            <div className="flex items-center gap-2 px-4 py-3 text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25 transition-colors">
              <VscDashboard className="text-lg" />
              Panel
            </div>
          </Link>
          <div
            onClick={() => {
              dispatch(logout(navigate));
              setOpen(false);
            }}
            className="flex items-center gap-2 px-4 py-3 text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25 transition-colors cursor-pointer"
          >
            <VscSignOut className="text-lg" />
            Çıkış Yap
          </div>
        </div>
      )}
    </div>
  );
}
