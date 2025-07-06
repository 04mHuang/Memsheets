import { FaCheck } from "react-icons/fa6";
import { FaXmark } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";

interface EditButtonsProps {
  mode: boolean;
  modeToggle?: () => void;
  cancel: () => void;
};

const EditButtons = ({ mode, modeToggle, cancel }: EditButtonsProps) => {
  return (
    <div className="flex justify-end gap-2">
      <button
        onClick={modeToggle}
        className="bg-support h-10 w-10 rounded-4xl p-2 text-foreground hover:cursor-pointer hover:bg-dark-support hover:text-background"
      >
        {mode ? <FaCheck className="w-full h-full" /> : <MdEdit className="w-full h-full" />}
      </button>
      {mode && (
        <button
          onClick={(e) => { e.preventDefault(); cancel(); }}
          className="border-2 border-accent h-10 w-10 rounded-4xl p-2 text-foreground hover:cursor-pointer hover:bg-accent hover:text-background"
        >
          <FaXmark className="w-full h-full" />
        </button>
      )}
    </div>
  );
}
export default EditButtons;