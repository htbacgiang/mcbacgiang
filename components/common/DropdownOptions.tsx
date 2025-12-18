import { FC, ReactNode, useState, useRef, useEffect } from "react";
import Button from "../editor/ToolBar/Button";

export type dropDownOptions = { label: string; onClick(): void }[];

interface Props {
  options: dropDownOptions;
  head: ReactNode;
  onToggle?(isOpen: boolean): void;
}

const DropdownOptions: FC<Props> = ({ head, options, onToggle }): JSX.Element => {
  const [showOptions, setShowOptions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = (isOpen: boolean) => {
    setShowOptions(isOpen);
    onToggle?.(isOpen);
  };

  const handleOptionClick = (onClick: () => void) => {
    onClick();
    handleToggle(false); // Ẩn dropdown sau khi chọn option
  };

  // Xử lý click ra ngoài để ẩn dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        handleToggle(false);
      }
    };

    if (showOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOptions]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="flex items-center gap-1 text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-2 py-1 transition-colors border-none bg-transparent"
        onClick={() => handleToggle(!showOptions)}
      >
        {head}
      </button>
      {showOptions && (
        <div className="min-w-max absolute top-full mt-2 right-0 z-40 border border-gray-300 dark:border-gray-600 rounded-md text-left bg-white dark:bg-gray-800 shadow-lg">
          <ul className="py-2 space-y-1">
            {options.map(({ label, onClick }, index) => {
              return (
                <li
                  className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  key={label + index}
                  onClick={() => handleOptionClick(onClick)}
                >
                  {label}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownOptions;
