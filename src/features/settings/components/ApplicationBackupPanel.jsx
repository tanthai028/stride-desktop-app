import { FileDown, Save, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ActionButton from "../../../components/ui/ActionButton.jsx";
import SelectMenu from "../../../components/ui/SelectMenu.jsx";
import {
  createLibraryBackup,
  deleteLibraryBackup,
  exportLibraryCsv,
  listLibraryBackups,
  loadLibraryBackup,
} from "../../library/utils/libraryClient.js";

const SELECTED_BACKUP_STORAGE_KEY = "stride:selected-application-backup-id";

function ApplicationBackupPanel() {
  const [backups, setBackups] = useState([]);
  const [selectedBackupId, setSelectedBackupId] = useState(
    () => localStorage.getItem(SELECTED_BACKUP_STORAGE_KEY) || "",
  );
  const [statusMessage, setStatusMessage] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  const hasBackups = backups.length > 0;

  const backupOptions = useMemo(
    () =>
      backups.map((backup) => ({
        label: backup.label,
        value: backup.id,
      })),
    [backups],
  );

  useEffect(() => {
    refreshBackups();
  }, []);

  async function refreshBackups(preferredBackupId = "") {
    try {
      const nextBackups = await listLibraryBackups();
      const safeBackups = Array.isArray(nextBackups) ? nextBackups : [];

      setBackups(safeBackups);

      const backupIdToKeep = preferredBackupId || selectedBackupId;

      const backupToKeepExists = safeBackups.some(
        (backup) => backup.id === backupIdToKeep,
      );

      if (backupToKeepExists) {
        updateSelectedBackupId(backupIdToKeep);
      } else {
        updateSelectedBackupId(safeBackups[0]?.id ?? "");
      }

      return safeBackups;
    } catch (error) {
      setStatusMessage(error?.message || "Could not read backups.");
      return [];
    }
  }

  async function runBackupAction(
    action,
    successMessage,
    preferredBackupId = "",
  ) {
    setIsBusy(true);
    setStatusMessage("");

    try {
      const result = await action();
      await refreshBackups(preferredBackupId);
      setStatusMessage(successMessage(result));
    } catch (error) {
      setStatusMessage(error?.message || "Backup action failed.");
    } finally {
      setIsBusy(false);
    }
  }

  async function handleCreateBackup() {
    setIsBusy(true);
    setStatusMessage("");

    try {
      const previousBackupIds = backups.map((backup) => backup.id);

      const createdBackup = await createLibraryBackup("applications");

      const nextBackups = await refreshBackups(createdBackup.id);

      const isNewBackup = !previousBackupIds.includes(createdBackup.id);

      if (!isNewBackup) {
        setStatusMessage(`Saved backup: ${createdBackup.label}`);
        return;
      }

      const createdBackupStillExists = nextBackups.some(
        (backup) => backup.id === createdBackup.id,
      );

      if (createdBackupStillExists) {
        setStatusMessage(`Saved backup: ${createdBackup.label}`);
      }
    } catch (error) {
      setStatusMessage(error?.message || "Backup action failed.");
    } finally {
      setIsBusy(false);
    }
  }

  function updateSelectedBackupId(backupId) {
    setSelectedBackupId(backupId);

    if (backupId) {
      localStorage.setItem(SELECTED_BACKUP_STORAGE_KEY, backupId);
    } else {
      localStorage.removeItem(SELECTED_BACKUP_STORAGE_KEY);
    }
  }

  function handleBackupSelection(backupId) {
    updateSelectedBackupId(backupId);

    if (!backupId || isBusy) {
      return;
    }

    runBackupAction(
      () => loadLibraryBackup(backupId),
      (items) => `Loaded ${items.length} applications.`,
      backupId,
    );
  }

  function handleDeleteBackup() {
    if (!selectedBackupId) {
      setStatusMessage("Pick a backup first.");
      return;
    }

    const deletedBackupId = selectedBackupId;

    runBackupAction(
      () => deleteLibraryBackup(deletedBackupId),
      (result) =>
        result.deleted
          ? "Deleted selected backup."
          : "Backup was already missing.",
    );
  }

  function handleExportCsv() {
    runBackupAction(
      () => exportLibraryCsv(),
      (result) =>
        result.canceled
          ? "Export canceled."
          : `Exported ${result.itemCount} applications as a Google Sheets-ready CSV.`,
    );
  }

  return (
    <div className="settings-data-panel">
      <div className="settings-data-panel-section">
        <div className="settings-card-header">
          <p className="settings-card-title">Snapshots</p>
          <p className="settings-card-description">
            Save your current applications or restore from a previous snapshot.
          </p>
        </div>

        <div className="settings-backup-controls">
          <div className="settings-backup-select-row">
            {hasBackups ? (
              <SelectMenu
                value={selectedBackupId}
                onChange={handleBackupSelection}
                options={backupOptions}
                placeholder="Select backup"
                className="settings-backup-select"
              />
            ) : null}

            <ActionButton
              onClick={handleCreateBackup}
              tone="sky"
              withIcon
              disabled={isBusy}
            >
              <Save size={14} className="shrink-0" />
              <span>Save</span>
            </ActionButton>

            <ActionButton
              onClick={handleExportCsv}
              tone="pink"
              withIcon
              disabled={isBusy}
            >
              <FileDown size={14} className="shrink-0" />
              <span>Export</span>
            </ActionButton>

            {hasBackups ? (
              <ActionButton
                onClick={handleDeleteBackup}
                tone="red"
                withIcon
                disabled={isBusy}
              >
                <Trash2 size={14} className="shrink-0" />
                <span>Delete</span>
              </ActionButton>
            ) : null}
          </div>
        </div>
      </div>

      {statusMessage ? (
        <p className="settings-backup-status">
          {isBusy ? "Working… " : ""}
          {statusMessage}
        </p>
      ) : null}
    </div>
  );
}

export default ApplicationBackupPanel;
