"use client"
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface ModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export const Modal = ({ title, children, onClose }: ModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg w-1/2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <Button variant="secondary" size="sm" onClick={onClose}>X</Button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}
