"use client";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import styles from "./Sidebar.module.css";

import {
  LayoutGrid,
  Notebook,
  Settings,
  Users2,
  LogOut,
  ShoppingCart,
  FolderPlus,
  SquarePen,
  TicketPercent,
  ShoppingBasket,
  Mail,
  Calendar,
  CalendarDays,
  Video,
} from "lucide-react";

import { useRouter } from "next/router";

export default function Sidebar() {
  const router = useRouter();
  const pathname = router.pathname;
  const { data: session, status } = useSession();

  const sildebarLinks = [
    {
      title: "Bài viết",
      icon: Notebook,
      href: "/dashboard/bai-viet",
    },
    {
      title: "Thêm bài viết",
      icon: SquarePen,
      href: "/dashboard/them-bai-viet",
    },
  
    {
      title: "Khóa học",
      icon: ShoppingCart,
      href: "/dashboard/khoa-hoc",
    },
    {
      title: "Thêm khóa học",
      icon: FolderPlus,
      href: "/dashboard/them-khoa-hoc",
    },
    {
      title: "Lịch khai giảng",
      icon: Calendar,
      href: "/dashboard/lich-khai-giang",
    },
    {
      title: "Lịch học",
      icon: CalendarDays,
      href: "/dashboard/lich-hoc-hang-ngay",
    },
    
    {
      title: "Quản lý học viên",
      icon: Users2,
      href: "/dashboard/quan-ly-hoc-vien",
    },
    {
      title: "Thêm học viên",
      icon: Users2,
      href: "/dashboard/them-hoc-vien",
    },
  
    {
      title: "Email đăng ký",
      icon: Mail,
      href: "/dashboard/danh-sach-email",
    },
    {
      title: "Quản lý Video",
      icon: Video,
      href: "/dashboard/video",
    },

    {
      title: "Cài đặt",
      icon: Settings,
      href: "/dashboard/cai-dat",
    },
  ];

  const catalogueLinks = [

  

  ];
  const [openMenu, setOpenMenu] = useState(false);

  // Hàm xử lý đăng xuất
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  // Nếu đang tải trạng thái phiên, hiển thị loading
  if (status === "loading") {
    return <div className={styles.loadingContainer}>Đang tải...</div>;
  }

  return (
    <div className={styles.sidebar}>
      <Link 
        className={styles.logoContainer} 
        href="/"
      >
        <Image height={120} width={120} alt="avatar" src="/logoqkbacgiang.png" />
      </Link>

      <div className={styles.navContainer}>
        <Link
          href="/dashboard"
          className={`${styles.navLink} ${
            pathname === "/dashboard" ? styles.active : ""
          }`}
        >
          <LayoutGrid />
          <span>DashBoard</span>
        </Link>

        {sildebarLinks.map((item, i) => {
          const Icon = item.icon;
          return (
            <Link
              href={item.href}
              key={i}
              className={`${styles.navLink} ${
                item.href === pathname ? styles.active : ""
              }`}
            >
              <Icon />
              <span>{item.title}</span>
            </Link>
          );
        })}

        {/* Hiển thị nút Đăng xuất chỉ khi người dùng đã đăng nhập */}
        {session && (
          <div className={styles.logoutContainer}>
            <button
              onClick={handleSignOut}
              className={styles.logoutButton}
            >
              <LogOut />
              <span>Đăng xuất</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}