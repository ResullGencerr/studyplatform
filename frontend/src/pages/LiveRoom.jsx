import React, { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { endLiveClassAPI } from "../services/operations/courseDetailsAPI";

const LiveRoom = () => {
  const { courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = JSON.parse(localStorage.getItem("token"));
  const isTeacher = user?.accountType === "Instructor";

  const jitsiContainerRef = useRef(null);
  const jitsiApiRef = useRef(null);

  const jwt = new URLSearchParams(location.search).get("jwt");

  const handleLeave = async () => {
    const redirectPath = isTeacher
      ? "/dashboard/my-courses"
      : "/dashboard/enrolled-courses";

    if (isTeacher) {
      try {
        await endLiveClassAPI(courseId, token);
        toast.success("Canlı yayın kapatıldı.");
      } catch (err) {
        console.error("❌ Yayını kapatırken hata:", err);
        toast.error("Yayını kapatırken hata oluştu.");
      }
    }

    navigate(redirectPath);
  };

  useEffect(() => {
    if (!jwt) {
      toast.error("JWT token bulunamadı.");
      navigate(-1);
      return;
    }

    let decodedUser;
    try {
      const payload = JSON.parse(atob(jwt.split(".")[1]));
      decodedUser = payload.context?.user;
      console.log("🎯 JWT'den gelen kullanıcı:", decodedUser);
    } catch (e) {
      console.error("❌ JWT decode edilemedi:", e);
      toast.error("JWT geçersiz.");
      return;
    }

    const domain = "resulgencer.infy.uk";
    const roomName = courseId;

    const options = {
      roomName,
      parentNode: jitsiContainerRef.current,
      jwt,
      width: "100%",
      height: "100%",
      configOverwrite: {
        disableInviteFunctions: true,
        startWithAudioMuted: !decodedUser?.moderator,
        startWithVideoMuted: !decodedUser?.moderator,
        closePageEnabled: false,
        toolbarButtons: decodedUser?.moderator
          ? [
              "microphone",
              "camera",
              "desktop",
              "fullscreen",
              "chat",
              "raisehand",
              "tileview",
              "hangup",
            ]
          : ["microphone", "camera", "chat", "raisehand", "tileview", "hangup"],
      },
      userInfo: {
        displayName: decodedUser?.name || "Katılımcı",
        email: decodedUser?.email || "",
      },
    };

    const api = new window.JitsiMeetExternalAPI(domain, options);
    jitsiApiRef.current = api;

    api.addEventListener("hangup", () => {
      jitsiApiRef.current?.dispose();
      handleLeave();
    });

    api.addEventListener("readyToClose", () => {
      jitsiApiRef.current?.dispose();
      handleLeave();
    });

    return () => {
      jitsiApiRef.current?.dispose();
    };
  }, [jwt]);

  return (
    <div style={{ width: "100vw", height: "100vh", backgroundColor: "#000" }}>
      <div
        ref={jitsiContainerRef}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          inset: 0,
        }}
      />
    </div>
  );
};

export default LiveRoom;
