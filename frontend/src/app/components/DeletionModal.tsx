"use client";

import { useRef } from "react";

import { BsPatchExclamation } from "react-icons/bs";
import ModalBase from "@/app/components/ModalBase";

interface DeletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: string;
  handleDelete: (del_sheets: number) => void;
}

const DeletionModal = ({ isOpen, onClose, subject, handleDelete }: DeletionModalProps) => {
  const deleteSheetsRef = useRef<HTMLInputElement>(null);
  // Will be either "Group" or "Sheet"
  const subjectType = subject.slice(-5);
  const subjectName = subject.slice(0, -6);

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title={`Delete ${subjectType}`} >

      <p className="mt-2">Are you sure you want to delete <strong>{subjectName}</strong>?</p>
      <p>This action cannot be undone.</p>
      <div className="mx-4 mt-4 mb-1 text-left p-2 bg-support/[0.3] border-l-5 border-support flex items-center rounded-sm">
        <BsPatchExclamation className="w-25 h-full mr-4 text-dark-support" />
        <p>
          If you wish to delete all instances of <strong>{subjectName}</strong>&apos;s
          sheets from other groups, check the checkbox below.
        </p>
      </div>
      <label className="flex gap-2 items-center justify-center">
        <input type="checkbox" className="mt-1 cursor-pointer" ref={deleteSheetsRef} />
        <span className="cursor-pointer hover:text-dark-support hover-animation">Delete sheets</span>
      </label>
      <div className="mt-8 mx-5 flex justify-between">
        <button
          onClick={onClose}
          className="border-light-foreground border-1 px-4 py-2 rounded-sm cursor-pointer hover:bg-foreground/[0.1] hover-animation"
        >
          Cancel
        </button>
        <button
          onClick={() => handleDelete(deleteSheetsRef.current?.checked ? 1 : 0)}
          className="bg-accent border-accent border-1 text-background px-4 py-2 rounded-sm cursor-pointer hover:bg-red-400 hover:border-red-400 hover-animation"
        >
          Delete
        </button>
      </div>
    </ModalBase>
  );
}
export default DeletionModal;