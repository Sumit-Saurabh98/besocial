import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

// eslint-disable-next-line react/prop-types
const UnfollowDialog = ({dialogOpen, setDialogOpen}) => {
  return (
    <Dialog open={dialogOpen}>
      <DialogContent onInteractOutside={() => setDialogOpen(false)}>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
        </DialogHeader>
        <div className="mt-2 flex justify-end gap-x-4">
            <Button className="bg-red-500 hover:bg-red-600 text-white">Unfollow</Button>
          <Button className="bg-gray-500 hover:bg-gray-600 text-white" onClick={() => setDialogOpen(false)}>Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UnfollowDialog;
