/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";

const DeleteConfirmationDialog = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto p-6 bg-background rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Confirm Deletion
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-foreground/80">
          Are you sure you want to delete this item? This action cannot be
          undone.
        </p>
        <DialogFooter className="flex justify-end gap-3 mt-4">
          <Button
            variant="outline"
            className="bg-background hover:cursor-pointer hover:opacity-80 hover:bg-background"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="bg-failure hover:cursor-pointer hover:opacity-90"
            onClick={onConfirm}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
