import { FC, useState } from "react";
import { BsYoutube } from "react-icons/bs";
import Button from "../ToolBar/Button";

interface Props {
  onSubmit(link: string): void;
  onToggle?(isOpen: boolean): void;
}

const EmbedYoutube: FC<Props> = ({ onSubmit, onToggle }): JSX.Element => {
  const [url, setUrl] = useState("");
  const [visible, setVisible] = useState(false);

  const handleSubmit = () => {
    if (!url.trim()) return hideForm();

    onSubmit(url);
    setUrl("");
    hideForm();
  };

  const hideForm = () => {
    setVisible(false);
    onToggle?.(false);
  };
  
  const showForm = () => {
    setVisible(true);
    onToggle?.(true);
  };

  return (
    <div
      onKeyDown={({ key }) => {
        if (key === "Escape") hideForm();
      }}
      className="relative"
    >
      <Button onClick={visible ? hideForm : showForm}>
        <BsYoutube />
      </Button>

      {visible && (
        <div className="absolute top-full mt-4 right-0 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 min-w-[320px]">
          <div className="flex flex-col space-y-3">
            <input
              autoFocus
              type="text"
              className="w-full bg-white dark:bg-gray-800 rounded border-2 border-secondary-dark focus:border-primary-dark dark:focus:border-primary transition p-2 text-primary-dark dark:text-primary"
              placeholder="https://youtube.com/watch?v=..."
              value={url}
              onChange={({ target }) => setUrl(target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSubmit();
                }
              }}
            />
            <div className="flex space-x-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSubmit();
                }}
                className="bg-blue-600 hover:bg-blue-700 px-3 py-2 text-white rounded text-sm font-medium transition-colors shadow-sm"
              >
                Chèn
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  hideForm();
                }}
                className="bg-gray-200 dark:bg-gray-600 px-3 py-2 text-gray-700 dark:text-gray-300 rounded text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmbedYoutube;
