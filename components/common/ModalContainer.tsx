import {
  FC,
  MouseEventHandler,
  ReactNode,
  useCallback,
  useEffect,
  useId,
} from "react";

export interface ModalProps {
  visible?: boolean;
  onClose?(): void;
}

interface Props extends ModalProps {
  children: ReactNode;
}

const ModalContainer: FC<Props> = ({
  visible,
  children,
  onClose,
}): JSX.Element | null => {
  const containerId = useId();
  const handleClose = useCallback(() => onClose && onClose(), [onClose]);

  const handleClick = ({ target }: any) => {
    if (target.id === containerId) handleClose();
  };

  useEffect(() => {
    const closeModal = ({ key }: any) => key === "Escape" && handleClose();

    document.addEventListener("keydown", closeModal);
    return () => document.removeEventListener("keydown", closeModal);
  }, [handleClose]);

  if (!visible) return null;
  return (
    <div
      id={containerId}
      onClick={handleClick}
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-[4px] z-[99999] flex items-center justify-center p-4"
    >
      {children}
    </div>
  );
};

export default ModalContainer;
