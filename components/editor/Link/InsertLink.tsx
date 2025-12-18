import { FC, useState } from "react";
import { BsLink45Deg } from "react-icons/bs";
import Button from "../ToolBar/Button";
import LinkForm, { linkOption } from "./LinkForm";

interface Props {
  onSubmit(link: linkOption): void;
  onToggle?(isOpen: boolean): void;
}

const InsertLink: FC<Props> = ({ onSubmit, onToggle }): JSX.Element => {
  const [visible, setVisible] = useState(false);

  const handleSubmit = (link: linkOption) => {
    if (!link.url.trim()) return hideForm();

    onSubmit(link);
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
        <BsLink45Deg />
      </Button>

      {visible && (
        <div className="absolute top-full mt-4 right-0 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 min-w-[320px]">
          <LinkForm visible={visible} onSubmit={handleSubmit} />
        </div>
      )}
    </div>
  );
};

export default InsertLink;
