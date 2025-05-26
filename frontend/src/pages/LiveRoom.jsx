import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { endLiveClassAPI } from "../services/operations/courseDetailsAPI";
import socket from "../services/socket/socket";
import { checkSessionValid, logout } from "../services/operations/authAPI";
import { toast } from "react-hot-toast";
import rootReducer  from "../reducer/index";

const LiveRoom = () => {
  const containerRef = useRef(null);
  const { roomId } = useParams();
  const { state } = useLocation();
  const jitsiToken = state?.jitsiToken;
  const navigate = useNavigate();
  const userToken = useSelector((state) => state.auth.token);


  useEffect(() => {
    if (!jitsiToken || !roomId) {
      alert("Oda bilgisi ya da token eksik.");
      navigate("/dashboard/my-profile");
      return;
    }

    let api;

    const verifySession = async () => {
      const isValid = await checkSessionValid(userToken);

      if (!isValid) {
        toast.error("Oturum başka bir cihazda açıldı. Dersten atıldınız.");

        if (api) {
          api.executeCommand("hangup");
          api.dispose();
        }

        rootReducer.dispatch(logout(() => navigate("/")));
        return;
      }
    };

    verifySession();

    const domain = import.meta.env.VITE_JITSI_DOMAIN;
    let isModerator = false;
    let displayName = "Kullanıcı";

    try {
      const decoded = jwtDecode(jitsiToken);
      isModerator = decoded?.moderator === true;
      displayName = decoded?.context?.user?.name || "Kullanıcı";
    } catch (err) {
      console.error("❌ Token decode hatası:", err);
    }

    const options = {
      roomName: roomId,
      parentNode: containerRef.current,
      jwt: jitsiToken,
      width: "100%",
      height: "100%",
      enableUserRolesBasedOnToken: true,
      userInfo: {
        displayName,
      },
      configOverwrite: {
        startWithAudioMuted: true,
        startWithVideoMuted: true,
        disableInviteFunctions: true,
        enableWelcomePage: false,
        enableClosePage: false,
      },
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: isModerator
          ? ["microphone", "camera", "desktop","chat", "livestreaming", "recording", "tileview", "hangup"]
          : ["microphone", "camera", "chat", "tileview", "raisehand", "hangup"],
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        SHOW_BRAND_WATERMARK: false,
      },
    };

    api = new window.JitsiMeetExternalAPI(domain, options);
    window.api = api;

    socket.emit("JOIN_LIVE_ROOM", { roomId });

    socket.on("LIVE_CLASS_ENDED", () => {
      api.dispose();
      alert("Ders sona erdi.");
      navigate("/dashboard/my-profile");
    });

    api.addEventListener("readyToClose", () => {
      api.dispose();
      navigate("/dashboard/my-profile");
    });

    api.addEventListener("videoConferenceLeft", async () => {
      if (isModerator && userToken) {
        try {
          const courseId = roomId.replace("course-", "");
          const res = await endLiveClassAPI(courseId, userToken);
          if (res?.message) {
            socket.emit("END_LIVE_CLASS", { roomId });
          }
        } catch (err) {
          console.error("❌ Dersi bitirme hatası:", err);
        }
      }
      navigate("/dashboard/my-profile");
    });

    return () => {
      api.dispose();
      socket.off("LIVE_CLASS_ENDED");
    };
  }, [roomId, jitsiToken, navigate, userToken]);

 
  return (
    <div className="relative h-screen w-screen">
      <div ref={containerRef} className="h-full w-full" />
    
    </div>
  );
};

export default LiveRoom;
