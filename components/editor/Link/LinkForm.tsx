import { FC, useEffect, useState } from "react";
import { validateUrl } from "../EditorUtils";

interface Props {
  visible: boolean;
  onSubmit(link: linkOption): void;
  initialState?: linkOption;
}

export type linkOption = {
  url: string;
  openInNewTab: boolean;
};

const defaultLink = {
  url: "",
  openInNewTab: false,
};

const LinkForm: FC<Props> = ({
  visible,
  initialState,
  onSubmit,
}): JSX.Element | null => {
  const [link, setLink] = useState<linkOption>(defaultLink);

  const handleSubmit = () => {
    onSubmit({ ...link, url: validateUrl(link.url) });
    resetForm();
  };

  const resetForm = () => {
    setLink({ ...defaultLink });
  };

  useEffect(() => {
    if (initialState) setLink({ ...initialState });
  }, [initialState]);

  if (!visible) return null;

  return (
    <div className="rounded p-2 bg-primary dark:bg-primary-dark shadow-sm shadow-secondary-dark">
      <input
        autoFocus
        type="text"
        className="bg-white dark:bg-gray-800 rounded border-2 border-secondary-dark focus:border-primary-dark dark:focus:border-primary transition p-2 text-primary-dark dark:text-primary"
        placeholder="https://mcbacgiang.com"
        value={link.url}
        onChange={({ target }) => setLink({ ...link, url: target.value })}
      />

      <div className="flex items-center space-x-2 mt-2">
        <input
          type="checkbox"
          id="open-in-new-tab"
          checked={link.openInNewTab}
          onChange={({ target }) =>
            setLink({ ...link, openInNewTab: target.checked })
          }
        />
        <label
          className="text-secondary-dark dark:text-secondary-light"
          htmlFor="open-in-new-tab"
        >
          Mở trong tad mới
        </label>

        <div className="flex-1 text-right">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 px-3 py-2 text-white rounded text-sm font-medium transition-colors shadow-sm"
          >
            Chèn link
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkForm;
