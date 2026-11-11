import { useState } from "react";
import SettingsDialog from "./SettingsDialog";
import SettingsForm from "./SettingsForm";

export default function Settings() {
  const [openDialog, setOpenDialog] = useState(false);
  return (
    <SettingsDialog open={openDialog} setOpen={setOpenDialog}>
      <SettingsForm
        onSuccess={() => setOpenDialog(false)}
        onCancel={() => setOpenDialog(false)}
      />
    </SettingsDialog>
  );
}
