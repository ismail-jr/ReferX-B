"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  HelpCircle,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  BadgeCheck,
  TrendingUp,
  Target,
  HandCoins,
} from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

interface UserData {
  milestone?: string;
  points?: number;
  createdAt?: number;
}

interface NavItem {
  path: string;
  name: string;
  icon: React.ReactNode;
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const navItems: NavItem[] = [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: <LayoutDashboard size={18} className="text-white" />,
    },
  ];

  const linkClass = (path: string) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      pathname === path
        ? "bg-blue-900 text-white font-medium"
        : "text-gray-600 hover:bg-gray-50"
    }`;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDocRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data() as UserData);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const points = userData?.points ?? 0;
  const milestone = userData?.milestone ?? "";
  const rewardAmount = (points * 0.5).toFixed(2);
  const goal = 100;
  const progress = Math.min((points / goal) * 100, 100);

  const quoteList = [
    "Great things take time!",
    "Every referral counts!",
    "Keep growing, keep earning",
    "You're one step closer to a reward!",
  ];
  const quote = quoteList[points % quoteList.length];

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="bg-white p-2 rounded-lg shadow border border-gray-300"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X size={20} className="text-blue-900" />
          ) : (
            <Menu size={20} className="text-blue-900" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-10 ml-4 left-0 h-[calc(100vh-2.5rem)] w-64 bg-white rounded-xl p-5 shadow-sm border-r border-gray-100 flex flex-col overflow-y-auto scrollbar-hide z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 pl-2 pt-6">
          <div className="bg-blue-900 p-2 rounded-lg">
            <HandCoins className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-bold text-gray-800">ReferX</h1>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 mb-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={linkClass(item.path)}
              onClick={() => setIsOpen(false)}
            >
              <span className="text-blue-900">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Stats */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-4 text-sm space-y-2">
          <div className="flex justify-between items-center text-gray-700">
            <span>Points</span>
            <span className="font-semibold text-blue-700">{points}</span>
          </div>
          <div className="flex justify-between items-center text-gray-700">
            <span>Rewards</span>
            <span className="font-semibold text-green-600">
              ${rewardAmount}
            </span>
          </div>
          {milestone && (
            <div className="flex justify-between items-center text-gray-700">
              <span>Milestone</span>
              <span className="font-semibold text-blue-600">{milestone}</span>
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <TrendingUp size={14} /> Progress
            </span>
            <span>
              {points}/{goal}
            </span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-900 h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Help + Quote */}
        <div className="mt-auto text-sm border-t py-6">
          <Link
            href="/help"
            className="flex items-center gap-2 text-blue-600 hover:underline mb-3"
          >
            <HelpCircle size={16} /> Need Help?
          </Link>
          <div className="bg-blue-50 text-blue-900 p-3 rounded-lg text-xs italic flex items-center gap-2">
            <Target size={14} /> {quote}
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-blue-900 rounded-xl shadow-sm border border-gray-100">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center justify-between w-full p-4 hover:bg-blue-950 transition-colors rounded-xl"
          >
            <div className="flex items-center gap-3">
              {user?.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="rounded-full object-cover border-2 border-blue-100"
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-sm font-semibold text-blue-700 uppercase border-2 border-blue-100"
                  title={user?.email ?? ""}
                >
                  {user?.email ? (
                    user.email[0].toUpperCase()
                  ) : (
                    <User size={18} className="text-white" />
                  )}
                </div>
              )}
              <div className="flex flex-col text-left">
                <span
                  className="text-sm font-medium text-white truncate max-w-[120px]"
                  title={user?.email ?? ""}
                >
                  {user?.displayName || user?.email || "User"}
                </span>
                {milestone && (
                  <span className="text-xs text-blue-600 font-medium flex items-center gap-1">
                    <BadgeCheck size={14} className="text-blue-500" />{" "}
                    {milestone}
                  </span>
                )}
              </div>
            </div>
            <ChevronDown
              size={18}
              className={`transition-transform text-white ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Profile Card Dropdown */}
          {profileOpen && (
            <div className="border-t border-gray-100 px-4 py-2 bg-gray-800 rounded-xl">
              <button
                onClick={async () => {
                  await auth.signOut();
                  router.push("/");
                }}
                className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={20} className="text-red-500" />
                <span className="font-bold">Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
        />
      )}
    </>
  );
}
