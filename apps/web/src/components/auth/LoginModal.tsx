"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

import LoginForm from "./LoginForm";

interface LoginModalProps {
  children: React.ReactNode;
}

export default function LoginModal({
  children,
}: LoginModalProps) {
  return (
    <Dialog>
      <DialogTrigger >
        {children}
      </DialogTrigger>

      <DialogContent className="max-w-md p-0">
        <LoginForm />
      </DialogContent>
    </Dialog>
  );
}