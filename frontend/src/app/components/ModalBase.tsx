import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { FaXmark } from "react-icons/fa6";
import { CustomModalProps } from "@/app/types/index";

interface ModalProps extends CustomModalProps {
  title: string;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop is outside Panel */}
      <div className="fixed inset-0 bg-foreground/[0.5]" aria-hidden="true" />

      {/* Center the panel */}
      <div className="fixed inset-0 flex items-center justify-center">
        <DialogPanel className="bg-background p-6 rounded-xl border-light-foreground border-3 w-full max-w-xl">
          {/* Close button */}
          <div className="relative -top-4 -right-4 flex justify-end hover-animation">
            <button onClick={onClose} className="cursor-pointer hover:bg-foreground/[0.2] w-10 h-10 p-2 rounded-full">
              <FaXmark className="w-full h-full" />
            </button>
          </div>
          <main className="relative -top-4 text-center">
            <DialogTitle className="text-2xl font-semibold">{title}</DialogTitle>
            {children}
          </main>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
export default Modal;