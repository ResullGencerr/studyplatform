import React, { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { io } from "socket.io-client";
import Loading from "../components/common/Loading";
import Sidebar from "../components/core/Dashboard/Sidebar";

const socket = io("http://localhost:5000"); // BACKEND SOCKET ADRESİN

const Dashboard = () => {
  const { loading: authLoading } = useSelector((state) => state.auth);
  const { loading: profileLoading, user } = useSelector(
    (state) => state.profile
  ); // ✅ user burada çekildi

  // Yüklenme durumunda spinner göster
  if (profileLoading || authLoading) {
    return (
      <div className="mt-10">
        <Loading />
      </div>
    );
  }

  // Sayfa yüklendiğinde en üste kaydır
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 🔴 Canlı ders bildirimi socket listener
  useEffect(() => {
    if (!user || user.accountType !== "Student") {
      console.log("🚫 Kullanıcı öğrenci değil ya da tanımsız.");
      return;
    }

    const socket = io("http://localhost:5000");

    socket.on("live-class-started", ({ courseId, title, teacher, link }) => {
      console.log("📥 Bildirim geldi:", courseId, title);
      console.log("👤 user.courses:", user.courses);

      const isEnrolled = user.courses?.includes(courseId);
      console.log("✅ isEnrolled:", isEnrolled);

      if (!isEnrolled) {
        console.log("⛔ Bu öğrenci bu dersi almıyor");
        return;
      }

      toast.success(`📢 ${title} dersi başladı! (${teacher})`, {
        duration: 5000,
        position: "top-center",
      });
    });

    return () => {
      socket.off("live-class-started");
    };
  }, [user]);

  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)] ">
      {/* Kenar menüsü */}
      <Sidebar />

      {/* İçerik alanı */}
      <div className="h-[calc(100vh-3.5rem)] overflow-auto w-full">
        <div className="mx-auto w-11/12 max-w-[1000px] py-10 ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
