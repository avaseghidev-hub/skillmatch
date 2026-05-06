import { Button } from "./Button";
import { Modal } from "./Modal";
import { Spinner } from "./Spinner";

interface ConfirmModalProps {
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ConfirmModal = ({
  title,
  description,
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmModalProps) => {
  return (
    <Modal title={title} onClose={onCancel} size="md">
      <div className="space-y-4 text-sm">
        <p className="opacity-80">{description}</p>

        <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border)]">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>

          <Button onClick={onConfirm} disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Spinner />
                Deleting...
              </span>
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};