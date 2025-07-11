"use client";

import {
  Copy,
  Share2,
  Mail,
  MessagesSquare,
  Facebook,
  Twitter,
  LinkIcon,
} from "lucide-react";
import { toast } from "react-hot-toast";
import QRCode from "../components/QRcode";

export default function ReferralTools({
  referralLink,
}: {
  referralLink: string;
}) {
  if (!referralLink) {
    return (
      <div className="bg-white text-gray-600 p-6 rounded-xl border border-gray-200 text-center">
        Referral link not available. Please try again later.
      </div>
    );
  }

  const referralCode = referralLink.split("ref=")[1] || "N/A";

  const shareViaEmail = () => {
    const subject = "Join me and earn rewards!";
    const body = `Hi there,\n\nUse my referral link and earn rewards!\n\n${referralLink}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const shareViaSMS = () => {
    const message = `Join me and earn rewards! Use my referral link: ${referralLink}`;
    window.location.href = `sms:?&body=${encodeURIComponent(message)}`;
  };

  const shareOnSocial = (platform: string) => {
    let url = "";
    const text = "Join me and earn rewards with this referral link!";

    switch (platform) {
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          referralLink
        )}`;
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          text
        )}&url=${encodeURIComponent(referralLink)}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          referralLink
        )}`;
        break;
      default:
        return;
    }

    window.open(url, "_blank", "width=600,height=400");
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      toast.success("Referral link copied to clipboard!", {
        position: "top-center",
        style: {
          background: "#f0fdf4",
          color: "#166534",
          border: "1px solid #bbf7d0",
        },
      });
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      toast.success("Referral code copied!", {
        position: "top-center",
      });
    } catch {
      toast.error("Failed to copy code.");
    }
  };

  return (
    <div className="bg-gradient-to-r from-white to-gray-300 rounded-xl shadow-sm p-6 text-white">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-blue-900">Your Referral Tools</h2>
        <div className="flex gap-2">
          <button
            onClick={copyLink}
            className="bg-blue-900 text-white px-3 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:opacity-90 transition"
          >
            <Copy size={16} /> Copy Link
          </button>
          <button
            onClick={() =>
              navigator
                .share?.({
                  title: "Join me and earn rewards!",
                  text: "Use my referral link to sign up:",
                  url: referralLink,
                })
                .catch(() => toast.error("Sharing not supported"))
            }
            className="bg-blue-700 text-white px-3 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:opacity-90 transition"
          >
            <Share2 size={16} /> Share
          </button>
        </div>
      </div>

      <p className="text-blue-900 mb-4">
        Share this link and earn rewards for every friend who joins!
      </p>

      {referralLink && <QRCode referralLink={referralLink} />}

      <div className="bg-gray-100 p-3 rounded-lg overflow-x-auto mb-2">
        <p className="text-sm text-gray-700 mb-1 font-medium">
          Full Referral Link:
        </p>
        <code className="text-blue-700 break-all">{referralLink}</code>
      </div>

      <div className="bg-gray-200 p-3 rounded-lg overflow-x-auto mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-700 font-medium">
            Your Referral Code:
          </p>
          <code className="text-blue-800 font-semibold text-lg">
            {referralCode}
          </code>
        </div>
        <button
          onClick={copyCode}
          className="text-sm text-blue-600 underline ml-2"
        >
          Copy Code
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={shareViaEmail}
          className="bg-white text-gray-800 border border-gray-300 px-3 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-gray-100 transition"
        >
          <Mail size={16} /> Email
        </button>
        <button
          onClick={shareViaSMS}
          className="bg-white text-gray-800 border border-gray-300 px-3 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-gray-100 transition"
        >
          <MessagesSquare size={16} /> SMS
        </button>
        <button
          onClick={() => shareOnSocial("facebook")}
          className="bg-white text-gray-800 border border-gray-300 px-3 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-gray-100 transition"
        >
          <Facebook size={16} className="text-blue-600" /> Facebook
        </button>
        <button
          onClick={() => shareOnSocial("twitter")}
          className="bg-white text-gray-800 border border-gray-300 px-3 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-gray-100 transition"
        >
          <Twitter size={16} className="text-blue-400" /> Twitter
        </button>
        <button
          onClick={() => shareOnSocial("linkedin")}
          className="bg-white text-gray-800 border border-gray-300 px-3 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-gray-100 transition"
        >
          <LinkIcon size={16} className="text-blue-700" /> LinkedIn
        </button>
      </div>
    </div>
  );
}
