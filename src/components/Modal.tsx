import { ReactNode, useEffect } from "react";
import { HiOutlineXMark } from "react-icons/hi2";

type Props = {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
};

export default function Modal({
  children,
  isOpen,
  onClose,
}: Props): JSX.Element | null {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed left-0 top-0 flex h-screen w-screen items-center justify-center bg-slate-600 bg-opacity-85">
      <div className="relative rounded-lg bg-white p-8 pt-12">
        <button className="absolute right-2 top-2" onClick={onClose}>
          <HiOutlineXMark className="text-lg" />
        </button>
        {children}
      </div>
    </div>
  );
}
