import { Download, FileDown, FileUp, Save, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ActionButton from "../../../components/ui/ActionButton.jsx";
import SelectMenu from "../../../components/ui/SelectMenu.jsx";
import {
  createLibraryBackup,
  deleteLibraryBackup,
  exportLibraryCsv,
  importLibraryBackup,
  listLibraryBackups,
  loadLibraryBackup,
} from "../../library/utils/libraryClient.js";

function ApplicationBackupPanel() {
  const [backups, setBackups] = useState([]);
  const [selectedBackupId, setSelectedBackupId] = useState("");
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

      const preferredBackupExists = safeBackups.some(
        (backup) => backup.id === preferredBackupId,
      );

      if (preferredBackupExists) {
        setSelectedBackupId(preferredBackupId);
      } else {
        setSelectedBackupId(safeBackups[0]?.id ?? "");
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

  function handleLoadBackup() {
    if (!selectedBackupId) {
      setStatusMessage("Pick a backup first.");
      return;
    }

    runBackupAction(
      () => loadLibraryBackup(selectedBackupId),
      (items) => `Loaded ${items.length} applications from backup.`,
      selectedBackupId,
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

  function handleImportBackup() {
    runBackupAction(
      () => importLibraryBackup(),
      (result) =>
        result.canceled
          ? "Import canceled."
          : `Imported ${result.items.length} applications.`,
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
    <div className="settings-card settings-card-padded applications-backup-panel">
      <div className="settings-card-header">
        <h3 className="settings-card-title">📦 Application backups</h3>
        <p className="settings-card-description">
          Save snapshots, restore from a saved backup, import JSON/CSV, or
          export a CSV that opens cleanly in Google Sheets.
        </p>
      </div>

      <div className="applications-backup-controls">
        {hasBackups ? (
          <div className="applications-backup-select-row">
            <SelectMenu
              value={selectedBackupId}
              onChange={setSelectedBackupId}
              options={backupOptions}
              placeholder="Select backup"
              className="applications-backup-select"
            />

            <ActionButton
              onClick={handleLoadBackup}
              tone="violet"
              withIcon
              className="applications-backup-button"
              disabled={isBusy}
            >
              <Download size={16} className="shrink-0" />
              <span>Load</span>
            </ActionButton>

            <ActionButton
              onClick={handleDeleteBackup}
              tone="default"
              withIcon
              className="applications-backup-button"
              disabled={isBusy}
            >
              <Trash2 size={16} className="shrink-0" />
              <span>Delete</span>
            </ActionButton>
          </div>
        ) : null}

        <div className="applications-backup-action-row">
          <ActionButton
            onClick={handleCreateBackup}
            tone="sky"
            withIcon
            disabled={isBusy}
          >
            <Save size={16} className="shrink-0" />
            <span>Backup</span>
          </ActionButton>

          <ActionButton
            onClick={handleImportBackup}
            tone="default"
            withIcon
            disabled={isBusy}
          >
            <FileUp size={16} className="shrink-0" />
            <span>Import</span>
          </ActionButton>

          <ActionButton
            onClick={handleExportCsv}
            tone="pink"
            withIcon
            disabled={isBusy}
          >
            <FileDown size={16} className="shrink-0" />
            <span>Export Sheet</span>
          </ActionButton>
        </div>
      </div>

      {statusMessage ? (
        <p className="applications-backup-status">
          {isBusy ? "Working... " : ""}
          {statusMessage}
        </p>
      ) : null}
    </div>
  );
}

export default ApplicationBackupPanel;
