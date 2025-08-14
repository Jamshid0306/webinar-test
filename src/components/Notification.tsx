// src/components/Notification.tsx
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { clearNotification } from "../store/notificationSlice";
import { AppDispatch } from "../store/store";

interface Props {
  message: string;
  type: "success" | "error";
}

export default function Notification({ message, type }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 3000);
    const removeTimer = setTimeout(() => dispatch(clearNotification()), 3500);
    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, [dispatch]);

  return (
    <div
      className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg text-white transform transition-all duration-500 ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
      } ${type === "success" ? "bg-green-500" : "bg-red-500"}`}
    >
      {message}
    </div>
  );
}
