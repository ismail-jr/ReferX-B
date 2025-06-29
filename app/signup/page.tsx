import AuthLayout from "@/components/auth/AuthLayout";
import SignupForm from "@/components/auth/SignupForm";
import { Toaster } from "react-hot-toast";

export default function SignupPage() {
  return (
    <>
      <AuthLayout>
        <SignupForm />
      </AuthLayout>

      <Toaster position="top-center" />
    </>
  );
}
