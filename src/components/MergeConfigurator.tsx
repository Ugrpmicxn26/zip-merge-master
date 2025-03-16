
import React, { useState, useMemo } from "react";
import { FileData } from "@/utils/fileUtils";
import { toast } from "sonner";

// Import refactored components
import ActionTabs, { ACTION_TYPES } from "./merge/ActionTabs";
import MergeTab from "./merge/MergeTab";
import DropColumnsTab from "./merge/DropColumnsTab";
import DropRowsTab from "./merge/DropRowsTab";
import RenameColumnsTab from "./merge/RenameColumnsTab";
import TrimColumnsTab from "./merge/TrimColumnsTab";
import PivotTab from "./merge/PivotTab";
import EmptyFilesMessage from "./merge/EmptyFilesMessage";

interface MergeConfiguratorProps {
  files: FileData[];
  onMergeComplete: (data: any[], updatedFiles?: FileData[], saveAsMergedFile?: boolean) => void;
}

const MergeConfigurator: React.FC<MergeConfiguratorProps> = ({ files, onMergeComplete }) => {
  const [currentAction, setCurrentAction] = useState<string>(ACTION_TYPES.MERGE);
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedFiles = useMemo(() => files.filter(file => file.selected), [files]);
  
  const handleComplete = (data: any[], updatedFiles?: FileData[], saveAsMergedFile?: boolean) => {
    setIsProcessing(false);
    onMergeComplete(data, updatedFiles, saveAsMergedFile);
  };

  const handleActionStart = (callback: () => void) => {
    setIsProcessing(true);
    try {
      callback();
    } catch (error) {
      console.error("Error processing action:", error);
      toast.error("An unexpected error occurred");
      setIsProcessing(false);
    }
  };

  if (selectedFiles.length === 0) {
    return <EmptyFilesMessage />;
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="space-y-2">
        <h2 className="text-lg font-medium">Configure Data Transformation</h2>
        <p className="text-sm text-muted-foreground">
          Select options to merge, drop columns, filter rows, rename columns, trim values, or create pivot tables
        </p>
      </div>

      <ActionTabs currentAction={currentAction} setCurrentAction={setCurrentAction} />

      {currentAction === ACTION_TYPES.MERGE && (
        <MergeTab 
          files={files} 
          selectedFiles={selectedFiles} 
          isProcessing={isProcessing} 
          onComplete={handleComplete} 
        />
      )}

      {currentAction === ACTION_TYPES.DROP_COLUMNS && (
        <DropColumnsTab 
          files={files} 
          selectedFiles={selectedFiles} 
          isProcessing={isProcessing} 
          onComplete={handleComplete} 
        />
      )}

      {currentAction === ACTION_TYPES.DROP_ROWS && (
        <DropRowsTab 
          files={files} 
          selectedFiles={selectedFiles} 
          isProcessing={isProcessing} 
          onComplete={handleComplete} 
        />
      )}

      {currentAction === ACTION_TYPES.RENAME_COLUMNS && (
        <RenameColumnsTab 
          files={files} 
          selectedFiles={selectedFiles} 
          isProcessing={isProcessing} 
          onComplete={handleComplete} 
        />
      )}

      {currentAction === ACTION_TYPES.TRIM_COLUMNS && (
        <TrimColumnsTab 
          files={files} 
          selectedFiles={selectedFiles} 
          isProcessing={isProcessing} 
          onComplete={handleComplete} 
        />
      )}

      {currentAction === ACTION_TYPES.PIVOT && (
        <PivotTab 
          files={files} 
          selectedFiles={selectedFiles} 
          isProcessing={isProcessing} 
          onComplete={handleComplete} 
        />
      )}
    </div>
  );
};

export default MergeConfigurator;
